from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from internetStore.utils import delete_cache_admin

@receiver(post_save, sender='store.Product')
@receiver(post_save, sender='store.Review')
@receiver(post_save, sender='store.Comment')
@receiver(post_save, sender='store.Cart')
@receiver(post_save, sender='store.Category')
@receiver(post_save, sender='store.Order')
@receiver(post_delete, sender='store.Product')
@receiver(post_delete, sender='store.Review')
@receiver(post_delete, sender='store.Comment')
@receiver(post_delete, sender='store.Cart')
@receiver(post_delete, sender='store.Category')
@receiver(post_delete, sender='store.Order')
def clear_cache(sender, instance, created=None, **kwargs):
	model_name = sender.__name__

	if model_name == 'Product':
		delete_cache_admin('search_page_products', instance.id)
		delete_cache_admin('product_detail', instance.id)
		delete_cache_admin('product_reviews', instance.id)
	elif model_name == 'Review':
		if instance.product:
			delete_cache_admin('product_detail', instance.product.id)
			delete_cache_admin('product_reviews', instance.product.id)
	elif model_name == 'Comment':
		if instance.review and instance.review.product:
			delete_cache_admin('product_detail', instance.review.product.id)
			delete_cache_admin('product_reviews', instance.review.product.id)
	elif model_name == 'Cart':
		delete_cache_admin('shopping_cart', instance.user.id)
	elif model_name == 'Category':
		delete_cache_admin('search_page_products')
	elif model_name == 'Order':
		delete_cache_admin('order_page', instance.user.id)
		delete_cache_admin('chats', instance.user.id)
