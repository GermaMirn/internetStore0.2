from django.urls import path
from .views import getUserOrders
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
	path('getUserOrders/', getUserOrders, name='getUserOrders'),
]


if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
