from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.urls import reverse
from accounts.models import Profile
from accounts.tests.utils import create_unique_user


class CreateAccountViewTest(APITestCase):
	def test_create_account_success(self):
		url = reverse('createAccount')
		data = {
			'username': 'testuser',
			'password': 'password123',
			'fullname': 'Test User',
			'phone': '1234567890'
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['message'], 'Аккаунт успешно создан!')
		self.assertTrue(User.objects.filter(username='testuser').exists())

	def test_create_account_missing_field(self):
		url = reverse('createAccount')
		data = {
			'username': 'testuser',
			'password': 'password123',
			'fullname': 'Test User',
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('Все поля обязательны.', response.data['message'])

	def test_create_account_existing_username(self):
		user = User.objects.create_user(username='testuser', password='password123')
		url = reverse('createAccount')
		data = {
				'username': 'testuser',
				'password': 'password123',
				'fullname': 'Test User',
				'phone': '1234567890'
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn('Имя пользователя уже занято', response.data['message'])


class LoginUserViewTest(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, created = Profile.objects.get_or_create(user=self.user)
		self.token = Token.objects.create(user=self.user)
		self.client = APIClient()

	def tearDown(self):
		User.objects.all().delete()
		Token.objects.all().delete()

	def test_login_success(self):
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
		url = reverse('getUserInfo')
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('profile', response.data)

	def test_login_invalid_credentials(self):
		url = reverse('login')
		data = {
			'username': 'testuser',
			'password': 'wrongpassword'
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
		self.assertIn('Неверный пароль.', response.data['message'])

	def test_login_user_not_found(self):
		url = reverse('login')
		data = {
				'username': 'nonexistentuser',
				'password': 'password123'
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertIn('Имя пользователя не существует.', response.data['message'])


class LogoutUserViewTest(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, _ = Profile.objects.get_or_create(user=self.user)
		self.token = Token.objects.create(user=self.user).key

	def test_logout_success(self):
		url = reverse('logout')
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
		response = self.client.post(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['message'], 'Вы успешно вышли из аккаунта.')

	def test_logout_not_logged_in(self):
		self.client.credentials()
		url = reverse('logout')
		response = self.client.post(url)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['message'], 'Ошибка при выходе из аккаунта.')


class GetUserInfoTest(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, _ = Profile.objects.get_or_create(user=self.user)
		self.token = Token.objects.create(user=self.user).key

	def test_get_user_info_authenticated(self):
		url = reverse('getUserInfo')
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('profile', response.data)

	def test_get_user_info_unauthenticated(self):
		url = reverse('getUserInfo')
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
		self.assertEqual(response.data['message'], 'Пользователь не аутентифицирован.')


class UpdateUserInfoViewTest(APITestCase):
	def setUp(self):
		self.user = create_unique_user(username='testuser')
		self.profile, _ = Profile.objects.get_or_create(user=self.user)
		self.token = Token.objects.create(user=self.user).key

	def test_update_user_info_success(self):
		url = reverse('updateUserInfo')
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
		data = {
			'username': 'newusername',
			'fullname': 'New Name',
			'phoneNumber': '9876543210'
		}

		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['message'], 'Данные пользователя успешно обновлены.')
		self.user.refresh_from_db()
		self.assertEqual(self.user.username, 'newusername')
		self.assertEqual(self.user.profile.fullname, 'New Name')
		self.assertEqual(self.user.profile.phoneNumber, '9876543210')

	def test_update_user_info_invalid_password(self):
		url = reverse('updateUserInfo')
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
		data = {
			'password': 'newpassword123',
			'current_password': 'wrongpassword'
		}
		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['message'], 'Неверный текущий пароль.')

	def test_update_user_info_missing_current_password(self):
		url = reverse('updateUserInfo')
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
		data = {
			'password': 'newpassword123'
		}
		response = self.client.post(url, data)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertEqual(response.data['message'], 'Текущий пароль обязателен для изменения пароля.')


class GetCsrfTokenTest(APITestCase):
	def test_get_csrf_token(self):
		url = reverse('get_csrf_token')
		response = self.client.get(url)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('csrfToken', response.data)
