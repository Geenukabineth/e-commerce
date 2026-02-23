from rest_framework import serializers
from .models import Wallet, Transaction, CoinHistory, Payout, RefundRequest, TaxProfile,PaymentMethod,Subscription

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class CoinHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CoinHistory
        fields = '__all__'

class WalletDashboardSerializer(serializers.ModelSerializer):
    """
    Combines Wallet balances + recent transactions for the 'WalletHub'
    """
    transactions = TransactionSerializer(many=True, read_only=True)
    coin_history = CoinHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ['fiat_balance', 'coin_balance', 'pending_clearance', 'vendor_holdings', 'transactions', 'coin_history']

class PayoutSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.username', read_only=True)
    vendor_id = serializers.IntegerField(source='vendor.id', read_only=True)

    class Meta:
        model = Payout
        fields = ['id', 'vendor_name', 'vendor_id', 'amount', 'currency', 'status', 'method', 'created_at', 'risk_flag']

class TaxProfileSerializer(serializers.ModelSerializer):
    vendor_name = serializers.CharField(source='vendor.username', read_only=True)
    vendor_id = serializers.IntegerField(source='vendor.id', read_only=True)
    total_earnings_ytd = serializers.ReadOnlyField() # Calculated in model/view

    class Meta:
        model = TaxProfile
        fields = ['vendor_id', 'vendor_name', 'tax_id', 'total_earnings_ytd', 'last_invoice_date', 'w9_status']

class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = '__all__'


class AutoPayoutToggleSerializer(serializers.Serializer):
    enabled = serializers.BooleanField()


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'type', 'last4', 'expiry', 'holder_name', 'is_default']

class SubscriptionSerializer(serializers.ModelSerializer):
    payment_method_id = serializers.PrimaryKeyRelatedField(
        source='payment_method', 
        queryset=PaymentMethod.objects.all(),
        required=False, 
        allow_null=True
    )

    class Meta:
        model = Subscription
        fields = ['id', 'vendor_name', 'product_name', 'product_image', 'amount', 'frequency', 'next_billing_date', 'status', 'payment_method_id']