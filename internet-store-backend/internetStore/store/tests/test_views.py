from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from store.models import Category, Product, Profile, ProductHeart, Cart, CartItem, ReviewImage, Review, ReviewHeart, Comment, CommentHeart, Order, OrderItem
from orders.models import Chat
from store.serializers import CategorySerializer, CartItemSerializer
from django.core.cache import cache
from django.core.paginator import Paginator
from rest_framework.authtoken.models import Token
from django.core.files.uploadedfile import SimpleUploadedFile
from accounts.tests.utils import create_unique_user
from store.tests.utils import create_product, create_review, create_cart_item, create_order_item
from internetStore.utils import generate_cache_key, set_cache_data, get_cached_data


class CategoryTests(APITestCase):
	def setUp(self):
		self.category1 = Category.objects.create(name="Категория 1")
		self.category2 = Category.objects.create(name="Категория 2")

	def test_categories_get_success(self):
		url = '/api/store/categories/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)

		categories = Category.objects.all()
		serializer = CategorySerializer(categories, many=True)
		self.assertEqual(response.data, serializer.data)

	def test_categories_empty(self):
		Category.objects.all().delete()

		url = '/api/store/categories/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)

		self.assertEqual(response.data, [])

	def test_categories_invalid_url(self):
		url = '/api/store/invalid_categories/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SearchPageProductsTests(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.cart, created = Cart.objects.get_or_create(user=self.profile)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()

		self.category1 = Category.objects.create(name="1")
		self.category2 = Category.objects.create(name="2")

		self.product1 = create_product(name="Test Product", price=100.00)
		self.product2 = create_product(name="Test Product 2", description="Test Description 2", price=200.0)

		self.product1.categories.add(self.category1)
		self.product2.categories.add(self.category2)

		self.product1.save()
		self.product2.save()

	def test_search_page_products_with_no_filter(self):
		url = '/api/store/searchPageProducts/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn("page", response.data)
		self.assertIn("total_pages", response.data)
		self.assertIn("products", response.data)
		self.assertEqual(len(response.data['products']), 2)

	def test_search_page_products_with_tags(self):
		url = '/api/store/searchPageProducts/?tags=1'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['products']), 1)
		self.assertEqual(response.data['products'][0]['name'], 'Test Product')

	def test_search_page_products_with_search_input(self):
		url = '/api/store/searchPageProducts/?searchInput=Test Product 2'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['products']), 1)
		self.assertEqual(response.data['products'][0]['name'], 'Test Product 2')

	def test_search_page_products_with_liked_filter(self):
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

		url = f'/api/store/heartProduct/{self.product1.id}/'
		response = self.client.post(url)

		url = '/api/store/searchPageProducts/?isLiked=true'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['products']), 1)
		self.assertEqual(response.data['products'][0]['name'], 'Test Product')
		self.assertTrue(response.data['products'][0]['isHearted'])

	def test_search_page_products_with_authenticated_user(self):
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
		cart_item = CartItem.objects.create(cart=self.cart, product=self.product2, quantity=2)

		url = '/api/store/searchPageProducts/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn("products", response.data)
		self.assertEqual(response.data['products'][0]['name'], 'Test Product')
		self.assertEqual(response.data['products'][1]['name'], 'Test Product 2')
		self.assertTrue(response.data['products'][1].get('isInCart', False))
		self.assertEqual(response.data['products'][1]['cartQuantity'], 2)

	def test_search_page_products_with_pagination(self):
		url = '/api/store/searchPageProducts/?page=1'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['products']), 2)

	def test_search_page_products_with_cache(self):
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

		cache_key = "search_page_products"
		cache.set(cache_key, {"page": 1, "total_pages": 1, "products": []}, timeout=60)

		Product.objects.all().delete()
		url = '/api/store/searchPageProducts/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['products'], [])
		self.assertEqual(cache.get(cache_key), {"page": 1, "total_pages": 1, "products": []})


		self.product1 = create_product(name="Test Product", price=100.00)
		cache.set(cache_key, {"page": 1, "total_pages": 1, "products": [{'id': self.product1.id, 'name': self.product1.name}]}, timeout=60)
		response = self.client.get(url)
		self.assertEqual(response.data['products'][0]['name'], self.product1.name)

	def test_search_page_products_with_invalid_page(self):
		url = '/api/store/searchPageProducts/?page=999'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['page'], 1)


class HeartProductTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product(name='Test Product', price=100.00)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()

		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_heart_product_post(self):
		url = f'/api/store/heartProduct/{self.product.id}/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(ProductHeart.objects.filter(product=self.product, user=self.profile).count(), 1)
		self.assertIn('hearts', response.data)

	def test_heart_product_delete(self):
		ProductHeart.objects.create(product=self.product, user=self.profile)

		url = f'/api/store/heartProduct/{self.product.id}/'
		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(ProductHeart.objects.filter(product=self.product, user=self.profile).count(), 0)
		self.assertIn('hearts', response.data)

	def test_heart_product_post_nonexistent_product(self):
		url = '/api/store/heartProduct/9999/'
		response = self.client.post(url)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_heart_product_delete_nonexistent_heart(self):
		url = f'/api/store/heartProduct/{self.product.id}/'
		response = self.client.delete(url)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_heart_product_profile_not_found(self):
		self.profile.delete()
		url = f'/api/store/heartProduct/{self.product.id}/'
		response = self.client.post(url)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(response.data['error'], 'Профиль не найден')


class InfoAboutProductDetailTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product(name='Test Product', description='Test description', price=99.99)

		self.product.mainImage = SimpleUploadedFile("main_image.jpg", b"file_content", content_type="image/jpeg")
		self.product.save()

		self.review = Review.objects.create(product=self.product, user=self.profile, text="Test review")
		ReviewHeart.objects.create(review=self.review, user=self.profile)

		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="Test comment")
		CommentHeart.objects.create(comment=self.comment, user=self.profile)

		self.cart_item = CartItem.objects.create(cart=self.profile.cart, product=self.product, quantity=2)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_product_detail_successful(self):
		url = f'/api/store/infoAboutproductDetail/{self.product.id}/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('product', response.data)
		self.assertEqual(response.data['product']['id'], self.product.id)
		self.assertEqual(response.data['product']['name'], self.product.name)
		self.assertEqual(response.data['product']['description'], self.product.description)
		self.assertEqual(response.data['product']['price'], str(self.product.price))
		self.assertEqual(response.data['product']['mainImage'], self.product.mainImage.url)
		self.assertFalse(response.data['product']['isHearted'])
		self.assertTrue(response.data['product']['isInCart'])
		self.assertEqual(response.data['product']['cartQuantity'], 2)

	def test_product_detail_cache_hit(self):
		url = f'/api/store/infoAboutproductDetail/{self.product.id}/'
		cache_key = f'product_detail_{self.user.id}_{self.product.id}'

		cache_data = {
			'product': {
				'id': self.product.id,
				'name': self.product.name,
				'description': self.product.description,
				'price': str(self.product.price),
				'mainImage': self.product.mainImage.url,
				'isHearted': True,
				'isInCart': True,
				'cartQuantity': 2,
			}
		}
		cache.set(cache_key, cache_data, timeout=60)

		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['product']['id'], cache_data['product']['id'])
		self.assertEqual(response.data['product']['name'], cache_data['product']['name'])

	def test_product_detail_without_authentication(self):
		self.client.logout()
		url = f'/api/store/infoAboutproductDetail/{self.product.id}/'

		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertFalse(response.data['product']['isHearted'])
		self.assertFalse(response.data['product']['isInCart'])

	def test_product_detail_with_no_reviews(self):
		Review.objects.filter(product=self.product).delete()

		url = f'/api/store/infoAboutproductDetail/{self.product.id}/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data['product']['reviews']), 0)

	def test_product_detail_with_multiple_images(self):
		SimpleUploadedFile("additional_image.jpg", b"file_content", content_type="image/jpeg")
		self.product.productImages.create(image="additional_image.jpg")

		url = f'/api/store/infoAboutproductDetail/{self.product.id}/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('imagesUrl', response.data['product'])
		self.assertTrue(len(response.data['product']['imagesUrl']) > 0)

	def test_product_detail_with_cache_invalidated(self):
		cache_key = f'product_detail_{self.user.id}_{self.product.id}'
		cache.set(cache_key, {"cached": "data"}, timeout=60)
		self.assertIsNotNone(cache.get(cache_key))

		url = f'/api/store/infoAboutproductDetail/{self.product.id}/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIsNone(cache.get(cache_key))



class AddFastViewTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.product = create_product(name="Test Product", price=100.00, fastViews=0)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()

		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_add_fast_view_success(self):
		url = f'/api/store/product/{self.product.id}/fastviews/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['success'], True)

		self.product.refresh_from_db()
		self.assertEqual(self.product.fastViews, 1)

	def test_add_fast_view_nonexistent_product(self):
		url = '/api/store/product/9999/fastviews/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_add_fast_view_multiple_requests(self):
		url = f'/api/store/product/{self.product.id}/fastviews/'

		for _ in range(5):
			self.client.post(url)

		self.product.refresh_from_db()
		self.assertEqual(self.product.fastViews, 5)

	def test_add_fast_view_no_authentication(self):
		self.client.credentials()

		url = f'/api/store/product/{self.product.id}/fastviews/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetReviewsTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, _ = Profile.objects.get_or_create(user=self.user)
		self.product = create_product(name="Product for review testing")

		self.review = Review.objects.create(product=self.product, user=self.profile, text="Great product!")
		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="Nice review!")

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

		self.cache_key = generate_cache_key('product_reviews', self.user, self.product.id)

	def test_get_reviews_response_structure_and_cache(self):
		cache.delete(self.cache_key)

		url = f'/api/store/product/{self.product.id}/reviews/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('reviews', response.data)
		self.assertEqual(len(response.data['reviews']), 1)

		review_data = response.data['reviews'][0]
		self.assertEqual(review_data['id'], self.review.id)
		self.assertEqual(review_data['text'], self.review.text)
		self.assertEqual(review_data['user'], self.user.username)
		self.assertIn('comments', review_data)
		self.assertEqual(len(review_data['comments']), 1)

		comment_data = review_data['comments'][0]
		self.assertEqual(comment_data['id'], self.comment.id)
		self.assertEqual(comment_data['text'], self.comment.text)
		self.assertEqual(comment_data['user'], self.user.username)

		cached = cache.get(self.cache_key)
		self.assertIsNotNone(cached)
		self.assertEqual(cached['productId'], self.product.id)

	def test_get_reviews_from_cache(self):
		response_data = {'productId': self.product.id, 'reviews': []}
		cache.set(self.cache_key, response_data, timeout=900)

		url = f'/api/store/product/{self.product.id}/reviews/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data, response_data)


class AddReviewTests(APITestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile = Profile.objects.get_or_create(user=self.user)


		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

		self.product = create_product(name='Test Product', price=100.00)

	def test_add_review_successfully(self):
		url = f'/api/store/product/{self.product.id}/review/'
		review_text = "Test text"

		image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")
		data = {
			'review': review_text,
			'image': [image]
		}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['status'], 'success')

		review = Review.objects.first()
		self.assertEqual(review.text, review_text)
		self.assertEqual(review.product, self.product)

		self.assertEqual(len(response.data['review']['imagesUrl']), 1)
		self.assertTrue(response.data['review']['imagesUrl'][0].startswith('/api/media/reviews/test_image'))

	def test_add_review_without_text(self):
		url = f'/api/store/product/{self.product.id}/review/'

		data = {
			'review': '',
		}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['status'], 'error')

	def test_add_review_with_multiple_images(self):
		url = f'/api/store/product/{self.product.id}/review/'
		review_text = "This product is amazing!"

		image = SimpleUploadedFile("test_image1.jpg", b"file_content", content_type="image/jpeg")
		image1 = SimpleUploadedFile("test_image2.jpg", b"file_content1", content_type="image/jpeg")
		image2 = SimpleUploadedFile("test_image3.jpg", b"file_content2", content_type="image/jpeg")

		data = {
			'review': review_text,
			'image': [image, image1, image2]
		}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['status'], 'success')

		review = Review.objects.filter(product=self.product).first()

		self.assertIsNotNone(review)

		review_images = ReviewImage.objects.filter(review=review)

		self.assertEqual(review_images.count(), 3)

		self.assertTrue(response.data['review']['mainImage'].startswith('/api/media/reviews/'))

		for idx, image_url in enumerate(response.data['review']['imagesUrl']):
			self.assertTrue(image_url.startswith('/api/media/reviews/'))
			self.assertTrue(image_url.startswith(f'/api/media/reviews/test_image{idx+1}'))

		self.assertTrue(review_images[0].image.name.startswith('reviews/test_image1'))
		self.assertTrue(review_images[1].image.name.startswith('reviews/test_image2'))
		self.assertTrue(review_images[2].image.name.startswith('reviews/test_image3'))

	def test_review_cache_is_cleared(self):
		url = f'/api/store/product/{self.product.id}/review/'
		review_text = "This product is great!"

		image = SimpleUploadedFile("test_image.jpg", b"file_content", content_type="image/jpeg")
		data = {
			'review': review_text,
			'image': [image]
		}

		cache_key = f"product_detail_auth_{self.user.id}"
		cache.set(cache_key, {"product": "cached data"}, timeout=60)

		self.assertEqual(cache.get(cache_key), {"product": "cached data"})

		response = self.client.post(url, data, format='multipart')
		self.assertIsNone(cache.get(cache_key))

	def test_add_review_with_invalid_product(self):
		url = f'/api/store/product/99999/review/'
		data = {
			'review': 'This product does not exist!',
		}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class HeartReviewTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.product = create_product(name='Test Product')
		self.review = Review.objects.create(user=self.profile, product=self.product, text="Test review")

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_add_heart_to_review(self):
		url = f'/api/store/review/{self.review.id}/heart/'

		initial_hearts = self.review.hearts

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['hearts'], initial_hearts + 1)
		self.assertTrue(response.data['isHearted'])

		cache_key = f"product_{self.product.id}_detail"
		self.assertIsNone(cache.get(cache_key))

	def test_remove_heart_from_review(self):
		url = f'/api/store/review/{self.review.id}/heart/'
		response = self.client.post(url)

		initial_hearts = response.data['hearts']
		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['hearts'], initial_hearts)

		cache_key = f"product_{self.product.id}_detail"
		self.assertIsNone(cache.get(cache_key))

	def test_add_heart_to_review_multiple_times(self):
		url = f'/api/store/review/{self.review.id}/heart/'

		response = self.client.post(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertFalse(response.data['isHearted'])

		self.assertEqual(response.data['hearts'], 1)

	def test_remove_heart_when_not_exists(self):
		url = f'/api/store/review/{self.review.id}/heart/'

		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertEqual(response.data['error'], 'Лайк не найден')

	def test_invalid_review_id(self):
		url = f'/api/store/review/999999/heart/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AddCommentTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.review = Review.objects.create(product=create_product(), user=self.profile, text="Test review")

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_add_comment_with_images(self):
		url = f'/api/store/review/{self.review.id}/comment/'
		comment_text = "This is a test comment with images."

		image1 = SimpleUploadedFile("image1.jpg", b"file_content", content_type="image/jpeg")
		image2 = SimpleUploadedFile("image2.jpg", b"file_content", content_type="image/jpeg")

		data = {
			'comment': comment_text,
			'image': [image1, image2]
		}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['status'], 'success')
		self.assertEqual(response.data['comment']['text'], comment_text)
		self.assertEqual(len(response.data['comment']['imagesUrl']), 2)
		self.assertIsNotNone(response.data['comment']['mainImage'])

	def test_add_comment_without_images(self):
		url = f'/api/store/review/{self.review.id}/comment/'
		comment_text = "This is a test comment without images."

		data = {'comment': comment_text}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['status'], 'success')
		self.assertEqual(response.data['comment']['text'], comment_text)
		self.assertEqual(len(response.data['comment']['imagesUrl']), 0)
		self.assertIsNone(response.data['comment']['mainImage'])

	def test_add_comment_empty_text(self):
		url = f'/api/store/review/{self.review.id}/comment/'

		data = {'comment': ''}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['status'], 'error')

	def test_add_comment_missing_text(self):
		url = f'/api/store/review/{self.review.id}/comment/'

		data = {}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['status'], 'error')

	def test_add_comment_with_invalid_review(self):
		invalid_review_id = 9999
		url = f'/api/store/review/{invalid_review_id}/comment/'
		comment_text = "This comment will not be posted."

		data = {'comment': comment_text}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_cache_cleared_after_comment(self):
		cache_key = f"product_detail_auth_{self.user.id}_{self.review.product.id}"
		cache.set(cache_key, {"cached": "data"}, timeout=60)
		self.assertIsNotNone(cache.get(cache_key))

		url = f'/api/store/review/{self.review.id}/comment/'
		comment_text = "This is a test comment to clear cache."

		data = {'comment': comment_text}

		response = self.client.post(url, data, format='multipart')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertIsNone(cache.get(cache_key))


class HeartCommentTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.review = Review.objects.create(product=create_product(name='Test Product'), user=self.profile, text="Test review")
		self.comment = Comment.objects.create(review=self.review, user=self.profile, text="Test comment")

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_add_heart_to_comment(self):
		url = f'/api/store/comment/{self.comment.id}/heart/'

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertTrue(response.data['success'])
		self.assertEqual(response.data['hearts'], self.comment.hearts + 1)
		self.assertTrue(response.data['isHearted'])
		self.assertTrue(CommentHeart.objects.filter(comment=self.comment, user=self.profile).exists())

	def test_remove_heart_from_comment(self):
		CommentHeart.objects.create(comment=self.comment, user=self.profile)

		url = f'/api/store/comment/{self.comment.id}/heart/'

		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertTrue(response.data['success'])
		self.assertEqual(response.data['hearts'], self.comment.hearts)
		self.assertFalse(CommentHeart.objects.filter(comment=self.comment, user=self.profile).exists())

	def test_heart_comment_without_authentication(self):
		self.client.logout()
		url = f'/api/store/comment/{self.comment.id}/heart/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		self.assertIn('Location', response.headers)
		self.assertTrue(response.headers['Location'].startswith('/accounts/login/'))

	def test_remove_nonexistent_heart(self):
		url = f'/api/store/comment/{self.comment.id}/heart/'

		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertIn('error', response.data)
		self.assertEqual(response.data['error'], 'Лайк не найден')

	def test_invalid_method(self):
		url = f'/api/store/comment/{self.comment.id}/heart/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class GetShoppingCartItemsTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.cart = Cart.objects.get(user=self.profile)
		self.product = create_product(name='Test Product', price=100.00)
		self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

		ProductHeart.objects.create(user=self.profile, product=self.product)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_get_shopping_cart_items_success(self):
		url = '/api/store/getShoppingCartItems/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)

		self.assertIn('cartItems', response.data)
		self.assertEqual(len(response.data['cartItems']), 1)

		expected_data = CartItemSerializer(CartItem.objects.filter(cart=self.cart), many=True, context={'user_hearts':[self.product.id]}).data
		self.assertEqual(response.data['cartItems'], expected_data)

	def test_get_shopping_cart_items_cached(self):
		url = '/api/store/getShoppingCartItems/'
		response = self.client.get(url)

		cache_key = generate_cache_key('shopping_cart', self.user)
		cached_data = cache.get(cache_key)
		self.assertIsNotNone(cached_data)
		self.assertEqual(response.data['cartItems'], cached_data)

	def test_get_shopping_cart_items_no_authentication(self):
		self.client.logout()

		url = '/api/store/getShoppingCartItems/'
		response = self.client.get(url)

		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		self.assertIn('Location', response.headers)
		self.assertTrue(response.headers['Location'].startswith('/accounts/login/'))


class RemoveAddProductToCartTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product(name='Test Product', price=100.00)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_add_product_to_cart_success(self):
		url = f'/api/store/cart/item/{self.product.id}/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['success'], True)
		self.assertEqual(response.data['message'], 'Товар добавлен в корзину.')

		cart = Cart.objects.get(user=self.profile)
		cart_item = CartItem.objects.get(cart=cart, product=self.product)

		self.assertEqual(cart_item.quantity, 1)

	def test_add_product_to_cart_already_exists(self):
		url = f'/api/store/cart/item/{self.product.id}/'
		self.client.post(url)

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['success'], False)
		self.assertEqual(response.data['message'], 'Товар уже был добавлен в корзину.')

	def test_delete_product_from_cart_success(self):
		url = f'/api/store/cart/item/{self.product.id}/'
		self.client.post(url)

		cart = Cart.objects.get(user=self.profile)
		cart_item = CartItem.objects.get(cart=cart, product=self.product)

		delete_url = f'/api/store/cart/item/{cart_item.id}/'
		response = self.client.delete(delete_url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['success'], True)

		with self.assertRaises(CartItem.DoesNotExist):
			CartItem.objects.get(id=cart_item.id)

	def test_delete_product_from_cart_not_found(self):
		delete_url = f'/api/store/cart/9999/'
		response = self.client.delete(delete_url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_add_product_to_cart_no_authentication(self):
		self.client.logout()

		url = f'/api/store/cart/item/{self.product.id}/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		self.assertIn('Location', response.headers)
		self.assertTrue(response.headers['Location'].startswith('/accounts/login/'))

	def test_delete_product_from_cart_no_authentication(self):
		self.client.logout()

		cart = Cart.objects.get(user=self.profile)
		cart_item = CartItem.objects.create(cart=cart, product=self.product, quantity=1)

		delete_url = f'/api/store/cart/{cart_item.id}/'
		response = self.client.delete(delete_url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UpdateCartProductQuantityTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product(name='Test Product', price=100.00)
		self.cart = Cart.objects.get(user=self.profile)
		self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_increase_product_quantity_success(self):
		url = f'/api/store/cart/item/update/{self.cart_item.id}/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['success'], True)
		self.assertEqual(response.data['newQuantity'], 3)
		self.assertEqual(response.data['CartItemName'], self.product.name)

		self.cart_item.refresh_from_db()
		self.assertEqual(self.cart_item.quantity, 3)

	def test_decrease_product_quantity_success(self):
		url = f'/api/store/cart/item/update/{self.cart_item.id}/'
		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['success'], True)
		self.assertEqual(response.data['newQuantity'], 1)
		self.assertEqual(response.data['CartItemName'], self.product.name)

		self.cart_item.refresh_from_db()
		self.assertEqual(self.cart_item.quantity, 1)

	def test_remove_last_product_from_cart(self):
		self.cart_item.quantity = 1
		self.cart_item.save()

		url = f'/api/store/cart/item/update/{self.cart_item.id}/'
		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['success'], True)
		self.assertEqual(response.data['newQuantity'], 1)

		self.cart_item.refresh_from_db()
		self.assertEqual(self.cart_item.quantity, 1)

	def test_product_not_found(self):
		url = '/api/store/cart/item/update/9999/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_no_authentication(self):
		self.client.logout()

		url = f'/api/store/cart/item/update/{self.cart_item.id}/'
		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		self.assertIn('Location', response.headers)
		self.assertTrue(response.headers['Location'].startswith('/accounts/login/'))

	def test_decrease_product_quantity_no_authentication(self):
		self.client.logout()

		url = f'/api/store/cart/update/{self.cart_item.id}/'
		response = self.client.delete(url)

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CreateOrderTestCase(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)

		self.product = create_product(name='Test Product', price=100.00)
		self.cart = Cart.objects.get(user=self.profile)
		self.cart_item = CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)

		self.admin_user = create_unique_user(username='adminuser', is_staff=True)
		self.admin_profile, created = Profile.objects.get_or_create(user=self.admin_user)

		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

	def test_create_order_success(self):
		order_data = {
			'items': [{'id': self.cart_item.id, 'quantity': self.cart_item.quantity}],
			'totalPrice': 200.00
		}

		url = '/api/store/createOrder/'
		response = self.client.post(url, order_data, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['success'], True)
		self.assertEqual(response.data['message'], 'Заказ успешно создан и чат открыт.')

		order = Order.objects.get(user=self.profile)
		self.assertEqual(order.totalPrice, 200.00)

		order_item = OrderItem.objects.get(order=order)
		self.assertEqual(order_item.product, self.product)
		self.assertEqual(order_item.quantity, self.cart_item.quantity)
		self.assertEqual(order_item.price, self.cart_item.price)

		chat = Chat.objects.get(order=order)
		self.assertIn(self.profile, chat.participants.all())
		self.assertIn(self.admin_profile, chat.participants.all())

		with self.assertRaises(CartItem.DoesNotExist):
			CartItem.objects.get(id=self.cart_item.id)

	def test_create_order_cart_item_not_found(self):
		order_data = {
			'items': [{'id': 9999, 'quantity': 1}],
			'totalPrice': 100.00
		}

		url = '/api/store/createOrder/'
		response = self.client.post(url, order_data, format='json')

		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

	def test_create_order_no_authentication(self):
		self.client.logout()

		order_data = {
			'items': [{'id': self.cart_item.id, 'quantity': self.cart_item.quantity}],
			'totalPrice': 200.00
		}

		url = '/api/store/createOrder/'
		response = self.client.post(url, order_data, format='json')

		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		self.assertIn('Location', response.headers)
		self.assertTrue(response.headers['Location'].startswith('/accounts/login/'))
