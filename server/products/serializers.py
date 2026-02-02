# serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_quantity', 
            'status', 'internal_interest', 'external_interest', 
            'demand_score', 'seller_name', 'created_at'
        ]   