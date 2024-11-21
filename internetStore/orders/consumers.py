import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat, Message
from .serializers import MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		self.chat_id = self.scope['url_route']['kwargs']['chat_id']
		self.chat_group_name = f'chat_{self.chat_id}'

		user = self.scope.get('user')
		if not user or not user.is_authenticated:
			await self.close()
			return

		chat = await self.get_chat(self.chat_id)
		if not chat:
			await self.send(text_data=json.dumps({
				'error': 'Chat not found.'
			}))
			return

		if not await self.is_participant(user, chat):
			await self.close()
			return

		await self.channel_layer.group_add(
			self.chat_group_name,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.chat_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		text = text_data_json.get('text', None)
		image = text_data_json.get('image', None)
		user = self.scope['user']

		chat = await self.get_chat(self.chat_id)
		if not chat:
			await self.send(text_data=json.dumps({
				'error': 'Chat not found.'
			}))
			return

		if not await self.is_participant(user, chat):
			await self.send(text_data=json.dumps({
				'error': 'You are not a participant of this chat.'
			}))
			return

		if not text and not image:
			await self.send(text_data=json.dumps({
				'error': 'Message must contain either text or image.'
			}))
			return

		message = await self.create_message(chat, user, text, image)

		await self.channel_layer.group_send(
			self.chat_group_name,
			{
				'type': 'chat_message',
				'message': MessageSerializer(message).data
			}
		)

	async def chat_message(self, event):
		message = event['message']
		await self.send(text_data=json.dumps({
			'message': message
		}))

	@database_sync_to_async
	def get_chat(self, chat_id):
		try:
			return Chat.objects.get(id=chat_id)
		except Chat.DoesNotExist:
			return None

	@database_sync_to_async
	def is_participant(self, user, chat):
		return user.profile in chat.participants.all()

	@database_sync_to_async
	def create_message(self, chat, user, text, image):
		return Message.objects.create(
			chat=chat,
			sender=user.profile,
			text=text if text else None,
			image=image if image else None
		)
