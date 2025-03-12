import os
from django.db.models.signals import post_delete
from django.dispatch import receiver


@receiver(post_delete, sender='orders.Chat')
def auto_delete_order_of_chat(sender, instance, **kwargs):
	if instance.order:
		post_delete.disconnect(auto_delete_order_of_chat, sender='orders.Chat')
		try:
			instance.order.delete()
		finally:
			post_delete.connect(auto_delete_order_of_chat, sender='orders.Chat')
