from rest_framework import serializers
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
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'


# class ProductHeartSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductHeart
#         fields = '__all__'


class ReviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewImage
        fields = '__all__'


class ReviewHeartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewHeart
        fields = '__all__'


class CommentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentImage
        fields = '__all__'


class CommentHeartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentHeart
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    images = CommentImageSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    images = ReviewImageSerializer(many=True, read_only=True)
    hearts = ReviewHeartSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    productImages = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_hearts_count(self, obj):
        return obj.product_hearts.count()


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
