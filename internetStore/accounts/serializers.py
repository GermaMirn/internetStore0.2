from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model = Profile
    fields = ['fullname', 'phoneNumber']

class UserProfileSerializer(serializers.ModelSerializer):
  fullname = serializers.CharField(source='profile.fullname')
  phoneNumber = serializers.CharField(source='profile.phoneNumber')

  class Meta:
    model = User
    fields = ['id', 'username', 'email', 'fullname', 'phoneNumber']