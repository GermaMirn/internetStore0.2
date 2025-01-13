from django.test import TestCase
from django.contrib.auth.models import User
from accounts.models import Profile
from accounts.tests.utils import create_unique_user


class ProfileModelTest(TestCase):
	def setUp(self):
		self.user = create_unique_user()
		self.profile, created = Profile.objects.get_or_create(
			user=self.user,
			defaults={'fullname': 'Test User', 'phoneNumber': '1234567890'}
		)

		if not created:
			self.profile.fullname = 'Test User'
			self.profile.phoneNumber = '1234567890'
			self.profile.save()

	def test_profile_creation(self):
		self.assertEqual(self.profile.user.username, self.user.username)
		self.assertEqual(self.profile.fullname, 'Test User')
		self.assertEqual(self.profile.phoneNumber, '1234567890')

	def test_profile_str_method(self):
		self.assertEqual(str(self.profile), self.user.username)

	def test_verbose_name(self):
		self.assertEqual(Profile._meta.verbose_name, 'Профиль')
		self.assertEqual(Profile._meta.verbose_name_plural, 'Профиля')
