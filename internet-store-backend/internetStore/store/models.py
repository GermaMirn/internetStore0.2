from django.db import models
from django.contrib.auth.models import User
from accounts.models import Profile
import os
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.core.cache import cache
from .signals.cache_signals import *
from .signals.store_signals import *


class Category(models.Model):
  name = models.CharField(max_length=100, unique=True)

  def __str__(self):
    return self.name

  class Meta:
    verbose_name = "Категория"
    verbose_name_plural = "Категории"


class Product(models.Model):
  name = models.CharField(max_length=255, unique=True)
  description = models.TextField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  categories = models.ManyToManyField(Category, related_name='products')
  mainImage = models.ImageField(upload_to='products/')
  hearts = models.IntegerField(default=0)
  fastViews = models.IntegerField(default=0)
  detailViews = models.IntegerField(default=0)

  def __str__(self):
    return self.name

  class Meta:
    verbose_name = "Продукт"
    verbose_name_plural = "Продукты"


class ProductImage(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='productImages')
  image = models.ImageField(upload_to='products/', blank=False)

  def __str__(self):
    return f"Изображения для {self.product.name}"

  class Meta:
    verbose_name = "Изображение"
    verbose_name_plural = "Изображения"


class ProductHeart(models.Model):
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_hearts')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Лайк от {self.user.user.username} для продукта {self.product.name}"

  class Meta:
    unique_together = ('product', 'user')
    verbose_name = "Лайк под продуктом"
    verbose_name_plural = "Лайки под продуктами"


class Review(models.Model):
  user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='reviews')
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
  text = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  images = models.ImageField(upload_to='reviews/', null=True, blank=True)
  hearts = models.IntegerField(default=0)

  def __str__(self):
    return f"Отзыв от {self.user.fullname} для {self.product.name}"

  class Meta:
    verbose_name = "Отзыв"
    verbose_name_plural = "Отзовы"


class ReviewHeart(models.Model):
	review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='reviewHearts')
	user = models.ForeignKey(Profile, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Лайк от {self.user.user.username} для отзыва {self.review.id}"

	class Meta:
		unique_together = ('review', 'user')

		verbose_name = "Лайк"
		verbose_name_plural = "Лайки для отзыва"


class ReviewImage(models.Model):
  review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='reviewImages')
  image = models.ImageField(upload_to='reviews/')

  def __str__(self):
    return f"Изображение для отзыва {self.review.id}"

  class Meta:
    verbose_name = "Изображение для отзыва"
    verbose_name_plural = "Изображения для отзывов"


class Comment(models.Model):
  review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='comments')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  text = models.TextField()
  created_at = models.DateTimeField(auto_now_add=True)
  images = models.ImageField(upload_to='comments/', null=True, blank=True)
  hearts = models.IntegerField(default=0)

  def __str__(self):
    return f"Комментарий от {self.user.user.username} для отзыва {self.review.id}"

  class Meta:
    verbose_name = "Комментарий"
    verbose_name_plural = "Комментарии"


class CommentHeart(models.Model):
  comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='commentHearts')
  user = models.ForeignKey(Profile, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"Комментарий от {self.user.user.username} для комментария {self.comment.id}"

  class Meta:
    unique_together = ('comment', 'user')

    verbose_name = "Лайки для комментариев"
    verbose_name_plural = "Лайк для комментария"


class CommentImage(models.Model):
  comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='commentImages')
  image = models.ImageField(upload_to='comments/')

  def __str__(self):
    return f"Изображение для комментария {self.comment.id}"

  class Meta:
    verbose_name = "Изображение для комментария"
    verbose_name_plural = "Изображения для комментариев"


class Cart(models.Model):
	user = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name="cart")
	created_at = models.DateTimeField(auto_now_add=True)

	def update_cart_total_price(self):
		total = sum(item.price for item in self.items.all())
		self.total_price = total
		self.save()

	def __str__(self):
		return f"Корзина пользователя {self.user.fullname}"

	class Meta:
		verbose_name = "Корзина"
		verbose_name_plural = "Корзины"


class CartItem(models.Model):
	cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	quantity = models.PositiveIntegerField(default=1)
	price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

	def save(self, *args, **kwargs):
		if not self.id:
			self.price = self.product.price

		if self.quantity < 1:
			self.quantity = 1

		if self.quantity >= 1:
			self.price = self.product.price * self.quantity
		super().save(*args, **kwargs)

	def recalculate_price(self):
		self.price = self.product.price * self.quantity
		self.save()

	def __str__(self):
		return f"{self.quantity} x {self.product.name} в корзине"

	class Meta:
		verbose_name = "Элемент корзины"
		verbose_name_plural = "Элементы корзины"


class Order(models.Model):
	user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='orders')
	created_at = models.DateTimeField(auto_now_add=True)
	totalPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0)

	ORDER_STATUS = [
		('preparing', 'Собирается'),
		('in_transit', 'В пути'),
		('ready_for_pickup', 'Готово к выдаче'),
	]
	status = models.CharField(
		max_length=20,
		choices=ORDER_STATUS,
		default='preparing',
	)

	def __str__(self):
		return f'Заказ пользователя: {self.id}. ФИО: {self.user.fullname}'

	def update_total_price(self):
		total = sum(item.price for item in self.items.all())
		self.totalPrice = total
		self.save()

	class Meta:
		verbose_name = "Заказ"
		verbose_name_plural = "Заказы"


class OrderItem(models.Model):
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
	product = models.ForeignKey(Product, on_delete=models.CASCADE)
	quantity = models.PositiveIntegerField(default=1)
	price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

	def __str__(self) -> str:
		return f"Продукт: {self.product} заказа {self.order.id}"

	def save(self, *args, **kwargs):
		if not self.id:
			self.price = self.product.price

		if self.quantity < 1:
			self.quantity = 1

		if self.quantity >= 1:
			self.price = self.product.price * self.quantity
		super().save(*args, **kwargs)

	class Meta:
		verbose_name = "Элемент заказа"
		verbose_name_plural = "Элементы заказа"
