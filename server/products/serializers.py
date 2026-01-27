# serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class __clat__:
        model = Product
        fields = '__all__'
