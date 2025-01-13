from django.test import TestCase
from django.contrib.auth.models import User
from accounts.models import Profile
from store.models import Cart
from accounts.tests.utils import create_unique_user


class UserSignalTests(TestCase):
	def test_create_profile_and_cart_for_new_user(self):
		profile_count_before = Profile.objects.count()
		cart_count_before = Cart.objects.count()

		user = create_unique_user()

		self.assertEqual(Profile.objects.count(), profile_count_before + 1)
		self.assertEqual(Cart.objects.count(), cart_count_before + 1)

		profile = Profile.objects.get(user=user)
		self.assertEqual(profile.user, user)

		cart = Cart.objects.get(user=profile)
		self.assertEqual(cart.user, profile)

	def test_save_profile_on_user_update(self):
		user = User.objects.create_user(username='testuser', email='testuser@example.com', password='password123')

		profile = Profile.objects.get(user=user)
		self.assertIsNotNone(profile)

		user.first_name = 'Test'
		user.save()

		profile.refresh_from_db()
		self.assertEqual(profile.user.first_name, 'Test')
