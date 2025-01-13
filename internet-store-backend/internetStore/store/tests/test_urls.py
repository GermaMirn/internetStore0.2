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
	addReview,
	heartReview,
	addComment,
	heartComment,
	getShoppingCartItems,
)

class AccountsUrlsTest(SimpleTestCase):
	def test_searchPageProducts_url_resolves(self):
		url = reverse('searchPageProducts')
		self.assertEqual(resolve(url).func, searchPageProducts)

	def test_heartProduct_url_resolves(self):
		url = reverse('heartProduct', kwargs={'productId': 1})
		self.assertEqual(resolve(url).func, heartProduct)

	def test_categories_url_resolves(self):
		url = reverse('categories')
		self.assertEqual(resolve(url).func, categories)

	def test_infoAboutproductDetail_url_resolves(self):
		url = reverse('infoAboutproductDetail', kwargs={'productId': 1})
		self.assertEqual(resolve(url).func, infoAboutproductDetail)

	def test_addFastView_url_resolves(self):
		url = reverse('addFastViews', kwargs={'productId': 1})
		self.assertEqual(resolve(url).func, addFastView)

	def test_removeAddProductToCart_url_resolves(self):
		url = reverse('removeAddProductToCart', kwargs={'productId': 1})
		self.assertEqual(resolve(url).func, removeAddProductToCart)

	def test_updateCartProductQuantity_url_resolves(self):
		url = reverse('updateCartProductQuantity', kwargs={'ItemId': 1})
		self.assertEqual(resolve(url).func, updateCartProductQuantity)

	def test_createOrder_url_resolves(self):
		url = reverse('createOrder')
		self.assertEqual(resolve(url).func, createOrder)

	def test_addReview_url_resolves(self):
		url = reverse('addReview', kwargs={'productId': 1})
		self.assertEqual(resolve(url).func, addReview)

	def test_heartReview_url_resolves(self):
		url = reverse('heartReview', kwargs={'reviewId': 1})
		self.assertEqual(resolve(url).func, heartReview)

	def test_addComment_url_resolves(self):
		url = reverse('addComment', kwargs={'reviewId': 1})
		self.assertEqual(resolve(url).func, addComment)

	def test_heartComment_url_resolves(self):
		url = reverse('heartComment', kwargs={'commentId': 1})
		self.assertEqual(resolve(url).func, heartComment)

	def test_getShoppingCartItems_url_resolves(self):
		url = reverse('getShoppingCartItems')
		self.assertEqual(resolve(url).func, getShoppingCartItems)
