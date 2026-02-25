# serializers.py
from rest_framework import serializers
from .models import Product,ModerationItem, ProductReview
from django.utils.timesince import timesince

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.ReadOnlyField(source='seller.username')
    seller_id = serializers.ReadOnlyField(source='seller.id')
    category = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock_quantity', 
            'status', 'internal_interest', 'external_interest', 
            'demand_score', 'seller_name', 'created_at', 'img','seller_id',"category", 
            
        ]   



class ModerationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationItem
        fields = '__all__'


class ProductReviewSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    content = serializers.CharField(source='comment') # Map 'comment' to 'content'
    sentiment = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    seller_reply = serializers.SerializerMethodField()

    class Meta:
        model = ProductReview
        fields = ['id', 'customer', 'product', 'rating', 'content', 'date', 'sentiment', 'status', 'seller_reply']

        def get_customer(self, obj):
            return obj.user.username
        
        def get_product(self, obj):
            return obj.product.name
        
        def get_date(self, obj):
            return f"{timesince(obj.created_at)} ago"
        
        def get_sentiment(self, obj):
            if obj.rating >= 4:
                return "positive"
            elif obj.rating <= 2:
                return "negative"
            else:
                return "neutral"
        def get_status(self, obj):
            return obj.status
        
        def get_seller_reply(self, obj):
            reply = obj.replies.first()
            return reply.comment if reply else None
        