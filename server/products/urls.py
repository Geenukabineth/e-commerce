from  django.urls import path 
from .views import AdminapprovalView, AdminrejectView, ProductAnalysisView, ProductViewSet, ProductDetailView,ModerationListCreateView,ModerationResolveView,ModerationStatsView



urlpatterns = [
    path('products/', ProductViewSet.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-update-delete'),
    path("admin/products/<int:pk>/approve/", AdminapprovalView.as_view(), name="admin-product-approve" ),
    path("admin/products/<int:pk>/reject/", AdminrejectView.as_view(), name="admin-product-reject" ),
    path("admin/products/", AdminapprovalView.as_view(), name="admin-product-list" ),
    path("admin/products/<int:pk>/analyze/", ProductAnalysisView.as_view(), name="admin-product-analyze"),
    path("moderation/", ModerationListCreateView.as_view(), name="moderation-list"),
    path("moderation/<int:pk>/resolve/", ModerationResolveView.as_view(), name="moderation-resolve"),
    path("moderation/stats/", ModerationStatsView.as_view(), name="moderation-stats"),




]