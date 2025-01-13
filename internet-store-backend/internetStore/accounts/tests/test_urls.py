from django.test import SimpleTestCase
from django.urls import reverse, resolve
from accounts.views import CreateAccountView, LoginUserView, LogoutUserView, GetUserInfoView, UpdateUserInfoView


class AccountsUrlsTest(SimpleTestCase):
	def test_create_account_url_resolves(self):
		url = reverse('createAccount')
		self.assertEqual(resolve(url).func.view_class, CreateAccountView)

	def test_login_url_resolves(self):
		url = reverse('login')
		self.assertEqual(resolve(url).func.view_class, LoginUserView)

	def test_logout_url_resolves(self):
		url = reverse('logout')
		self.assertEqual(resolve(url).func.view_class, LogoutUserView)

	def test_get_user_info_url_resolves(self):
		url = reverse('getUserInfo')
		self.assertEqual(resolve(url).func.view_class, GetUserInfoView)

	def test_update_user_info_url_resolves(self):
		url = reverse('updateUserInfo')
		self.assertEqual(resolve(url).func.view_class, UpdateUserInfoView)
