from store.models import Product, Review, OrderItem, CartItem


def create_product(name="Test Product", price=100.00, mainImage="path/to/image.jpg"):
	product = Product.objects.create(
		name=name,
		description=f"Test Description",
		price=price,
		mainImage=mainImage
	)

	return product


def create_review(profile, product):
	review = Review.objects.create(
		user=profile,
		product=product,
		text="This is a review"
	)

	return review



def create_order_item(order, product=False, quantity=1):
	order_item = OrderItem.objects.create(
		order=order,
		product=product if product else create_product(),
		quantity=quantity
	)

	return order_item


def create_cart_item(cart, product=False, quantity=1):
	cart_item = CartItem.objects.create(
		cart=cart,
		product=product if product else create_product(),
		quantity=quantity
	)

	return cart_item
