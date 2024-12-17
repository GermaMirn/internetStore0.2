from rest_framework import serializers
from accounts.models import Profile
from store.models import Product, Order, OrderItem
from .models import Chat, Message



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
    status = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'fullname', 'phoneNumber', 'username']

class MessageSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer()

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'text', 'image', 'created_at', 'is_read']

class ChatSerializer(serializers.ModelSerializer):
    participants = ProfileSerializer(many=True)
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'participants', 'created_at', 'order']
