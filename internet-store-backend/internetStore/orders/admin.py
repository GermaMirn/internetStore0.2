from django.contrib import admin
from .models import Chat, Message
from accounts.models import Profile
from django import forms



class ChatAdmin(admin.ModelAdmin):
	list_display = ('id', 'created_at', 'get_participants')
	search_fields = ('id',)
	ordering = ('-created_at',)

	def get_participants(self, obj):
		return ', '.join([profile.user.username for profile in obj.participants.all()])
	get_participants.short_description = 'Участники'


class MessageForm(forms.ModelForm):
	class Meta:
		model = Message
		fields = '__all__'

	def clean_chat(self):
		chat = self.cleaned_data.get('chat')
		if not chat:
			raise forms.ValidationError("Чат обязательно должен быть выбран.")
		return chat

	def clean_sender(self):
		sender = self.cleaned_data.get('sender')
		chat = self.cleaned_data.get('chat')

		if chat and sender:
			if sender not in chat.participants.all():
				raise forms.ValidationError(f"Пользователь {sender.user.username} не является участником этого чата.")
		return sender

	def save(self, commit=True):
		message = super().save(commit=False)
		chat = message.chat
		sender = message.sender

		if sender not in chat.participants.all():
			raise forms.ValidationError(f"Пользователь {sender.user.username} не является участником этого чата.")

		if commit:
			message.save()
		return message

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

		if 'chat' in self.data:
			chat_id = self.data.get('chat')
			if chat_id:
				try:
					chat = Chat.objects.get(id=chat_id)
					self.fields['sender'].queryset = Profile.objects.filter(user__in=chat.participants.all())
				except Chat.DoesNotExist:
					self.fields['sender'].queryset = Profile.objects.none()
		elif self.instance and self.instance.chat:
			chat = self.instance.chat
			self.fields['sender'].queryset = Profile.objects.filter(user__in=chat.participants.all())
		else:
			self.fields['sender'].queryset = Profile.objects.none()

class MessageAdmin(admin.ModelAdmin):
	list_display = ('id', 'chat', 'sender', 'text_preview', 'image', 'created_at', 'is_read')
	search_fields = ('text', 'sender__user__username', 'chat__id')
	list_filter = ('is_read', 'created_at')
	ordering = ('-created_at',)

	def get_form(self, request, obj=None, **kwargs):
		form = super().get_form(request, obj, **kwargs)
		if obj and not obj.chat:
			form.base_fields['chat'].initial = Chat.objects.first()
		return form

	def text_preview(self, obj):
		return obj.text[:50]

	text_preview.short_description = 'Текст'


admin.site.register(Chat, ChatAdmin)
admin.site.register(Message, MessageAdmin)
