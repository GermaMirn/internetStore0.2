from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from rest_framework.authtoken.models import Token
from .models import Profile
from django.contrib.auth import update_session_auth_hash
from django.forms import ValidationError
from django.middleware.csrf import get_token
from .serializers import UserProfileSerializer
from internetStore.utils import delete_cache_patterns


class CreateAccountView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		fullname = request.data.get('fullname')
		phoneNumber = request.data.get('phone')

		if not all([username, password, fullname, phoneNumber]):
			return Response({'message': 'Все поля обязательны.'}, status=status.HTTP_400_BAD_REQUEST)

		if User.objects.filter(username=username).exists():
			return Response({'message': 'Имя пользователя уже занято', 'errorType': 'username', 'success': False}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user = User.objects.create_user(username=username, password=password)

			profile, created = Profile.objects.get_or_create(user=user)

			if not created:
				profile.fullname = fullname
				profile.phoneNumber = phoneNumber
				profile.save()

			token, created = Token.objects.get_or_create(user=user)
			token_key = f'token_{user.id}'
			cache.set(token_key, token.key, timeout=3600)

			return Response({'message': 'Аккаунт успешно создан!', 'success': True})

		except (ValueError) as e:
			print(e)
			return Response({'message': 'Ошибка при создании профиля.', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			print(e)
			return Response({'message': 'Ошибка при создании аккаунта.', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		username = request.data.get('username')
		password = request.data.get('password')

		if not username or not password:
			return Response({'success': False, 'message': 'Имя пользователя и пароль должны быть указаны.'}, status=status.HTTP_400_BAD_REQUEST)

		user = authenticate(username=username, password=password)

		if user is None:
			if User.objects.filter(username=username).exists():
				return Response({'success': False, 'message': 'Неверный пароль.', 'errorType': 'password'}, status=status.HTTP_401_UNAUTHORIZED)
			else:
				return Response({'success': False, 'message': 'Имя пользователя не существует.', 'errorType': 'username'}, status=status.HTTP_404_NOT_FOUND)

		token_key = f'token_{user.id}'
		token = cache.get(token_key)

		if token is None:
			token, created = Token.objects.get_or_create(user=user)
			cache.set(token_key, token.key, timeout=3600)

		login(request, user)
		serializedProfile = UserProfileSerializer(user).data

		return Response(
			{
				'success': True,
				'token': token if isinstance(token, str) else token.key,
				'profile': serializedProfile
			}, status=status.HTTP_200_OK
		)


class LogoutUserView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		try:
			request.user.auth_token.delete()
			token_key = f'token_{request.user.id}'
			cache.delete(token_key)
			logout(request)
			return Response({'message': 'Вы успешно вышли из аккаунта.'}, status=status.HTTP_200_OK)
		except (AttributeError, Exception):
			return Response({'message': 'Ошибка при выходе из аккаунта.'}, status=status.HTTP_400_BAD_REQUEST)


class GetUserInfo(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		user = request.user

		if user.is_authenticated:
			delete_cache_patterns(request.user.id)

			serializedProfile = UserProfileSerializer(user).data
			return Response({'success': True, 'profile': serializedProfile}, status=status.HTTP_200_OK)

		return Response({'success': False, 'message': 'Пользователь не аутентифицирован.'}, status=status.HTTP_401_UNAUTHORIZED)


class UpdateUserInfoView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		user = request.user
		profile = user.profile

		username = request.data.get('username')
		password = request.data.get('password')
		fullname = request.data.get('fullname')
		phoneNumber = request.data.get('phoneNumber')

		if username:
			if User.objects.filter(username=username).exists() and username != user.username:
				return Response({'message': 'Имя пользователя уже занято.', 'errorType': 'username'}, status=status.HTTP_400_BAD_REQUEST)
			user.username = username

		if fullname:
			profile.fullname = fullname

		if phoneNumber:
			profile.phoneNumber = phoneNumber

		if password:
			if not request.data.get('current_password'):
				return Response({'message': 'Текущий пароль обязателен для изменения пароля.'}, status=status.HTTP_400_BAD_REQUEST)

			current_password = request.data.get('current_password')
			if not user.check_password(current_password):
				return Response({'message': 'Неверный текущий пароль.'}, status=status.HTTP_400_BAD_REQUEST)

			user.set_password(password)
			update_session_auth_hash(request, user)

		try:
			user.save()
			profile.save()

			serialized_profile = UserProfileSerializer(user).data

			return Response({
				'success': True,
				'message': 'Данные пользователя успешно обновлены.',
				'profile': serialized_profile
			}, status=status.HTTP_200_OK)

		except Exception as e:
			return Response({'message': 'Ошибка при обновлении данных.', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCsrfToken(APIView):
	def get(self, request):
		csrfToken = get_token(request)

		response = Response({'csrfToken': csrfToken})
		return response
