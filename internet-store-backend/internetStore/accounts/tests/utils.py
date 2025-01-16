from django.contrib.auth.models import User
from django.db import IntegrityError
from rest_framework import status
from django.urls import reverse
import random
import string


def generate_random_username():
	return 'testuser_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=40)) + str(random.randint(1000, 9999))


def get_unique_username():
	username = generate_random_username()
	while User.objects.filter(username=username).exists():
		username = generate_random_username()
	return username


def create_unique_user(username=None, is_staff=False):
	if username is None:
		username = get_unique_username()
	try:
		user = User.objects.create_user(username=username, email='testuser@example.com', password='password123', is_staff=is_staff)
		return user
	except IntegrityError:
		return create_unique_user()
