from django.test import TransactionTestCase
from django.contrib.auth.models import User
from accounts.models import Profile
from accounts.serializers import UserSerializer, ProfileSerializer, UserProfileSerializer
from accounts.tests.utils import create_unique_user
from django.db import IntegrityError


class BaseTestCase(TransactionTestCase):
	def setUp(self):
		self.user = create_unique_user()

		Profile.objects.filter(user=self.user).delete()

		self.profile = Profile.objects.create(user=self.user, fullname='Test User', phoneNumber='1234567890')

		self.user_data = {
			'id': self.user.id,
			'username': self.user.username,
			'email': 'testuser@example.com'
		}

		self.user_profile_data = {
			'id': self.user.id,
			'username': self.user.username,
			'email': 'testuser@example.com',
			'fullname': 'Test User',
			'phoneNumber': '1234567890'
		}

		self.profile_data = {
			'fullname': 'Test User',
			'phoneNumber': '1234567890'
		}

	def tearDown(self):
		Profile.objects.filter(user=self.user).delete()
		User.objects.filter(username=self.user.username).delete()


class UserSerializerTest(BaseTestCase):
	def test_user_serializer_serialization(self):
		serializer = UserSerializer(self.user)
		self.assertEqual(serializer.data, self.user_data)

	def test_user_serializer_deserialization(self):
		serializer = UserSerializer(instance=self.user, data=self.user_data)
		if not serializer.is_valid():
			pass

		self.assertTrue(serializer.is_valid())
		self.assertEqual(serializer.validated_data['username'], self.user.username)
		self.assertEqual(serializer.validated_data['email'], 'testuser@example.com')


class ProfileSerializerTest(BaseTestCase):
	def test_profile_serializer_serialization(self):
		serializer = ProfileSerializer(self.profile)
		self.assertEqual(serializer.data, self.profile_data)

	def test_profile_serializer_deserialization(self):
		serializer = ProfileSerializer(instance=self.user, data=self.profile_data)
		if not serializer.is_valid():
			pass
		self.assertTrue(serializer.is_valid())
		self.assertEqual(serializer.validated_data['fullname'], 'Test User')
		self.assertEqual(serializer.validated_data['phoneNumber'], '1234567890')


class UserProfileSerializerTest(BaseTestCase):
	def test_user_profile_serializer_deserialization(self):
		serializer = UserProfileSerializer(instance=self.user, data=self.user_profile_data)
		if not serializer.is_valid():
			pass

		self.assertTrue(serializer.is_valid())

		self.assertEqual(serializer.validated_data['username'], self.user.username)
		self.assertEqual(serializer.validated_data['email'], 'testuser@example.com')
		self.assertEqual(serializer.validated_data['profile']['fullname'], 'Test User')
		self.assertEqual(serializer.validated_data['profile']['phoneNumber'], '1234567890')

