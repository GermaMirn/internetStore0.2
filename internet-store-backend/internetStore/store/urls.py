from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    categories,
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
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()


urlpatterns = [
    path('searchPageProducts/', searchPageProducts, name='searchPageProducts'),
    path('heartProduct/<int:productId>/', heartProduct, name='heartProduct'),
    path('categories/', categories, name='categories'),

    path('infoAboutproductDetail/<int:productId>/', infoAboutproductDetail, name='infoAboutproductDetail/'),
    path('product/<int:productId>/fastviews/', addFastView, name='addFastViews'),
    path('product/<int:productId>/review/', addReview, name='addReview'),
    path('review/<int:reviewId>/heart/', heartReview, name='heartReview'),
    path('review/<int:reviewId>/comment/', addComment, name='addComment'),
    path('comment/<int:commentId>/heart/', heartComment, name='heartComment'),

	path('getShoppingCartItems/', getShoppingCartItems, name='getShoppingCartItems'),
    path('cart/item/<int:productId>/', removeAddProductToCart, name='removeAddProductToCart'),
    path('cart/item/update/<int:ItemId>/', updateCartProductQuantity, name='updateCartProductQuantity'),

    path('createOrder/', createOrder, name='createOrder'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
