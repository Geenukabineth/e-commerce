from django.urls import path
from .views import (
    WalletHubView, 
    PayoutListView, 
    PayoutActionView, 
    RefundListView, 
    RefundActionView, 
    FinanceDashboardView
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
]