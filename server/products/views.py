# views.py
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.views import APIView
from .models import Product,ModerationItem,ProductReview, StoreSettings
from .serializers import ProductSerializer,ModerationItemSerializer,ProductReviewSerializer
from rest_framework import permissions
from rest_framework.decorators import action
from .utilty import MarketIntelligenceService,analyze_content_risk
from Profile.permission import IsSeller,IsAdminorSeller,IsBuyer


class ProductViewSet(APIView):
    permission_classes = [IsSeller]

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

class SellerRelatedProductViewSet(APIView):
    permission_classes = [IsSeller]
    def get(self, request):
        products = Product.objects.filter(seller=request.user, status='approved') 
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    


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

class ProductAnalysisView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            
            service = MarketIntelligenceService()

            vision_data = {"confidence": 0.85, "label": product.name, "web_entities": []}
            if product.img:
                try:
                    vision_data = service.analyze_image(product.img.path)
                except Exception as e:
                    print(f"Image analysis skipped: {e}")

            search_query = vision_data['label'] if vision_data['label'] != "Unknown" else product.name
            competitors = service.fetch_competitor_prices(search_query)

            # 3. ML DEMAND FORECAST
            ml_result = service.predict_demand(
                product_price=float(product.price),
                competitors=competitors,
                category=vision_data['label']
            )

            response_data = {
                "visualMatchConfidence": vision_data['confidence'],
                "detectedCategory": vision_data['label'],
                "marketAverage": ml_result['market_avg'],
                "globalInterest": ml_result['trend'],
                "interestGrowth": ml_result['growth'],
                "competitorPrices": competitors,
                "mlDemandForecast": ml_result['score'],
                "demandTrend": ml_result['history']
            }

            # Optional: Save the computed score to the model immediately
            product.demand_score = ml_result['score']
            product.external_interest = f"{ml_result['trend'].title()} ({ml_result['growth']}%)"
            product.save()

            return Response(response_data, status=status.HTTP_200_OK)

        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Analysis Error: {e}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ModerationItem
from .serializers import ModerationItemSerializer
from .utilty import analyze_content_risk

class ModerationListCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # List all unresolved items
        items = ModerationItem.objects.filter(is_resolved=False).order_by('-created_at')
        serializer = ModerationItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Create new item with AI Analysis
        serializer = ModerationItemSerializer(data=request.data)
        if serializer.is_valid():
            content = serializer.validated_data.get('content', '')
            
            # Run AI Logic
            risk, conf, rec = analyze_content_risk(content)
            
            # Save
            serializer.save(
                risk_level=risk, 
                ml_confidence=conf, 
                recommended_action=rec
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ModerationResolveView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            item = ModerationItem.objects.get(pk=pk)
            item.is_resolved = True
            item.save()
            return Response({
                'status': 'resolved', 
                'action_taken': request.data.get('action')
            }, status=status.HTTP_200_OK)
        except ModerationItem.DoesNotExist:
            return Response(
                {"detail": "Item not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

# 3. Get Dashboard Stats
class ModerationStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_pending = ModerationItem.objects.filter(is_resolved=False).count()
        high_risk = ModerationItem.objects.filter(risk_level='High', is_resolved=False).count()
        
        return Response({
            "pending_reviews": total_pending,
            "high_risk_content": high_risk,
            "auto_approved": 540,
            "accuracy": "96%"
        })


class ReviewViewSet(APIView):
    permission_classes = [IsSeller]
    # Only fetch top-level reviews, ignore the replies themselves in the main feed
    queryset = ProductReview.objects.filter(reply_to__isnull=True).order_by('-created_at')
    serializer_class = ProductReviewSerializer

    # POST /api/reviews/{id}/reply/
    def post(self, request, pk=None):
        parent_review = self.get_object()
        reply_text = request.data.get('reply_text')
        
        if not reply_text:
            return Response({"error": "reply_text is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new review linked as a reply
        ProductReview.objects.create(
            product=parent_review.product,
            user=request.user, # The currently logged-in seller/admin
            rating=0,
            comment=reply_text,
            reply_to=parent_review,
            status='approved'
        )
        
        # Return the updated parent review so React updates instantly
        return Response(ProductReviewSerializer(parent_review).data)

    def get(self,request, pk=None):
        reviews = self.queryset.filter(product__seller=request.user)
        serializer = self.serializer_class(reviews, many=True)
        return Response(serializer.data)

class SettingsViewSet(APIView):
    permission_classes = [IsSeller]
    # GET /api/settings/
    def get(self, request):
        settings = StoreSettings.load()
        return Response({"autoReplyEnabled": settings.auto_reply_enabled})

    # POST /api/settings/toggle_auto_reply/
    def post(self, request):
        settings = StoreSettings.load()
        enabled_state = request.data.get('autoReplyEnabled', not settings.auto_reply_enabled)
        
        settings.auto_reply_enabled = enabled_state
        settings.save()
        
        return Response({"autoReplyEnabled": settings.auto_reply_enabled})