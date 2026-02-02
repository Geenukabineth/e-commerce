from  django.urls import path 
from .views import ProductViewSet, ProductDetailView


urlpatterns = [
    path('products/', ProductViewSet.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),



]