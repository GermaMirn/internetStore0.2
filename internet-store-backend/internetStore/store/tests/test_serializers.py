from datetime import datetime
from io import BytesIO
import re
from PIL import Image
from django.test import TestCase
from store.models import Category, Product, ProductImage, Review, ReviewImage, ReviewHeart, Comment, CommentImage, CommentHeart
from accounts.models import Profile
from store.serializers import CategorySerializer, ProductImageSerializer, ReviewImageSerializer, ReviewHeartSerializer, CommentImageSerializer, CommentHeartSerializer, CommentSerializer, ProductSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
from store.tests.utils import create_product
from accounts.tests.utils import create_unique_user
import uuid
import pytz


class CategorySerializerTest(TestCase):
	def setUp(self):
		self.category_data = {
			"name": f"Test Category {uuid.uuid4()}",
		}
		self.category = Category.objects.create(**self.category_data)

	def test_serialization(self):
		serializer = CategorySerializer(self.category)
		expected_data = {
			"id": self.category.id,
			"name": self.category.name,
		}

		self.assertEqual(serializer.data, expected_data)

	def test_deserialization(self):
		unique_name = f"Test Category {uuid.uuid4()}"
		category_data = {
			'name': unique_name
		}

		serializer = CategorySerializer(data=category_data)
		self.assertTrue(serializer.is_valid())
		self.assertEqual(serializer.validated_data, category_data)

	def test_invalid_data(self):
		invalid_data = {
			"name": "",
		}
		serializer = CategorySerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('name', serializer.errors)

	def test_create_category(self):
		unique_name = f"Test Category {uuid.uuid4()}"
		category_data = {
			'name': unique_name
		}

		serializer = CategorySerializer(data=category_data)
		self.assertTrue(serializer.is_valid())
		category = serializer.save()

		self.assertIsInstance(category, Category)
		self.assertEqual(category.name, unique_name)


class ProductImageSerializerTest(TestCase):
	def setUp(self):
		self.category = Category.objects.create(name="Test Category")
		self.product = create_product()
		self.product.categories.add(self.category)

		image = Image.new('RGB', (100, 100), color='red')
		image_io = BytesIO()
		image.save(image_io, 'JPEG')
		image_io.seek(0)

		self.image = SimpleUploadedFile("test_image.jpg", image_io.read(), content_type="image/jpeg")

		self.product_image = ProductImage.objects.create(
			product=self.product,
			image=self.image
		)

		self.product_image_data = {
			"product": self.product.id,
			"image": self.image,
		}

	def test_serialization(self):
		serializer = ProductImageSerializer(self.product_image)
		expected_data = {
			"id": self.product_image.id,
			"product": self.product.id,
			"image": self.product_image.image.url,
		}

		self.assertEqual(serializer.data, expected_data)

	def test_deserialization(self):
		image = Image.new('RGB', (100, 100), color='blue')
		image_io = BytesIO()
		image.save(image_io, 'JPEG')
		image_io.seek(0)

		self.product_image_data['image'] = SimpleUploadedFile(
			"test_image.jpg",
			image_io.read(),
			content_type="image/jpeg"
		)

		serializer = ProductImageSerializer(instance=self.product_image, data=self.product_image_data)

		self.assertTrue(serializer.is_valid())
		product_image = serializer.save()

		self.assertEqual(product_image.id, self.product_image.id)
		self.assertEqual(product_image.product.id, self.product.id)

	def test_invalid_data(self):
		invalid_data = {
			"product": self.product.id,
		}

		serializer = ProductImageSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('image', serializer.errors)


class ReviewImageSerializerTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product()

		self.review = Review.objects.create(
			user=self.profile,
			product=self.product,
			text="Test review text.",
		)

		image = Image.new('RGB', (100, 100), color='blue')
		image_io = BytesIO()
		image.save(image_io, 'JPEG')
		image_io.seek(0)

		self.image = SimpleUploadedFile("test_review_image.jpg", image_io.read(), content_type="image/jpeg")

		self.review_image = ReviewImage.objects.create(
			review=self.review,
			image=self.image
		)

		self.review_image_data = {
			"review": self.review.id,
			"image": self.image,
		}

	def test_serialization(self):
		serializer = ReviewImageSerializer(self.review_image)
		expected_data = {
			"id": self.review_image.id,
			"review": self.review.id,
			"image": self.review_image.image.url,
		}

		self.assertEqual(serializer.data, expected_data)

	def test_deserialization(self):
		image = Image.new('RGB', (100, 100), color='red')
		image_io = BytesIO()
		image.save(image_io, 'JPEG')
		image_io.seek(0)

		self.review_image_data['image'] = SimpleUploadedFile(
			"test_review_image.jpg",
			image_io.read(),
			content_type="image/jpeg"
		)

		serializer = ReviewImageSerializer(data=self.review_image_data)
		self.assertTrue(serializer.is_valid())

		review_image = serializer.save()

		self.assertIsNotNone(review_image.id)
		self.assertEqual(review_image.review.id, self.review.id)

	def test_invalid_data(self):
		invalid_data = {
			"review": self.review.id,
		}
		serializer = ReviewImageSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('image', serializer.errors)

	def test_invalid_image(self):
		invalid_data = {
			"review": self.review.id,
			"image": SimpleUploadedFile("test_review_image.txt", b"not an image", content_type="text/plain"),
		}
		serializer = ReviewImageSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('image', serializer.errors)


class ReviewHeartSerializerTest(TestCase):
	def setUp(self):
		self.profile1, created = Profile.objects.get_or_create(user=create_unique_user())
		self.profile2, created = Profile.objects.get_or_create(user=create_unique_user())

		self.product = create_product()

		self.review = Review.objects.create(
			user=self.profile1,
			product=self.product,
			text="Test review text."
		)

		self.review_heart = ReviewHeart.objects.create(
			review=self.review,
			user=self.profile1
		)

		self.review_heart_data = {
			"review": self.review.id,
			"user": self.profile2.id
		}

	def test_serialization(self):
		serializer = ReviewHeartSerializer(instance=self.review_heart)
		expected_data = {
			"id": self.review_heart.id,
			"review": self.review.id,
			"user": self.profile1.id,
			"created_at": self.review_heart.created_at.isoformat()
		}

		self.assertEqual(serializer.data['id'], expected_data['id'])
		self.assertEqual(serializer.data['review'], expected_data['review'])
		self.assertEqual(serializer.data['user'], expected_data['user'])

		serializer_created_at = datetime.fromisoformat(serializer.data['created_at']).astimezone(pytz.utc)
		expected_created_at = datetime.fromisoformat(expected_data['created_at']).astimezone(pytz.utc)

		self.assertEqual(serializer_created_at, expected_created_at)

	def test_deserialization(self):
		serializer = ReviewHeartSerializer(data=self.review_heart_data)
		self.assertTrue(serializer.is_valid())

		review_heart = serializer.save()
		self.assertEqual(review_heart.review.id, self.review.id)
		self.assertEqual(review_heart.user.id, self.profile2.id)

	def test_unique_together_constraint(self):
		invalid_data = {
			"review": self.review.id,
			"user": self.profile1.id
		}

		serializer = ReviewHeartSerializer(data=invalid_data)
		self.assertFalse(serializer.is_valid())
		self.assertIn('non_field_errors', serializer.errors)

	def test_invalid_data(self):
		invalid_data = {
			"review": self.review.id
		}
		serializer = ReviewHeartSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('user', serializer.errors)

	def test_invalid_review(self):
		invalid_data = {
			"review": 9999,
			"user": self.profile2.id
		}

		serializer = ReviewHeartSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('review', serializer.errors)


class CommentImageSerializerTest(TestCase):
	def setUp(self):
		self.profile, created = Profile.objects.get_or_create(user=create_unique_user())

		self.review = Review.objects.create(
			user=self.profile,
			product=create_product(),
			text="Test review text.",
		)

		self.comment = Comment.objects.create(
			review=self.review,
			user=self.profile,
			text="Test comment text."
		)

		image = Image.new('RGB', (100, 100), color='blue')
		image_io = BytesIO()
		image.save(image_io, 'JPEG')
		image_io.seek(0)

		self.image = SimpleUploadedFile("test_image.jpg", image_io.read(), content_type="image/jpeg")

		self.comment_image = CommentImage.objects.create(
			comment=self.comment,
			image=self.image
		)

		self.comment_image_data = {
			"comment": self.comment.id,
			"image": self.image,
		}

	def test_serialization(self):
		serializer = CommentImageSerializer(self.comment_image)
		expected_data = {
			"id": self.comment_image.id,
			"comment": self.comment.id,
			"image": self.comment_image.image.url,
		}

		self.assertEqual(serializer.data, expected_data)

	def test_deserialization(self):
		serializer = CommentImageSerializer(data=self.comment_image_data)

		self.assertTrue(serializer.is_valid(), f"Errors: {serializer.errors}")

		comment_image = serializer.save()

		self.assertEqual(comment_image.comment.id, self.comment.id)
		self.assertEqual(comment_image.image.url, self.comment_image.image.url)

	def test_invalid_data(self):
		invalid_data = {
			"comment": self.comment.id
		}

		serializer = CommentImageSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('image', serializer.errors)

	def test_invalid_comment(self):
		invalid_data = {
			"comment": 9999,
			"image": self.image
		}

		serializer = CommentImageSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('comment', serializer.errors)

	def test_deserialization(self):
		image = Image.new('RGB', (100, 100), color='blue')
		image_io = BytesIO()
		image.save(image_io, 'JPEG')
		image_io.seek(0)

		image_file = SimpleUploadedFile("test_image.jpg", image_io.read(), content_type="image/jpeg")

		self.comment_image_data = {
			"comment": self.comment.id,
			"image": image_file,
		}

		serializer = CommentImageSerializer(data=self.comment_image_data)
		self.assertTrue(serializer.is_valid(), f"Errors: {serializer.errors}")

		comment_image = serializer.save()

		self.assertTrue(comment_image.image.url.startswith("/api/media/comments/test_image"))


class CommentHeartSerializerTest(TestCase):
	def setUp(self):
		self.profile1, created = Profile.objects.get_or_create(user=create_unique_user())
		self.profile2, created = Profile.objects.get_or_create(user=create_unique_user())

		self.product = create_product()

		self.review = Review.objects.create(
			user=self.profile1,
			product=self.product,
			text="Test review text."
		)

		self.comment = Comment.objects.create(
			review=self.review,
			user=self.profile1,
			text="Test comment text."
		)

		self.comment_heart = CommentHeart.objects.create(
			comment=self.comment,
			user=self.profile1
		)

		self.comment_heart_data = {
			"comment": self.comment.id,
			"user": self.profile2.id
		}

	def test_serialization(self):
		serializer = CommentHeartSerializer(instance=self.comment_heart)
		expected_data = {
			"id": self.comment_heart.id,
			"comment": self.comment.id,
			"user": self.profile1.id,
			"created_at": self.comment_heart.created_at.isoformat()
		}

		self.assertEqual(serializer.data['id'], expected_data['id'])
		self.assertEqual(serializer.data['comment'], expected_data['comment'])
		self.assertEqual(serializer.data['user'], expected_data['user'])

		serializer_created_at = datetime.fromisoformat(serializer.data['created_at']).astimezone(pytz.utc)
		expected_created_at = datetime.fromisoformat(expected_data['created_at']).astimezone(pytz.utc)

		self.assertEqual(serializer_created_at, expected_created_at)

	def test_deserialization(self):
		serializer = CommentHeartSerializer(data=self.comment_heart_data)
		self.assertTrue(serializer.is_valid(), f"Errors: {serializer.errors}")

		comment_heart = serializer.save()
		self.assertEqual(comment_heart.comment.id, self.comment.id)
		self.assertEqual(comment_heart.user.id, self.profile2.id)

	def test_unique_together_constraint(self):
		invalid_data = {
			"comment": self.comment.id,
			"user": self.profile1.id
		}

		serializer = CommentHeartSerializer(data=invalid_data)
		self.assertFalse(serializer.is_valid())
		self.assertIn('non_field_errors', serializer.errors)

	def test_invalid_data(self):
		invalid_data = {
			"comment": self.comment.id
		}
		serializer = CommentHeartSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('user', serializer.errors)

	def test_invalid_comment(self):
		invalid_data = {
			"comment": 9999,
			"user": self.profile2.id
		}

		serializer = CommentHeartSerializer(data=invalid_data)

		self.assertFalse(serializer.is_valid())
		self.assertIn('comment', serializer.errors)

