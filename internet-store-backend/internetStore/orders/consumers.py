import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Chat, Message
from .serializers import MessageSerializer
from django.core.files.storage import default_storage


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

		if text_data_json.get('type') == 'mark_as_read':
			message_id = text_data_json.get('message_id')
			await self.mark_as_read({
				'message_id': message_id
			})
			return

		text = text_data_json.get('text', None)
		image = text_data_json.get('image', None)
		user = self.scope['user']

		chat = await self.get_chat(self.chat_id)
		print(image)
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

		if image:
				image_path = await self.save_image(image)
		else:
				image_path = None

		message = await self.create_message(chat, user, text, image_path)

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

	async def mark_as_read(self, event):
		message_id = event['message_id']
		user = self.scope['user']

		message = await self.get_message_by_id(message_id)
		if message:
			sender_username = await message.get_sender_username()

			if user.profile != message.sender:
				await self.update_message_read_status(message, user)
				message_data = await self.get_message_data(message)

				await self.send(text_data=json.dumps({
					'message': message_data,
					'status': 'read'
				}))
			else:
				await self.send(text_data=json.dumps({
					'error': 'You cannot mark your own message as read.'
				}))
		else:
			await self.send(text_data=json.dumps({
				'error': f'Message with ID {message_id} not found.'
			}))

	async def delete_message(self, event):
		message_id = event['message_id']
		message = await self.get_message_by_id(message_id)

		if message and message.sender.user == self.scope['user']:
			await self.delete_message_from_db(message)
			await self.send(text_data=json.dumps({
				'status': 'deleted',
				'message_id': message.id
			}))
		else:
			await self.send(text_data=json.dumps({
				'error': 'You can only delete your own messages.'
			}))

	@database_sync_to_async
	def get_chat(self, chat_id):
		try:
			return Chat.objects.get(id=chat_id)
		except Chat.DoesNotExist:
			return None

	@database_sync_to_async
	def save_image(self, image):
		image_name = f"chatImages/{image.name}"
		image_path = default_storage.save(image_name, image)
		return image_path

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

	@database_sync_to_async
	def get_message_by_id(self, message_id):
		try:
			return Message.objects.get(id=message_id)
		except Message.DoesNotExist:
			return None

	@database_sync_to_async
	def update_message_read_status(self, message, user):
		if not message.is_read:
			message.is_read = True
			message.save()

			# Можете добавить логику для записи, кто именно прочитал это сообщение (если нужно)
			# Например, создавая запись в другой модели, которая хранит информацию о прочтении

	@database_sync_to_async
	def get_message_data(self, message):
		return MessageSerializer(message).data

	@database_sync_to_async
	def delete_message_from_db(self, message):
		message.delete()