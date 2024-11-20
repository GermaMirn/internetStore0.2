import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat, Message
from .serializers import MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.chat_id = self.scope['url_route']['kwargs']['chat_id']
		self.chat_group_name = f'chat_{self.chat_id}'

		chat = await database_sync_to_async(Chat.objects.get)(id=self.chat_id)
		user = self.scope['user']

		if user.profile not in chat.participants.all():
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

		try:
			chat = await database_sync_to_async(Chat.objects.get)(id=self.chat_id)
		except Chat.DoesNotExist:
			await self.send(text_data=json.dumps({
				'error': 'Chat not found.'
			}))
			return

		if user.profile not in chat.participants.all():
			await self.send(text_data=json.dumps({
				'error': 'You are not a participant of this chat.'
			}))
			return

		if not text and not image:
			await self.send(text_data=json.dumps({
				'error': 'Message must contain either text or image.'
			}))
			return

		message = await database_sync_to_async(Message.objects.create)(
			chat=chat,
			sender=user.profile,
			text=text if text else None,
			image=image if image else None
		)

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
