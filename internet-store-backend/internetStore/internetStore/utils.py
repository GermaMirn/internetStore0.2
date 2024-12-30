import json
from django.core.cache import cache
from redis.asyncio import Redis
from asgiref.sync import async_to_sync


def generate_cache_key(prefix, user, *args):
	key_parts = [prefix]
	if user.is_authenticated:
		key_parts.append(f'auth_{user.id}')
	else:
		key_parts.append('guest')

	key_parts.extend(map(str, args))

	return '_'.join(key_parts)


def get_cached_data(cache_key):
	return cache.get(cache_key)


def set_cache_data(cache_key, data, timeout=15*15):
	cache.set(cache_key, data, timeout)


def delete_cache_patterns(user_id):
	cache.delete_pattern(f'search_page_products_auth_{user_id}_*')
	cache.delete_pattern(f'shopping_cart_auth_{user_id}')
	cache.delete_pattern(f'product_detail_auth_{user_id}_*')
	cache.delete_pattern(f'favorite_page_auth_{user_id}_*')


def delete_cache_admin(pattern, *args):
	cache_key = pattern.format(*args)
	print(cache_key)
	cache.delete_pattern(f'{cache_key}_*')
	cache.delete_pattern(f'{cache_key}_auth_*')


def delete_cache_for_product_detail(user):
	if user.is_authenticated:
		cache.delete_pattern(f'product_detail_auth_{user.id}_*')


def set_cache_data_chat_messages(cache_key, data, timeout=15*15):
	async_to_sync(RedisAsyncCache().set)(cache_key, data, timeout)


def get_cached_data_chat_messages(cache_key):
	return async_to_sync(RedisAsyncCache().get)(cache_key)


def generate_cache_key_chat_messages(chat_id):
	return f"chat_messages_{chat_id}"


def clear_chat_cache(chat_id):
	cache_key = generate_cache_key_chat_messages(chat_id)
	cache.delete(cache_key)


class RedisAsyncCache:
	def __init__(self, redis_url="redis://redis:6379/1"):
		self.redis_url = redis_url
		self.redis = None

	async def connect(self):
		if self.redis is None:
			self.redis = await Redis.from_url(self.redis_url)

	async def get(self, key):
		await self.connect()
		data = await self.redis.get(key)
		return json.loads(data) if data else None

	async def set(self, key, value, timeout=3600):
		await self.connect()
		await self.redis.set(key, json.dumps(value), ex=timeout)

	async def delete(self, key):
		await self.connect()
		await self.redis.delete(key)

	async def delete_pattern(self, pattern):
		await self.connect()
		async for key in self.redis.scan_iter(pattern):
			await self.redis.delete(key)
