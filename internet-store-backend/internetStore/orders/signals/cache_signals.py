from django.dispatch import receiver
from internetStore.utils import clear_chat_cache, delete_cache_admin
from django.db.models.signals import post_save, post_delete


@receiver(post_save, sender='orders.Message')
@receiver(post_delete, sender='orders.Message')
def clear_chat_messages_cache(sender, instance, **kwargs):
	chat_id = instance.chat.id
	clear_chat_cache(chat_id)


@receiver(post_save, sender='orders.Chat')
@receiver(post_delete, sender='orders.Chat')
def clear_chat_messages_cache(sender, instance, **kwargs):
	delete_cache_admin('chats', instance.user.id)
