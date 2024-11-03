from rest_framework.decorators import api_view
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Profile
from .models import (
  Category,
  Product,
  ProductHeart,
  ProductImage,
  Review,
  ReviewHeart,
  ReviewImage,
  Comment,
  CommentHeart,
  CommentImage,
  Cart,
  CartItem,
  Order,
  OrderItem,
)
from .serializers import (
  CategorySerializer,
  ProductSerializer,
  ProductImageSerializer,
  ReviewSerializer,
  ReviewHeartSerializer,
  ReviewImageSerializer,
  CommentSerializer,
  CommentHeartSerializer,
  CommentImageSerializer,
  CartSerializer,
  CartItemSerializer,
)
from django.core.paginator import Paginator
from django.core.paginator import EmptyPage
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required


@api_view(['GET'])
def getPopularProducts(request):
  popularProducts = Product.objects.annotate(hearts_count=Count('product_hearts')).order_by('-hearts_count')[:5]
  serializer = ProductSerializer(popularProducts, many=True)
  return Response(serializer.data)


@api_view(['GET'])
def searchPageProducts(request):
	pageNumber = int(request.GET.get("page", 1))
	tags = request.GET.get("tags", "")
	searchField = request.GET.get("searchInput", "")

	if request.user.is_authenticated:
		cache_key = f'search_page_products_auth_{request.user.id}_{pageNumber}_{tags}_{searchField}'
	else:
		cache_key = f'search_page_products_guest_{pageNumber}_{tags}_{searchField}'

	cached_data = cache.get(cache_key)
	if cached_data:
		return Response(cached_data)

	allProducts = Product.objects.all().order_by("name")

	if tags:
		tagList = tags.split(',')
		allProducts = allProducts.filter(categories__name__in=tagList).distinct()

	if searchField:
		allProducts = allProducts.filter(name__icontains=searchField)

	productPaginator = Paginator(allProducts, 8)
	try:
		page = productPaginator.page(pageNumber)
	except EmptyPage:
		page = productPaginator.page(1)

	userHearts = []
	cartItems = {}
	if request.user.is_authenticated:
		try:
			profile = request.user.profile
			userHearts = ProductHeart.objects.filter(user=profile).values_list('product_id', flat=True)

			try:
				cart = profile.cart
				cartItems = CartItem.objects.filter(cart=cart).select_related('product')
			except:
				pass
		except Profile.DoesNotExist:
			pass

	productsData = []
	for product in page.object_list:
		categories = list(product.categories.values_list('name', flat=True))
		mainImageUrl = product.mainImage.url if product.mainImage else None
		imagesUrl = [image.image.url for image in product.productImages.all()]
		isHearted = product.id in userHearts
		isInCart = False
		cartItemId = None
		cartQuantity = 0

		for cart_item in cartItems:
			if cart_item.product.id == product.id:
				isInCart = True
				cartItemId = cart_item.id
				cartQuantity = cart_item.quantity

		productsData.append({
			'id': product.id,
			'name': product.name,
			'description': product.description,
			'price': str(product.price),
			'categories': categories,
			'imagesURL': imagesUrl,
			'mainImageUrl': mainImageUrl,
			'hearts': product.hearts,
			'isHearted': isHearted,
			'isInCart': isInCart,
			'cartQuantity': cartQuantity,
			'cartItemId': cartItemId,
		})

	response_data = {
		"page": page.number,
		"total_pages": productPaginator.num_pages,
		"products": productsData,
	}

	cache.set(cache_key, response_data, timeout= 60 * 60)

	return Response(response_data)


@api_view(['POST', 'DELETE'])
@login_required
def heartProduct(request, productId):
	product = get_object_or_404(Product, id=productId)

	try:
		profile = request.user.profile
	except Profile.DoesNotExist:
		return Response({'error': 'Профиль не найден'}, status=status.HTTP_404_NOT_FOUND)

	if request.method == 'POST':
		heart, created = ProductHeart.objects.get_or_create(product=product, user=profile)
		cache.delete_pattern(f'search_page_products_auth_{request.user.id}_*')
		cache.delete_pattern(f'shopping_cart_auth_{request.user.id}')
		cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

		updated_product = Product.objects.get(id=productId)
		return Response({'hearts': updated_product.hearts}, status=status.HTTP_200_OK)

	elif request.method == 'DELETE':
		try:
			heart = ProductHeart.objects.get(product=product, user=profile)
			heart.delete()
			cache.delete_pattern(f'search_page_products_auth_{request.user.id}_*')
			cache.delete_pattern(f'shopping_cart_auth_{request.user.id}')
			cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

			updated_product = Product.objects.get(id=productId)
			return Response({'hearts': updated_product.hearts}, status=status.HTTP_200_OK)
		except ProductHeart.DoesNotExist:
			return Response({'error': 'Лайк не найден'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def infoAboutproductDetail(request, productId):
	product = get_object_or_404(Product, id=productId)
	product.detailViews += 1
	product.save()

	if request.user.is_authenticated:
		cache_key = f'product_detail_auth_{request.user.id}_{productId}'
	else:
		cache_key = f'product_detail_guest_{productId}'

	cached_data = cache.get(cache_key)
	if cached_data:
		return Response(cached_data)

	imagesUrl = [image.image.url for image in product.productImages.all()] if product.productImages.exists() else []
	main_product_image = product.mainImage.url if product.mainImage else None

	isHearted = False
	isInCart = False
	cartItemId = None
	cartQuantity = 0

	if request.user.is_authenticated:
		try:
			profile = request.user.profile
			isHearted = ProductHeart.objects.filter(user=profile, product=product).exists()

			cart = profile.cart
			cart_item = CartItem.objects.filter(cart=cart, product=product).first()
			if cart_item:
				isInCart = True
				cartItemId = cart_item.id
				cartQuantity = cart_item.quantity
		except Profile.DoesNotExist:
			pass

	reviews = product.reviews.prefetch_related('comments').all()

	reviewData = []
	likedReview = []
	likedComment = []

	if request.user.is_authenticated:
		likedReview = ReviewHeart.objects.filter(user=profile).values_list('review_id', flat=True)
		likedComment = CommentHeart.objects.filter(user=profile).values_list('comment_id', flat=True)

	for review in reviews:
		comments = review.comments.all()
		commentData = []
		for comment in comments:
			comment_images = [img.image.url for img in comment.commentImages.all()] if comment.commentImages.exists() else []
			main_comment_image = comment_images[0] if comment_images else None

			isCommentLiked = comment.id in likedComment

			commentData.append({
				'id': comment.id,
				'user': comment.user.user.username,
				'text': comment.text,
				'created_at': comment.created_at,
				'hearts': comment.hearts,
				'imagesUrl': comment_images,
				'mainImage': main_comment_image,
				'isLiked': isCommentLiked
			})

		main_review_image = [img.image.url for img in review.reviewImages.all()] if review.reviewImages.exists() else []
		main_review_image_url = main_review_image[0] if main_review_image else None

		isReviewLiked = review.id in likedReview

		reviewData.append({
			'id': review.id,
			'user': review.user.user.username,
			'text': review.text,
			'created_at': review.created_at,
			'hearts': review.hearts,
			'imagesUrl': main_review_image,
			'mainImage': main_review_image_url,
			'comments': commentData,
			'isLiked': isReviewLiked
		})

	response_data = {
		'product': {
			'id': product.id,
			'name': product.name,
			'description': product.description,
			'price': str(product.price),
			'imagesUrl': imagesUrl,
			'mainImage': main_product_image,
			'isHearted': isHearted,
			'hearts': product.hearts,
			'isInCart': isInCart,
			'cartQuantity': cartQuantity,
			'cartItemId': cartItemId,
			'reviews': reviewData,
		},
		'likedReview': likedReview,
		'likedComment': likedComment,
	}

	cache.set(cache_key, response_data, timeout=60 * 15)

	return Response(response_data)




@api_view(['POST'])
def addFastView(request, productId):
  product = get_object_or_404(Product, id=productId)
  product.fastViews += 1
  product.save()
  return Response({'success': True}, status=200)


@api_view(['POST'])
@login_required
def addReview(request, productId):
  product = get_object_or_404(Product, id=productId)
  reviewText = request.data.get('review')

  if reviewText:
    review = Review.objects.create(product=product, user=request.user.profile, text=reviewText)

    imagesUrl = []
    if 'image' in request.FILES:
      images = request.FILES.getlist('image')
      for img in images:
        review_img = ReviewImage.objects.create(review=review, image=img)
        imagesUrl.append(review_img.image.url)

    response_data = {
      'status': 'success',
      'review': {
        'id': review.id,
        'created_at': review.created_at.strftime("%Y-%m-%d %H:%M"),
        'user': {
          'id': review.user.user.id,
          'username': review.user.user.username,
        },
        'text': review.text,
        'images': imagesUrl,
      }
    }
    return Response(response_data, status=201)

  return Response({'status': 'error'}, status=400)


@api_view(['POST', 'DELETE'])
@login_required
def heartReview(request, reviewId):
	review = get_object_or_404(Review, id=reviewId)
	profile = get_object_or_404(Profile, user=request.user)

	if request.method == 'POST':
		heart, created = ReviewHeart.objects.get_or_create(review=review, user=profile)
		cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

		return Response({
			'success': True,
			'hearts': review.hearts,
			'isHearted': created,
		}, status=200)

	elif request.method == 'DELETE':
		try:
			heart = ReviewHeart.objects.get(review=review, user=profile)
			heart.delete()
			cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

			return Response({
				'success': True,
				'hearts': review.hearts
			}, status=200)
		except ReviewHeart.DoesNotExist:
			return Response({'error': 'Лайк не найден'}, status=404)

	return Response({'success': False}, status=400)


@api_view(['POST'])
@login_required
def addComment(request, reviewId):
	review = get_object_or_404(Review, id=reviewId)
	commentText = request.data.get('comment')


	if commentText:
		comment = Comment.objects.create(review=review, user=request.user.profile, text=commentText)

		imagesUrl = []
		if 'image' in request.FILES:
			images = request.FILES.getlist('image')
			for img in images:
				comment_img = CommentImage.objects.create(comment=comment, image=img)
				imagesUrl.append(comment_img.image.url)

		response_data = {
			'status': 'success',
			'comment': {
				'id': comment.id,
				'created_at': comment.created_at.strftime("%Y-%m-%d %H:%M"),
				'user': {
					'id': comment.user.user.id,
					'username': comment.user.user.username,
				},
				'text': comment.text,
				'images': imagesUrl,
			}
		}
		return Response(response_data, status=201)

	return Response({'status': 'error'}, status=400)


@api_view(['POST', 'DELETE'])
@login_required
def heartComment(request, commentId):
	comment = get_object_or_404(Comment, id=commentId)
	profile = get_object_or_404(Profile, user=request.user)

	if request.method == 'POST':
		heart, created = CommentHeart.objects.get_or_create(comment=comment, user=profile)
		cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

		return Response({
				'success': True,
				'hearts': comment.hearts,
				'isHearted': created,
		}, status=200)

	elif request.method == 'DELETE':
		try:
			heart = CommentHeart.objects.get(comment=comment, user=profile)
			heart.delete()
			cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

			return Response({
					'success': True,
					'hearts': comment.hearts
			}, status=200)
		except CommentHeart.DoesNotExist:
			return Response({'error': 'Лайк не найден'}, status=404)

	return Response({'success': False}, status=400)


@api_view(['GET'])
@login_required
def getShoppingCartItems(request):
	cache_key = f'shopping_cart_auth_{request.user.id}'
	cached_data = cache.get(cache_key)

	if cached_data:
		return Response({'cartItems': cached_data}, status=200)


	cart, created = Cart.objects.get_or_create(user=request.user.profile)
	cart_items = CartItem.objects.filter(cart=cart)

	user_hearts = ProductHeart.objects.filter(user=request.user.profile).values_list('product_id', flat=True)

	serializer = CartItemSerializer(cart_items, many=True, context={'user_hearts': list(user_hearts)})

	cache.set(cache_key, serializer.data, timeout=60 * 60)

	return Response({'cartItems': serializer.data}, status=200)


@api_view(['POST', 'DELETE'])
@login_required
def removeAddProductToCart(request, productId=None):
	if request.method == 'POST':
		product = get_object_or_404(Product, id=productId)
		try:
			cart, created = Cart.objects.get_or_create(user=request.user.profile)
			cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

			if created:
				cart_item.quantity = 1
				cart_item.save()
				serializer = CartItemSerializer(cart_item).data
				cache.delete_pattern(f'search_page_products_auth_{request.user.id}_*')
				cache.delete_pattern(f'shopping_cart_auth_{request.user.id}')
				cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

				return Response({'success': True, 'message': 'Товар добавлен в корзину.', 'item': serializer}, status=201)
			else:
				return Response({'success': False, 'message': 'Товар уже был добавлен в корзину.'}, status=400)
		except Exception as e:
			return Response({'success': False, 'message': 'Не удалось добавить товар.'}, status=500)

	elif request.method == 'DELETE':
		cart_item = get_object_or_404(CartItem, id=productId)
		try:
			cart_item.delete()
			cache.delete_pattern(f'search_page_products_auth_{request.user.id}_*')
			cache.delete_pattern(f'shopping_cart_auth_{request.user.id}')
			cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

			return Response({'success': True}, status=200)
		except Exception as e:
			return Response({'success': False, 'message': 'Не удалось удалить продукт'}, status=500)


@api_view(['POST', 'DELETE'])
@login_required
def updateCartProductQuantity(request, ItemId):
	try:
		cart_item = get_object_or_404(CartItem, id=ItemId)

		if request.method == 'POST':
			cart_item.quantity += 1
			cart_item.save()
			cache.delete_pattern(f'search_page_products_auth_{request.user.id}_*')
			cache.delete_pattern(f'shopping_cart_auth_{request.user.id}')
			cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

			return Response({
					'success': True,
					'CartItemName': cart_item.product.name,
					'newQuantity': cart_item.quantity,
					'newPrice': cart_item.price
			}, status=200)

		elif request.method == 'DELETE':
			if cart_item.quantity > 1:
				cart_item.quantity -= 1
				cart_item.save()
			cache.delete_pattern(f'search_page_products_auth_{request.user.id}_*')
			cache.delete_pattern(f'shopping_cart_auth_{request.user.id}')
			cache.delete_pattern(f'product_detail_auth_{request.user.id}_*')

			return Response({
				'success': True,
				'CartItemName': cart_item.product.name,
				'newQuantity': cart_item.quantity
			}, status=200)

	except CartItem.DoesNotExist:
		return Response({'success': False, 'message': 'Товар не найден в корзине'}, status=404)


@api_view(['POST'])
@login_required
def createOrder(request):
  data = request.data
  items = data.get('items')
  total_price = data.get('totalPrice')

  order = Order.objects.create(user=request.user.profile, totalPrice=total_price)

  for item in items:
    cart_item_id = item['id']
    quantity = item['quantity']

    try:
      cart_item = CartItem.objects.get(id=cart_item_id)
      OrderItem.objects.create(
        order=order,
        product=cart_item.product,
        quantity=quantity,
        price=cart_item.price,
      )
      cart_item.delete()
    except CartItem.DoesNotExist:
      return Response({'success': False, 'message': f'Элемент корзины {item["product"]} не найден.'}, status=404)

  return Response({'success': True, 'message': 'Заказ успешно создан'}, status=201)
