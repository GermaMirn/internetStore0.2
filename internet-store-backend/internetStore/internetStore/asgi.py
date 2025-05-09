import django
django.setup()

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from orders.middleware import TokenAuthMiddleware
from django.urls import path
from orders import consumers


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'internetStore.settings')


application = ProtocolTypeRouter({
	"http": get_asgi_application(),
	"websocket": TokenAuthMiddleware(
		URLRouter([
			path('ws/chat/<int:chat_id>/', consumers.ChatConsumer.as_asgi()),
		])
	),
})
