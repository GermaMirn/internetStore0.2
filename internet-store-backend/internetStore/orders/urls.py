from django.urls import path
from .views import getUserOrders, get_user_chats, get_chat_messages, create_chat, add_message, delete_message, mark_message_as_read
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
	path('getUserOrders/', getUserOrders, name='getUserOrders'),
	path('getUserChats/', get_user_chats, name='getUserChats'),
	path('chat/<int:chat_id>/messages/', get_chat_messages, name='getChatMessages'),
	path('create_chat/', create_chat, name='createChat'),
	path('chat/<int:chat_id>/addMessage/', add_message, name='addMessage'),
	path('message/<int:message_id>/delete/', delete_message, name='deleteMessage'),
	path('message/<int:message_id>/markAsRead/', mark_message_as_read, name='markMessageAsRead'),
]


if settings.DEBUG:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
