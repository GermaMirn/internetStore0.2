from django.core.cache import cache


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


def delete_cache_for_product_detail(user):
	if user.is_authenticated:
		cache.delete_pattern(f'product_detail_auth_{user.id}_*')
