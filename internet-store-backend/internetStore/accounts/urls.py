from django.urls import path
from .views import CreateAccountView, LoginUserView, LogoutUserView, GetUserInfoView, UpdateUserInfoView


urlpatterns = [
    path('createAccount/', CreateAccountView.as_view(), name='createAccount'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('getUserInfo/', GetUserInfoView.as_view(), name='getUserInfo'),
    path('updateUserInfo/', UpdateUserInfoView.as_view(), name='updateUserInfo'),
]
