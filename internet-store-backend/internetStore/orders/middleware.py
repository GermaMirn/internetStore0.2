from channels.middleware import BaseMiddleware
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs


class TokenAuthMiddleware(BaseMiddleware):
	"""
	Middleware для аутентификации пользователя по токену в WebSocket.
	"""

	async def __call__(self, scope, receive, send):
		query_params = parse_qs(scope.get('query_string', b''))
		token_key = query_params.get(b'token', [None])[0]

		if not token_key:
			await send({
				"type": "websocket.close"
			})
			return

		user = await self.get_user_from_token(token_key.decode())
		if user is None:
			await send({
				"type": "websocket.close"
			})
			return

		scope['user'] = user
		await super().__call__(scope, receive, send)

	@database_sync_to_async
	def get_user_from_token(self, token_key):
		try:
			token = Token.objects.get(key=token_key)
			return token.user
		except Token.DoesNotExist:
			return None
