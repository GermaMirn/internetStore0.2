from django.urls import path, include
from django.contrib import admin
from accounts.views import GetCsrfToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/get-csrf-token/', GetCsrfToken.as_view(), name='get_csrf_token'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/account/', include('accounts.urls')),
    path('api/store/', include('store.urls')),
    path('api/orders/', include('orders.urls')),
]
