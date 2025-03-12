from django.test import TestCase
from store.models import Product, ProductImage, ProductHeart, Review, ReviewImage, ReviewHeart, Comment, CommentImage, CommentHeart, Cart, CartItem, Order, OrderItem
from accounts.models import Profile
from orders.models import Chat
from store.tests.utils import create_product, create_cart_item
from accounts.tests.utils import create_unique_user
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
import os


class ProductSignalsTest(TestCase):
	def test_auto_product_delete_file_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_image.jpg", file_content, content_type="image/jpeg")

		product = create_product()
		product.mainImage = test_image
		product.save()

		expected_main_image_prefix = os.path.join(settings.MEDIA_ROOT, 'products/test_image')

		self.assertTrue(product.mainImage.name.startswith('products/test_image'))

		self.assertTrue(os.path.exists(product.mainImage.path))

		product_image = ProductImage.objects.create(product=product, image="products/test_image2.jpg")

		expected_product_image_path = os.path.join(settings.MEDIA_ROOT, 'products/test_image2.jpg')

		self.assertTrue(product.mainImage.path.startswith(expected_main_image_prefix))
		self.assertTrue(product_image.image.path.startswith(expected_product_image_path))

		product_images = ProductImage.objects.filter(product=product)
		self.assertEqual(product_images.count(), 1)

		product.delete()

		self.assertFalse(os.path.exists(product.mainImage.path))
		self.assertFalse(os.path.exists(product_image.image.path))


class UpdateCartItemsSignalTest(TestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		Cart.objects.filter(user=self.profile).delete()

		if not Cart.objects.filter(user=self.profile).exists():
			Cart.objects.create(user=self.profile)

		self.product = Product.objects.create(name="Test Product", price=100.00)
		self.cart, created = Cart.objects.get_or_create()
		self.cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=2)

	def test_signal_updates_cart_item_price(self):
		self.assertEqual(self.cart_item.price, 200.00)

		self.product.price = 150.00
		self.product.save()

		self.cart_item.refresh_from_db()

		self.assertEqual(self.cart_item.price, 300.00)

	def test_signal_does_not_create_new_cart_items(self):
		initial_cart_items_count = CartItem.objects.count()
		self.product.save()

		self.assertEqual(CartItem.objects.count(), initial_cart_items_count)


class ProductImageSignalsTest(TestCase):
	def test_auto_product_image_delete_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_image.jpg", file_content, content_type="image/jpeg")

		product = create_product()
		product_image = ProductImage.objects.create(product=product, image=test_image)

		self.assertTrue(os.path.exists(product_image.image.path))

		product_image.delete()

		self.assertFalse(os.path.exists(product_image.image.path))



class ProductHeartSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product()

	def test_increase_product_hearts_on_heart_creation(self):
		self.assertEqual(self.product.hearts, 0)

		ProductHeart.objects.create(product=self.product, user=self.profile)
		self.product.refresh_from_db()

		self.assertEqual(self.product.hearts, 1)

	def test_decrease_product_hearts_on_heart_deletion(self):
		heart = ProductHeart.objects.create(product=self.product, user=self.profile)
		self.product.refresh_from_db()
		self.assertEqual(self.product.hearts, 1)

		heart.delete()
		self.product.refresh_from_db()

		self.assertEqual(self.product.hearts, 0)



class ReviewSignalsTest(TestCase):
	def test_auto_review_delete_file_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_image.jpg", file_content, content_type="image/jpeg")

		product = create_product()
		user = create_unique_user()
		profile, created = Profile.objects.get_or_create(user=user)

		review = Review.objects.create(product=product, user=profile, images=test_image)

		self.assertTrue(os.path.exists(review.images.path))

		review.delete()

		self.assertFalse(os.path.exists(review.images.path))

	def test_auto_review_delete_related_images_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_image.jpg", file_content, content_type="image/jpeg")
		test_related_image = SimpleUploadedFile("test_related_image.jpg", file_content, content_type="image/jpeg")

		product = create_product()
		user = create_unique_user()
		profile, created = Profile.objects.get_or_create(user=user)

		review = Review.objects.create(product=product, user=profile, images=test_image)
		review_image = ReviewImage.objects.create(review=review, image=test_related_image)

		self.assertTrue(os.path.exists(review.images.path))
		self.assertTrue(os.path.exists(review_image.image.path))

		review.delete()

		self.assertFalse(os.path.exists(review.images.path))
		self.assertFalse(os.path.exists(review_image.image.path))


class ReviewImageSignalsTest(TestCase):
	def test_auto_review_image_delete_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_image.jpg", file_content, content_type="image/jpeg")

		user = create_unique_user()
		profile, created = Profile.objects.get_or_create(user=user)

		product = create_product()

		review = Review.objects.create(product=product, user=profile)
		review_image = ReviewImage.objects.create(review=review, image=test_image)

		self.assertTrue(os.path.exists(review_image.image.path))

		review_image.delete()

		self.assertFalse(os.path.exists(review_image.image.path))


class ReviewHeartSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = Product.objects.create(name="Test Product", price=10.99)

		self.review = Review.objects.create(product=self.product, user=self.profile, text="Great product")

	def test_increase_review_hearts_on_heart_creation(self):
		self.assertEqual(self.review.hearts, 0)

		ReviewHeart.objects.create(review=self.review, user=self.profile)

		self.review.refresh_from_db()
		self.assertEqual(self.review.hearts, 1)

	def test_decrease_review_hearts_on_heart_deletion(self):
		heart = ReviewHeart.objects.create(review=self.review, user=self.profile)
		self.review.refresh_from_db()
		self.assertEqual(self.review.hearts, 1)

		heart.delete()

		self.review.refresh_from_db()
		self.assertEqual(self.review.hearts, 0)


class CommentSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product()

		self.review = Review.objects.create(product=self.product, user=self.profile, text="Great product")

	def test_auto_comment_delete_file_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_comment_image.jpg", file_content, content_type="image/jpeg")

		comment = Comment.objects.create(review=self.review, user=self.profile, text="This is a comment", images=test_image)

		self.assertTrue(os.path.exists(comment.images.path))

		comment.delete()

		self.assertFalse(os.path.exists(comment.images.path))

	def test_auto_comment_delete_related_images_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_comment_image.jpg", file_content, content_type="image/jpeg")
		test_related_image = SimpleUploadedFile("test_related_comment_image.jpg", file_content, content_type="image/jpeg")

		comment = Comment.objects.create(review=self.review, user=self.profile, text="This is a comment", images=test_image)

		comment_image = CommentImage.objects.create(comment=comment, image=test_related_image)

		self.assertTrue(os.path.exists(comment.images.path))
		self.assertTrue(os.path.exists(comment_image.image.path))

		comment.delete()

		self.assertFalse(os.path.exists(comment.images.path))
		self.assertFalse(os.path.exists(comment_image.image.path))


class CommentImageSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = Product.objects.create(name="Test Product", price=10.99)

		self.review = Review.objects.create(product=self.product, user=self.profile, text="Great product")

		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="This is a comment")

	def test_auto_comment_image_delete_on_delete(self):
		file_content = b"file_content"
		test_image = SimpleUploadedFile("test_comment_image.jpg", file_content, content_type="image/jpeg")

		comment_image = CommentImage.objects.create(comment=self.comment, image=test_image)

		self.assertTrue(os.path.exists(comment_image.image.path))

		comment_image.delete()

		self.assertFalse(os.path.exists(comment_image.image.path))


class CommentHeartSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = Product.objects.create(name="Test Product", price=10.99)

		self.review = Review.objects.create(product=self.product, user=self.profile, text="Great product")

		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="This is a comment")

	def test_increase_comment_hearts_on_heart_creation(self):
		self.assertEqual(self.comment.hearts, 0)

		CommentHeart.objects.create(comment=self.comment, user=self.profile)

		self.comment.refresh_from_db()
		self.assertEqual(self.comment.hearts, 1)

	def test_decrease_comment_hearts_on_heart_deletion(self):
		heart = CommentHeart.objects.create(comment=self.comment, user=self.profile)
		self.comment.refresh_from_db()
		self.assertEqual(self.comment.hearts, 1)

		heart.delete()

		self.comment.refresh_from_db()
		self.assertEqual(self.comment.hearts, 0)


class CartSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.cart, created = Cart.objects.get_or_create(user=self.profile)

		self.product1 = create_product()
		self.product2 = create_product(name="Test Product 2", price=200)

	def test_update_cart_total_price_on_cart_item_creation(self):
		self.assertEqual(getattr(self.cart, 'total_price', 0), 0)

		CartItem.objects.create(cart=self.cart, product=self.product1, quantity=1)
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 100.00)

		CartItem.objects.create(cart=self.cart, product=self.product2, quantity=1)
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 300.00)

	def test_update_cart_total_price_on_cart_item_update(self):
		cart_item = CartItem.objects.create(cart=self.cart, product=self.product1, quantity=1)
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 100.00)

		cart_item.quantity = 2
		cart_item.save()
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 200.00)

	def test_update_cart_total_price_on_cart_item_deletion(self):
		cart_item1 = CartItem.objects.create(cart=self.cart, product=self.product1, quantity=1)
		cart_item2 = CartItem.objects.create(cart=self.cart, product=self.product2, quantity=1)
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 300.00)

		cart_item1.delete()
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 200.00)

		cart_item2.delete()
		self.cart.refresh_from_db()
		self.assertEqual(getattr(self.cart, 'total_price', 0), 0)


class OrderSignalsTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.order = Order.objects.create(user=self.profile)

		self.chat = Chat.objects.create(order=self.order)
		self.chat.participants.add(self.profile)

		self.product1 = create_product()
		self.product2 = create_product(name="Test Product 2", price=200)

	def test_update_order_total_price_on_order_item_creation(self):
		self.assertEqual(self.order.totalPrice, 0)

		OrderItem.objects.create(order=self.order, product=self.product1, quantity=1)
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 100.00)

		OrderItem.objects.create(order=self.order, product=self.product2, quantity=1)
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 300.00)

	def test_update_order_total_price_on_order_item_update(self):
		order_item = OrderItem.objects.create(order=self.order, product=self.product1, quantity=1)
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 100.00)

		order_item.quantity = 2
		order_item.save()
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 200.00)

	def test_update_order_total_price_on_order_item_deletion(self):
		order_item1 = OrderItem.objects.create(order=self.order, product=self.product1, quantity=1)
		order_item2 = OrderItem.objects.create(order=self.order, product=self.product2, quantity=1)
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 300.00)

		order_item1.delete()
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 200.00)

		order_item2.delete()
		self.order.refresh_from_db()
		self.assertEqual(self.order.totalPrice, 0)

	def test_chat_deleted_when_order_deleted(self):
		self.assertTrue(Chat.objects.filter(order=self.order).exists())

		order_id = self.order.id
		Chat.objects.filter(order=self.order).delete()
		self.order.delete()

		self.assertFalse(Chat.objects.filter(order_id=order_id).exists())