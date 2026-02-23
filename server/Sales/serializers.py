from rest_framework import serializers
from .models import ProductPromotion

class ProductPromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPromotion
        fields = ['id', 'product_name', 'discount_amount', 'duration', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']