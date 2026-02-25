from django.urls import path
from .views import (
    OrdersView,
    WalletHubView, 
    PayoutListView, 
    PayoutActionView, 
    RefundListView, 
    RefundActionView, 
    FinanceDashboardView,
    AutoPayoutsView,
    PaymentMethodView,
    SubscriptionListView,
    ProductPromotionView,


)

urlpatterns = [
    # Wallet Hub
    path('wallet/my-hub/', WalletHubView.as_view(), name='wallet-hub'),
    # Payouts
    path('payouts/', PayoutListView.as_view(), name='payout-list'),
    path('payouts/<int:pk>/action/', PayoutActionView.as_view(), name='payout-action'),

    # Refunds
    path('refunds/', RefundListView.as_view(), name='refund-list'),
    path('refunds/<int:pk>/resolve/', RefundActionView.as_view(), name='refund-resolve'),

    # Admin Finance Dashboard
    path('finance/overview/', FinanceDashboardView.as_view(), name='finance-overview'),
    path('finance/auto-payouts/', AutoPayoutsView.as_view(), name='auto-payouts-toggle'),


    path('billing/cards/', PaymentMethodView.as_view(), name='cards-list'),
    path('billing/cards/<int:pk>/', PaymentMethodView.as_view(), name='cards-detail'),

    # Subscriptions
    path('billing/subscriptions/', SubscriptionListView.as_view(), name='subs-list'),
    path('billing/subscriptions/<int:pk>/action/', SubscriptionListView.as_view(), name='subs-action'),

    path('promotions/', ProductPromotionView.as_view(), name='promotions-list'),
    path('promotions/<int:pk>/', ProductPromotionView.as_view(), name='promotions-detail'),
    path('orders/', OrdersView.as_view(), name='orders-list'),
    path('orders/<int:pk>/', OrdersView.as_view(), name='orders-detail'),

]