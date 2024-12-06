from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    getPopularProducts,
    searchPageProducts,
    heartProduct,
    infoAboutproductDetail,
    addFastView,
    removeAddProductToCart,
    updateCartProductQuantity,
    createOrder,
    addReview,
    heartReview,
    addComment,
    heartComment,
    getShoppingCartItems,
)

router = DefaultRouter()

urlpatterns = [
    path('getPopularProducts/', getPopularProducts, name='getPopularProducts'),
    path('searchPageProducts/', searchPageProducts, name='searchPageProducts'),
    path('heartProduct/<int:productId>', heartProduct, name='heartProduct'),

    path('infoAboutproductDetail/<int:productId>', infoAboutproductDetail, name='infoAboutproductDetail/'),
    path('product/<int:productId>/fastviews/', addFastView, name='addFastViews'),
    path('product/<int:productId>/review/', addReview, name='addReview'),
    path('review/<int:reviewId>/heart/', heartReview, name='heartReview'),
    path('review/<int:reviewId>/comment/', addComment, name='addComment'),
    path('comment/<int:commentId>/heart/', heartComment, name='heartComment'),

	path('getShoppingCartItems/', getShoppingCartItems, name='getShoppingCartItems'),
    path('cart/item/<int:itemId>/', removeAddProductToCart, name='removeAddProductToCart'),
    path('cart/item/<int:cartItemId>/<str:action>/', updateCartProductQuantity, name='updateCartProductQuantity'),

    path('order/', createOrder, name='createOrder'),
]
