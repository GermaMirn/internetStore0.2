from django.urls import path
from .views import CreateAccountView, LoginUserView, LogoutUserView, GetUserInfo


urlpatterns = [
    path('createAccount/', CreateAccountView.as_view(), name='createAccount'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('getUserInfo/', GetUserInfo.as_view(), name='getUserInfo'),
]
