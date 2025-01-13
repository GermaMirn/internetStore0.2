import datetime
from decimal import Decimal
from django.db import IntegrityError
from django.test import TestCase
from django.contrib.auth.models import User
from store.models import (
	Category, Product, ProductImage, ProductHeart, Review,
	ReviewHeart, ReviewImage, Comment, CommentHeart, CommentImage,
	Cart, CartItem, Order, OrderItem
)
from accounts.models import Profile
from accounts.tests.utils import create_unique_user
from store.tests.utils import create_product, create_review, create_order_item, create_cart_item
from django.utils.timezone import now
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile


class CategoryModelTest(TestCase):
	def setUp(self):
		self.category = Category.objects.create(name="Test Category")

	def test_category_creation(self):
		self.assertEqual(self.category.name, "Test Category")
		self.assertEqual(str(self.category), "Test Category")

	def test_category_uniqueness(self):
		duplicate_category = Category(name="Test Category")
		with self.assertRaises(ValidationError):
				duplicate_category.full_clean()
				duplicate_category.save()

	def test_category_update(self):
		self.category.name = "Updated Category"
		self.category.save()
		updated_category = Category.objects.get(id=self.category.id)
		self.assertEqual(updated_category.name, "Updated Category")

	def test_category_deletion(self):
		self.category.delete()
		with self.assertRaises(Category.DoesNotExist):
			Category.objects.get(id=self.category.id)

	def test_category_name_validation(self):
		with self.assertRaises(ValidationError):
			invalid_category = Category(name="")
			invalid_category.full_clean()

	def tearDown(self):
		# Этот метод выполняется после каждого теста
		# Не обязателен в данном случае, так как TestCase автоматически выполняет очистку
		pass


class ProductModelTest(TestCase):
	def setUp(self):
		self.category = Category.objects.create(name="Category")

	def test_product_creation_with_main_image(self):
		product = create_product(mainImage=None)
		with self.assertRaises(ValidationError):
			product.full_clean()

	def test_product_creation_with_valid_data(self):
		product = create_product()
		self.assertEqual(product.name, "Test Product")
		self.assertEqual(product.description, "Test Description")
		self.assertEqual(product.price, 100.00)

	def test_product_str_method(self):
		product = create_product()
		self.assertEqual(str(product), "Test Product")

	def test_product_category(self):
		product = create_product()
		product.categories.add(self.category)
		self.assertIn(self.category, product.categories.all())

	def test_product_invalid_main_image(self):
		product = create_product(mainImage=None)
		with self.assertRaises(ValidationError):
			product.full_clean()

	def test_product_update_views(self):
		product = create_product()

		product.fastViews += 1
		product.detailViews += 2
		product.save()
		product.refresh_from_db()
		self.assertEqual(product.fastViews, 1)
		self.assertEqual(product.detailViews, 2)


class ProductImageModelTest(TestCase):
	def setUp(self):
		self.product = create_product()

	def test_product_image_creation(self):
		product_image = ProductImage.objects.create(
			product=self.product,
			image="path/to/product_image.jpg"
		)
		self.assertEqual(product_image.product, self.product)
		self.assertEqual(product_image.image, "path/to/product_image.jpg")

	def test_product_image_str_method(self):
		product_image = ProductImage.objects.create(
			product=self.product,
			image="path/to/product_image.jpg"
		)
		self.assertEqual(str(product_image), "Изображения для Test Product")

	def test_product_image_without_product(self):
		with self.assertRaises(IntegrityError):
			ProductImage.objects.create(
				image="path/to/product_image.jpg"
			)

	def test_product_image_without_image(self):
		product_image = ProductImage(product=self.product)
		with self.assertRaises(ValidationError):
			product_image.full_clean()

	def test_delete_product_images_on_product_delete(self):
		product_image = ProductImage.objects.create(
			product=self.product,
			image="path/to/product_image.jpg"
		)
		self.assertEqual(ProductImage.objects.count(), 1)
		self.product.delete()
		self.assertEqual(ProductImage.objects.count(), 0)

	def test_product_image_invalid_image(self):
		product_image = ProductImage(product=self.product, image=None)
		with self.assertRaises(ValidationError):
			product_image.full_clean()


class ProductHeartModelTest(TestCase):
	def setUp(self):
		self.user1, created = Profile.objects.get_or_create(user=create_unique_user(username='testuser1'))
		self.user2, created = Profile.objects.get_or_create(user=create_unique_user(username='testuser2'))
		self.product = create_product()

	def test_product_heart_creation(self):
		product_heart = ProductHeart.objects.create(
			product=self.product,
			user=self.user1
		)

		self.assertEqual(product_heart.product, self.product)
		self.assertEqual(product_heart.user, self.user1)

	def test_product_heart_str_method(self):
		product_heart = ProductHeart.objects.create(
			product=self.product,
			user=self.user1
		)

		self.assertEqual(str(product_heart), "Лайк от testuser1 для продукта Test Product")

	def test_product_heart_unique_together(self):
		ProductHeart.objects.create(product=self.product, user=self.user1)

		with self.assertRaises(IntegrityError):
			ProductHeart.objects.create(product=self.product, user=self.user1)

	def test_delete_product_hearts_on_product_delete(self):
		product_heart = ProductHeart.objects.create(
			product=self.product,
			user=self.user1
		)

		self.assertEqual(ProductHeart.objects.count(), 1)
		self.product.delete()
		self.assertEqual(ProductHeart.objects.count(), 0)

	def test_delete_product_hearts_on_user_delete(self):
		product_heart = ProductHeart.objects.create(
			product=self.product,
			user=self.user1
		)

		self.assertEqual(ProductHeart.objects.count(), 1)
		self.user1.delete()
		self.assertEqual(ProductHeart.objects.count(), 0)


class ReviewModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product()
		self.review = create_review(product=self.product, profile=self.profile)

	def test_review_creation(self):
		self.assertEqual(self.review.user, self.profile)
		self.assertEqual(self.review.product, self.product)
		self.assertEqual(self.review.text, "This is a review")

	def test_review_string_representation(self):
		expected_string = f"Отзыв от {self.profile.user.get_full_name()} для {self.product.name}"
		self.assertEqual(str(self.review), expected_string)

	def test_review_created_at(self):
		self.assertIsNotNone(self.review.created_at)

	def test_review_image_validation(self):
		review = Review()

		review.images = None

		with self.assertRaises(ValidationError):
			review.full_clean()

	def test_review_hearts_default(self):
		self.assertEqual(self.review.hearts, 0)

	def test_review_hearts_increment(self):
		self.review.hearts += 1
		self.review.save()
		self.assertEqual(self.review.hearts, 1)

	def test_review_reference_integrity(self):
		product_id = self.product.id
		profile_id = self.profile.id
		self.product.delete()
		with self.assertRaises(Review.DoesNotExist):
			Review.objects.get(product_id=product_id)

		self.profile.delete()
		with self.assertRaises(Review.DoesNotExist):
			Review.objects.get(user_id=profile_id)


class ReviewHeartModelTest(TestCase):
	def setUp(self):
		self.user1, created = Profile.objects.get_or_create(user=create_unique_user(username='testuser1'))
		self.user2, created = Profile.objects.get_or_create(user=create_unique_user(username='testuser2'))
		self.product = create_product()
		self.review = create_review(product=self.product, profile=self.user1)

	def test_review_heart_creation(self):
		review_heart = ReviewHeart.objects.create(
			review=self.review,
			user=self.user1
		)

		self.assertEqual(review_heart.review, self.review)
		self.assertEqual(review_heart.user, self.user1)
		self.assertIsNotNone(review_heart.created_at)
		self.assertAlmostEqual(review_heart.created_at, now(), delta=datetime.timedelta(seconds=1))

	def test_review_heart_str_method(self):
		review_heart = ReviewHeart.objects.create(
			review=self.review,
			user=self.user1
		)

		self.assertEqual(str(review_heart), f"Лайк от {self.user1.user.username} для отзыва {self.review.id}")

	def test_review_heart_unique_together(self):
		ReviewHeart.objects.create(review=self.review, user=self.user1)

		with self.assertRaises(IntegrityError):
			ReviewHeart.objects.create(review=self.review, user=self.user1)

	def test_delete_review_hearts_on_review_delete(self):
		review_heart = ReviewHeart.objects.create(
			review=self.review,
			user=self.user1
		)

		self.assertEqual(ReviewHeart.objects.count(), 1)
		self.review.delete()
		self.assertEqual(ReviewHeart.objects.count(), 0)

	def test_delete_review_hearts_on_user_delete(self):
		review_heart = ReviewHeart.objects.create(
			review=self.review,
			user=self.user1
		)

		self.assertEqual(ReviewHeart.objects.count(), 1)
		self.user1.delete()
		self.assertEqual(ReviewHeart.objects.count(), 0)

	def test_multiple_hearts_for_same_review(self):
		ReviewHeart.objects.create(review=self.review, user=self.user1)
		ReviewHeart.objects.create(review=self.review, user=self.user2)

		self.assertEqual(ReviewHeart.objects.filter(review=self.review).count(), 2)


class ReviewImageModelTest(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(username='testuser', password='password')
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product(mainImage=None)

		self.review = create_review(product=self.product, profile=self.profile)
		self.image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")

	def test_review_image_creation(self):
		review_image = ReviewImage.objects.create(
			review=self.review,
			image=self.image
		)

		self.assertEqual(review_image.review, self.review)
		self.assertTrue(review_image.image.name.startswith('reviews/test_image'))

	def test_review_image_str_method(self):
		review_image = ReviewImage.objects.create(
			review=self.review,
			image=self.image
		)

		self.assertEqual(str(review_image), f"Изображение для отзыва {self.review.id}")

	def test_review_image_deletion_on_review_delete(self):
		review_image = ReviewImage.objects.create(
			review=self.review,
			image=self.image
		)

		self.assertEqual(ReviewImage.objects.count(), 1)
		self.review.delete()
		self.assertEqual(ReviewImage.objects.count(), 0)

	def test_review_image_deletion_on_image_delete(self):
		review_image = ReviewImage.objects.create(
			review=self.review,
			image=self.image
		)

		self.assertEqual(ReviewImage.objects.count(), 1)
		review_image.image.delete()
		self.assertEqual(ReviewImage.objects.count(), 1)

	def test_multiple_images_for_single_review(self):
		image2 = SimpleUploadedFile("test_image2.jpg", b"file_content", content_type="image/jpeg")
		review_image1 = ReviewImage.objects.create(
			review=self.review,
			image=self.image
		)
		review_image2 = ReviewImage.objects.create(
			review=self.review,
			image=image2
		)

		self.assertEqual(ReviewImage.objects.filter(review=self.review).count(), 2)
		self.assertIn(review_image1, ReviewImage.objects.filter(review=self.review))
		self.assertIn(review_image2, ReviewImage.objects.filter(review=self.review))


class CommentModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product()
		self.review = create_review(product=self.product, profile=self.profile)
		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="This is a comment")

	def test_comment_creation(self):
		self.assertEqual(self.comment.user, self.profile)
		self.assertEqual(self.comment.review, self.review)
		self.assertEqual(self.comment.text, "This is a comment")

	def test_comment_string_representation(self):
		expected_string = f"Комментарий от {self.profile.user.username} для отзыва {self.review.id}"
		self.assertEqual(str(self.comment), expected_string)

	def test_comment_created_at(self):
		self.assertIsNotNone(self.comment.created_at)

	def test_comment_image_validation(self):
		comment = Comment()

		comment.images = None

		with self.assertRaises(ValidationError):
			comment.full_clean()

	def test_comment_hearts_default(self):
		self.assertEqual(self.comment.hearts, 0)

	def test_comment_hearts_increment(self):
		self.comment.hearts += 1
		self.comment.save()
		self.assertEqual(self.comment.hearts, 1)

	def test_comment_reference_integrity(self):
		review_id = self.review.id
		profile_id = self.profile.id
		self.review.delete()
		with self.assertRaises(Comment.DoesNotExist):
			Comment.objects.get(review_id=review_id)

		self.profile.delete()
		with self.assertRaises(Comment.DoesNotExist):
			Comment.objects.get(user_id=profile_id)


class CommentHeartModelTest(TestCase):
	def setUp(self):
		self.user1, created = Profile.objects.get_or_create(user=create_unique_user(username='testuser1'))
		self.user2, created = Profile.objects.get_or_create(user=create_unique_user(username='testuser2'))
		self.product = create_product()
		self.review = create_review(product=self.product, profile=self.user1)
		self.comment = Comment.objects.create(review=self.review, user=self.user1, text="This is a comment")

	def test_comment_heart_creation(self):
		comment_heart = CommentHeart.objects.create(
			comment=self.comment,
			user=self.user1
		)

		self.assertEqual(comment_heart.comment, self.comment)
		self.assertEqual(comment_heart.user, self.user1)
		self.assertIsNotNone(comment_heart.created_at)
		self.assertAlmostEqual(comment_heart.created_at, now(), delta=datetime.timedelta(seconds=1))

	def test_comment_heart_str_method(self):
		comment_heart = CommentHeart.objects.create(
			comment=self.comment,
			user=self.user1
		)

		self.assertEqual(str(comment_heart), f"Комментарий от {self.user1.user.username} для комментария {self.comment.id}")

	def test_comment_heart_unique_together(self):
		CommentHeart.objects.create(comment=self.comment, user=self.user1)

		with self.assertRaises(IntegrityError):
			CommentHeart.objects.create(comment=self.comment, user=self.user1)

	def test_delete_comment_hearts_on_comment_delete(self):
		comment_heart = CommentHeart.objects.create(
			comment=self.comment,
			user=self.user1
		)

		self.assertEqual(CommentHeart.objects.count(), 1)
		self.comment.delete()
		self.assertEqual(CommentHeart.objects.count(), 0)

	def test_delete_comment_hearts_on_user_delete(self):
		comment_heart = CommentHeart.objects.create(
			comment=self.comment,
			user=self.user1
		)

		self.assertEqual(CommentHeart.objects.count(), 1)
		self.user1.delete()
		self.assertEqual(CommentHeart.objects.count(), 0)

	def test_multiple_hearts_for_same_comment(self):
		CommentHeart.objects.create(comment=self.comment, user=self.user1)
		CommentHeart.objects.create(comment=self.comment, user=self.user2)

		self.assertEqual(CommentHeart.objects.filter(comment=self.comment).count(), 2)


class CommentImageModelTest(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(username='testuser', password='password')
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product(mainImage=None)

		self.review = create_review(product=self.product, profile=self.profile)
		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="This is a comment")
		self.image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")

	def test_comment_image_creation(self):
		comment_image = CommentImage.objects.create(
			comment=self.comment,
			image=self.image
		)

		self.assertEqual(comment_image.comment, self.comment)
		self.assertTrue(comment_image.image.name.startswith('comments/test_image'))

	def test_comment_image_str_method(self):
		comment_image = CommentImage.objects.create(
			comment=self.comment,
			image=self.image
		)

		self.assertEqual(str(comment_image), f"Изображение для комментария {self.comment.id}")

	def test_comment_image_deletion_on_comment_delete(self):
		comment_image = CommentImage.objects.create(
			comment=self.comment,
			image=self.image
		)

		self.assertEqual(CommentImage.objects.count(), 1)
		self.comment.delete()
		self.assertEqual(CommentImage.objects.count(), 0)

	def test_comment_image_deletion_on_image_delete(self):
		comment_image = CommentImage.objects.create(
			comment=self.comment,
			image=self.image
		)

		self.assertEqual(CommentImage.objects.count(), 1)
		comment_image.image.delete()
		self.assertEqual(CommentImage.objects.count(), 1)

	def test_multiple_images_for_single_comment(self):
		image2 = SimpleUploadedFile("test_image2.jpg", b"file_content", content_type="image/jpeg")
		comment_image1 = CommentImage.objects.create(
			comment=self.comment,
			image=self.image
		)
		comment_image2 = CommentImage.objects.create(
			comment=self.comment,
			image=image2
		)

		self.assertEqual(CommentImage.objects.filter(comment=self.comment).count(), 2)
		self.assertIn(comment_image1, CommentImage.objects.filter(comment=self.comment))
		self.assertIn(comment_image2, CommentImage.objects.filter(comment=self.comment))



class CartModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		Cart.objects.filter(user=self.profile).delete()

		if not Cart.objects.filter(user=self.profile).exists():
			Cart.objects.create(user=self.profile)

	def test_cart_creation_automatically_on_profile_creation(self):
		cart = Cart.objects.filter(user=self.profile).first()

		self.assertIsNotNone(cart)

		self.assertEqual(cart.user, self.profile)

		self.assertIsNotNone(cart.created_at)

	def test_unique_cart_per_user(self):
		cart = Cart.objects.filter(user=self.profile).first()

		self.assertIsNotNone(cart)
		self.assertEqual(Cart.objects.filter(user=self.profile).count(), 1)

		with self.assertRaises(IntegrityError):
			Cart.objects.create(user=self.profile)

	def test_delete_cart_on_user_delete(self):
		cart, created = Cart.objects.get_or_create(user=self.profile)

		self.assertEqual(Cart.objects.count(), 1)
		self.user.delete()

		self.assertEqual(Cart.objects.count(), 0)


class OrderModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.order = Order.objects.create(user=self.profile)

	def test_order_creation(self):
		self.assertIsNotNone(self.order)
		self.assertEqual(self.order.user, self.profile)
		self.assertEqual(self.order.totalPrice, Decimal("0.00"))
		self.assertEqual(self.order.status, 'preparing')

	def test_order_total_price_update(self):
		order_item = create_order_item(order=self.order, quantity=2)

		self.order.update_total_price()
		self.assertEqual(self.order.totalPrice, Decimal("200.00"))

	def test_order_str_representation(self):
		self.assertEqual(str(self.order), f'Заказ пользователя: {self.order.id}. ФИО: {self.profile.fullname}')


class CartItemModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product()

		self.cart, created = Cart.objects.get_or_create(user=self.profile)

	def tearDown(self):
		self.cart.delete()

	def test_cart_item_creation(self):
		cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=2)

		self.assertIsNotNone(cart_item)
		self.assertEqual(cart_item.cart, self.cart)
		self.assertEqual(cart_item.product, self.product)
		self.assertEqual(cart_item.quantity, 2)
		self.assertEqual(cart_item.price, Decimal("200.00"))

	def test_cart_item_price_update_on_quantity_change(self):
		cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=2)

		self.assertEqual(cart_item.price, Decimal("200.00"))

		cart_item.quantity = 3
		cart_item.save()

		self.assertEqual(cart_item.price, Decimal("300.00"))

	def test_cart_item_price_is_set_on_creation(self):
		cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=1)

		self.assertEqual(cart_item.price, Decimal("100.00"))

	def test_cart_item_quantity_set_to_one_if_invalid(self):
		cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=0)

		self.assertEqual(cart_item.quantity, 1)

	def test_cart_item_deletion(self):
		cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=3)

		self.assertEqual(CartItem.objects.count(), 1)

		cart_item.delete()

		self.assertEqual(CartItem.objects.count(), 0)

	def test_cart_item_str_representation(self):
		cart_item = create_cart_item(cart=self.cart, product=self.product, quantity=3)

		self.assertEqual(str(cart_item), "3 x Test Product в корзине")


class OrderItemModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product()

		self.order = Order.objects.create(user=self.profile)

	def test_order_item_creation(self):
		order_item = create_order_item(order=self.order, product=self.product, quantity=2)

		self.assertIsNotNone(order_item)
		self.assertEqual(order_item.order, self.order)
		self.assertEqual(order_item.product, self.product)
		self.assertEqual(order_item.quantity, 2)
		self.assertEqual(order_item.price, Decimal("200.00"))

	def test_order_item_price_update_on_quantity_change(self):
		order_item = create_order_item(order=self.order, product=self.product, quantity=2)

		self.assertEqual(order_item.price, Decimal("200.00"))

		order_item.quantity = 3
		order_item.save()

		self.assertEqual(order_item.price, Decimal("300.00"))

	def test_order_item_price_is_set_on_creation(self):
		order_item = create_order_item(order=self.order, product=self.product, quantity=1)

		self.assertEqual(order_item.price, Decimal("100.00"))

	def test_order_item_quantity_set_to_one_if_invalid(self):
		order_item = create_order_item(order=self.order, product=self.product, quantity=0)
		self.assertEqual(order_item.quantity, 1)

	def test_order_item_deletion(self):
		order_item = create_order_item(order=self.order, product=self.product, quantity=3)

		self.assertEqual(OrderItem.objects.count(), 1)

		order_item.delete()

		self.assertEqual(OrderItem.objects.count(), 0)

	def test_order_item_str_representation(self):
		order_item = create_order_item(order=self.order, product=self.product, quantity=3)

		self.assertEqual(str(order_item), f"Продукт: {self.product.name} заказа {self.order.id}")
