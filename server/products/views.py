# views.py
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductSerializer
from rest_framework import permissions

class ProductViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.filter(seller=request.user) 
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seller=request.user) 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Product.objects.get(pk=pk, seller=user)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk, request.user)
        if not product:
            return Response({"detail": "Product not found or access denied."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk, request.user)
        if not product:
            return Response({"detail": "Product not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk, request.user)
        if not product:
            return Response({"detail": "Product not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({"detail": "Product deleted."}, status=status.HTTP_200_OK)
    


class AdminapprovalView(APIView):
        permission_classes = [permissions.IsAdminUser]
        def post(self, request, pk):
            try:
                product = Product.objects.get(pk=pk)
                product.status = 'approved'
                product.save()
                return Response({"detail": "Product approved."}, status=status.HTTP_200_OK)
            except Product.DoesNotExist:
                return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
            
        def get (self, request):
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
            

class AdminrejectView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            product.status = 'rejected'
            product.save()
            return Response({"detail": "Product rejected."}, status=status.HTTP_200_OK)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


class GestproductView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.filter(status='approved') 
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    