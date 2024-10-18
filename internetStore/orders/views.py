from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from store.models import Order
from .serializers import OrderSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrders(request):
	orders = Order.objects.filter(user=request.user.profile)
	serializer = OrderSerializer(orders, many=True)
	return Response(serializer.data, status=status.HTTP_200_OK)
