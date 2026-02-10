# serializers.py
from rest_framework import serializers
from .models import Product,ModerationItem

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.ReadOnlyField(source='seller.username')
    seller_id = serializers.ReadOnlyField(source='seller.id')
    category = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_quantity', 
            'status', 'internal_interest', 'external_interest', 
            'demand_score', 'seller_name', 'created_at', 'img','seller_id',"category"
        ]   



class ModerationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationItem
        fields = '__all__'