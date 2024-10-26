from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from rest_framework.authtoken.models import Token
from .models import Profile
from django.forms import ValidationError
from django.middleware.csrf import get_token
from .serializers import UserProfileSerializer

class CreateAccountView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		username = request.data.get('username')
		password = request.data.get('password')
		fullname = request.data.get('fullname')
		phone_number = request.data.get('phone')

		if User.objects.filter(username=username).exists():
			return Response({'message': 'Имя пользователя уже занято', 'errorType': 'username', 'success': False}, status=status.HTTP_400_BAD_REQUEST)

		try:
			user = User.objects.create_user(username=username, password=password)
			profile = Profile(user=user, fullname=fullname, phoneNumber=phone_number)
			profile.save()
			return Response({'message': 'Аккаунт успешно создан!', 'success': True})
		except (ValidationError, Exception) as e:
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

			token, created = Token.objects.get_or_create(user=user)
			login(request, user)
			serializedProfile = UserProfileSerializer(user).data

			return Response(
				{
					'success': True,
					'token': token.key,
					'profile': serializedProfile
				}, status=status.HTTP_200_OK
			)

class LogoutUserView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		try:
			request.user.auth_token.delete()
			logout(request)
			return Response({'message': 'Вы успешно вышли из аккаунта.'}, status=status.HTTP_200_OK)
		except (AttributeError, Exception):
			return Response({'message': 'Ошибка при выходе из аккаунта.'}, status=status.HTTP_400_BAD_REQUEST)




class GetCsrfToken(APIView):
	def get(self, request):
		csrfToken = get_token(request)
		print(csrfToken)

		response = Response({'csrfToken': csrfToken})
		return response
