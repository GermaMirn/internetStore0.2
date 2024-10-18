from django.forms import ValidationError
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from .models import Profile
from django.middleware.csrf import get_token
from .serializers import UserProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='createAccount')
    def createAccount(self, request):
      username = request.data.get('username')
      password = request.data.get('password')
      fullname = request.data.get('fullname')
      phoneNumber = request.data.get('phone')

      if User.objects.filter(username=username).exists():
        return Response({'message': 'Имя пользователя уже занято.'}, status=status.HTTP_400_BAD_REQUEST)

      try:
        user = User.objects.create_user(username=username, password=password)
        profile = Profile(user=user, fullname=fullname, phoneNumber=phoneNumber)
        profile.save()
        return Response({'message': 'Аккаунт успешно создан!'})
      except (ValidationError, Exception) as e:
        return Response({'message': 'Ошибка при создании аккаунта.', 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='login')
    def loginUser(self, request):
      username = request.data.get('username')
      password = request.data.get('password')

      user = authenticate(username=username, password=password)
      if user is not None:
          login(request, user)
          serializer = UserProfileSerializer(user)
          return Response({'message': 'Успешный вход!', 'exists': True, 'user': serializer.data})
      else:
          return Response({'message': 'Неверные учетные данные.', 'exists': False}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['post'], url_path='getUsernameAndPassword')
    def getUsernameAndPassword(self, request):
      username = request.data.get('username')
      password = request.data.get('password')

      if username is None or password is None:
        return Response({'exists': False, 'error': 'Имя пользователя и пароль должны быть указаны.'}, status=status.HTTP_400_BAD_REQUEST)

      user = authenticate(username=username, password=password)

      if user is None:
        if User.objects.filter(username=username).exists():
          return Response({'exists': False, 'error': 'Неверный пароль.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
          return Response({'exists': False, 'error': 'Имя пользователя не существует.'}, status=status.HTTP_404_NOT_FOUND)
      else:
        login(request, user)
        return Response({'exists': True}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='logout')
    def logoutUser(self, request):
      logout(request)
      return Response({'message': 'Вы успешно вышли из аккаунта.'}, status=status.HTTP_200_OK)


class GetCsrfToken(APIView):
  def get(self, request):
    csrfToken = get_token(request)
    return Response({'csrfToken': csrfToken})
