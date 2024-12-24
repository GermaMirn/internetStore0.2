from django.db import models
from accounts.models import Profile
from store.models import Order
from channels.db import database_sync_to_async


class Chat(models.Model):
	participants = models.ManyToManyField(Profile, related_name='chats')
	created_at = models.DateTimeField(auto_now_add=True)
	order = models.OneToOneField(Order, null=True, blank=True, on_delete=models.SET_NULL, related_name='chat')

	def __str__(self):
		return f"{self.id} между {' и '.join([p.user.username for p in self.participants.all()])}"


class Message(models.Model):
	chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
	sender = models.ForeignKey(Profile, related_name='sent_messages', on_delete=models.CASCADE)
	text = models.TextField(null=True, blank=True)
	image = models.ImageField(upload_to='chatImages/', null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	is_read = models.BooleanField(default=False)

	def __str__(self):
		return f"Сообщение {self.id} от {self.sender.user.username}"

	@database_sync_to_async
	def get_sender_username(self):
		return self.sender.user.username if self.sender else 'Unknown'
