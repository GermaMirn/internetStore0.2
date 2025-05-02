from django.urls import reverse, resolve
from django.test import SimpleTestCase
from store.views import (
	categories,
	searchPageProducts,
	heartProduct,
	infoAboutproductDetail,
	addFastView,
	removeAddProductToCart,
	updateCartProductQuantity,
	createOrder,
	getReviews,
	addReview,
	heartReview,
	addComment,
	heartComment,
	getShoppingCartItems,
)

class AccountsUrlsTest(SimpleTestCase):
	def test_url_resolves_to_view(self):
		test_cases = [
			{'url_name': 'searchPageProducts', 'view_func': searchPageProducts, 'kwargs': {}},
			{'url_name': 'heartProduct', 'view_func': heartProduct, 'kwargs': {'productId': 1}},
			{'url_name': 'categories', 'view_func': categories, 'kwargs': {}},
			{'url_name': 'infoAboutproductDetail', 'view_func': infoAboutproductDetail, 'kwargs': {'productId': 1}},
			{'url_name': 'addFastViews', 'view_func': addFastView, 'kwargs': {'productId': 1}},
			{'url_name': 'removeAddProductToCart', 'view_func': removeAddProductToCart, 'kwargs': {'productId': 1}},
			{'url_name': 'updateCartProductQuantity', 'view_func': updateCartProductQuantity, 'kwargs': {'ItemId': 1}},
			{'url_name': 'createOrder', 'view_func': createOrder, 'kwargs': {}},
			{'url_name': 'getReviews', 'view_func': getReviews, 'kwargs': {'productId': 1}},
			{'url_name': 'addReview', 'view_func': addReview, 'kwargs': {'productId': 1}},
			{'url_name': 'heartReview', 'view_func': heartReview, 'kwargs': {'reviewId': 1}},
			{'url_name': 'addComment', 'view_func': addComment, 'kwargs': {'reviewId': 1}},
			{'url_name': 'heartComment', 'view_func': heartComment, 'kwargs': {'commentId': 1}},
			{'url_name': 'getShoppingCartItems', 'view_func': getShoppingCartItems, 'kwargs': {}},
		]

		for case in test_cases:
			with self.subTest(case=case):
				url = reverse(case['url_name'], kwargs=case['kwargs'])
				self.assertEqual(resolve(url).func, case['view_func'])
