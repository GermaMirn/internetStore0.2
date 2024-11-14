from rest_framework import serializers
from store.models import Order, OrderItem
from store.models import Product


class ProductSerializer(serializers.ModelSerializer):
    mainImageUrl = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'categories', 'mainImageUrl', 'hearts']

    def get_mainImageUrl(self, obj):
        if obj.mainImage:
            return obj.mainImage.url
        return None

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
