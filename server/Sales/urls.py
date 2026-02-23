from django.urls import path
from .views import ProductPromotionAPI, TikTokInfluencerSearchAPI

urlpatterns = [
    # The endpoint for the live TikTok NLP search
    path('influencers/tiktok/search/', TikTokInfluencerSearchAPI.as_view(), name='tiktok-search'),
    path('promotions/', ProductPromotionAPI.as_view(), name='product-promotions'),
]