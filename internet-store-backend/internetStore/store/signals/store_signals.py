import os
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.apps import apps


@receiver(post_delete, sender='store.Product')
def auto_product_delete_file_on_delete(sender, instance, **kwargs):
	if instance.mainImage and os.path.isfile(instance.mainImage.path):
		os.remove(instance.mainImage.path)

	for product_image in instance.productImages.all():
		if os.path.isfile(product_image.image.path):
			os.remove(product_image.image.path)


@receiver(post_save, sender='store.Product')
def update_cart_items_on_product_change(sender, instance, **kwargs):
	CartItem = apps.get_model('store', 'CartItem')
	cart_items = CartItem.objects.filter(product=instance)
	for cart_item in cart_items:
		cart_item.recalculate_price()


@receiver(post_delete, sender='store.ProductImage')
def auto_product_image_delete_on_delete(sender, instance, **kwargs):
	if os.path.isfile(instance.image.path):
		os.remove(instance.image.path)


@receiver(post_save, sender='store.ProductHeart')
def increase_product_hearts(sender, instance, **kwargs):
	Product = apps.get_model('store', 'Product')
	instance.product.hearts += 1
	instance.product.save()


@receiver(post_delete, sender='store.ProductHeart')
def decrease_product_hearts(sender, instance, **kwargs):
	Product = apps.get_model('store', 'Product')
	instance.product.hearts -= 1
	instance.product.save()


@receiver(post_delete, sender='store.Review')
def auto_review_delete_file_on_delete(sender, instance, **kwargs):
	if instance.images and os.path.isfile(instance.images.path):
		os.remove(instance.images.path)

	for review_image in instance.reviewImages.all():
		if os.path.isfile(review_image.image.path):
			os.remove(review_image.image.path)


@receiver(post_delete, sender='store.ReviewImage')
def auto_review_image_delete_on_delete(sender, instance, **kwargs):
	if os.path.isfile(instance.image.path):
		os.remove(instance.image.path)


@receiver(post_save, sender='store.ReviewHeart')
def increase_review_hearts(sender, instance, **kwargs):
	Review = apps.get_model('store', 'Review')
	instance.review.hearts += 1
	instance.review.save()


@receiver(post_delete, sender='store.ReviewHeart')
def decrease_review_hearts(sender, instance, **kwargs):
	Review = apps.get_model('store', 'Review')
	instance.review.hearts -= 1
	instance.review.save()


@receiver(post_delete, sender='store.Comment')
def auto_comment_delete_file_on_delete(sender, instance, **kwargs):
	if instance.images and os.path.isfile(instance.images.path):
		os.remove(instance.images.path)

	for comment_image in instance.commentImages.all():
		if os.path.isfile(comment_image.image.path):
			os.remove(comment_image.image.path)


@receiver(post_delete, sender='store.CommentImage')
def auto_comment_image_delete_on_delete(sender, instance, **kwargs):
	if os.path.isfile(instance.image.path):
		os.remove(instance.image.path)


@receiver(post_save, sender='store.CommentHeart')
def increase_comment_hearts(sender, instance, **kwargs):
	Comment = apps.get_model('store', 'Comment')
	instance.comment.hearts += 1
	instance.comment.save()


@receiver(post_delete, sender='store.CommentHeart')
def decrease_comment_hearts(sender, instance, **kwargs):
	Comment = apps.get_model('store', 'Comment')
	instance.comment.hearts -= 1
	instance.comment.save()


@receiver(post_save, sender='store.CartItem')
def update_cart_total_price(sender, instance, **kwargs):
	instance.cart.update_cart_total_price()


@receiver(post_delete, sender='store.CartItem')
def update_cart_total_price(sender, instance, **kwargs):
	instance.cart.update_cart_total_price()


@receiver(post_save, sender='store.OrderItem')
def update_order_total_price(sender, instance, **kwargs):
	instance.order.update_total_price()


@receiver(post_delete, sender='store.OrderItem')
def update_cart_total_price(sender, instance, **kwargs):
	instance.order.update_total_price()
