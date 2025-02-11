from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from store.models import Order
from .models import Chat, Message
from .serializers import MessageSerializer, ChatSerializer, OrderSerializer
from accounts.models import Profile
from internetStore.utils import (
	generate_cache_key,
	get_cached_data,
	set_cache_data,
	generate_cache_key_chat_messages,
	get_cached_data_chat_messages,
	set_cache_data_chat_messages,
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrders(request):
	cache_key = generate_cache_key('order_page', request.user)
	cached_data = get_cached_data(cache_key)

	if cached_data:
		return Response(cached_data, status=200)

	orders = Order.objects.filter(user=request.user.profile)
	serializer = OrderSerializer(orders, many=True)

	set_cache_data(cache_key, serializer.data, timeout=60 * 60)
	return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_chats(request):
	cache_key = generate_cache_key('chats', request.user)
	cached_data = get_cached_data(cache_key)

	if cached_data:
		return Response(cached_data, status=200)

	user_profile = request.user.profile
	chats = Chat.objects.filter(participants=user_profile)

	serializer = ChatSerializer(chats, many=True)

	set_cache_data(cache_key, serializer.data, timeout=60 * 60)
	return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, chat_id):
	cache_key = generate_cache_key_chat_messages(chat_id)
	cached_data = get_cached_data_chat_messages(cache_key)

	if cached_data:
		return Response(cached_data, status=status.HTTP_200_OK)

	try:
		chat = Chat.objects.get(id=chat_id)
	except Chat.DoesNotExist:
		return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

	user_profile = request.user.profile
	if user_profile not in chat.participants.all():
		return Response({"detail": "You are not a participant of this chat."}, status=status.HTTP_403_FORBIDDEN)

	messages = Message.objects.filter(chat=chat).order_by('created_at')
	serializer = MessageSerializer(messages, many=True)

	set_cache_data_chat_messages(cache_key, serializer.data, timeout=60 * 60)

	return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_chat(request):
	participants_ids = request.data.get('participants', [])
	participants = Profile.objects.filter(id__in=participants_ids)

	if not participants.exists():
		return Response({"detail": "Participants not found."}, status=status.HTTP_400_BAD_REQUEST)

	chat = Chat.objects.create()
	chat.participants.set(participants)
	chat.save()

	return Response(ChatSerializer(chat).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_message(request, chat_id):
	try:
		chat = Chat.objects.get(id=chat_id)
	except Chat.DoesNotExist:
		return Response({"detail": "Chat not found."}, status=status.HTTP_404_NOT_FOUND)

	sender_profile = Profile.objects.get(user=request.user)
	if sender_profile not in chat.participants.all():
		return Response({"detail": "You are not a participant of this chat."}, status=status.HTTP_403_FORBIDDEN)

	text = request.data.get('text', None)
	image = request.data.get('image', None)

	if text or image:
		message = Message.objects.create(
			chat=chat,
			sender=sender_profile,
			text=text if text else None,
			image=image if image else None
		)
		return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)

	return Response({"detail": "Message content is required."}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_message(request, message_id):
	message = Message.objects.get(id=message_id)
	if message.sender.user == request.user:
		message.delete()
		return Response({"detail": "Message deleted."}, status=status.HTTP_204_NO_CONTENT)
	return Response({"detail": "You can only delete your own messages."}, status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_message_as_read(request, message_id):
	message = Message.objects.get(id=message_id)
	message.is_read = True
	message.save()
	return Response({"success": True}, status=status.HTTP_200_OK)
