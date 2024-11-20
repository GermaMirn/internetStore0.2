from django.urls import path, include
from django.contrib import admin
from accounts.views import GetCsrfToken
from django.conf import settings
from django.conf.urls.static import static
from orders import consumers


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/get-csrf-token/', GetCsrfToken.as_view(), name='get_csrf_token'),
    path('ws/chat/<int:chat_id>/', consumers.ChatConsumer.as_asgi(), name='chat'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/account/', include('accounts.urls')),
    path('api/store/', include('store.urls')),
    path('api/orders/', include('orders.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
