from rest_framework import serializers
from sympy import Order

from .models import Wallet, Transaction, CoinHistory, Payout, RefundRequest, TaxProfile,PaymentMethod,Subscription,PromotionRequest, Orders

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


class ProductPromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromotionRequest
        fields = '__all__'

# Make sure to import TimelineEv

class OrderSerializer(serializers.ModelSerializer):
    # Rename database fields to match React's expected property names
    orderNumber = serializers.CharField(source='order_id')
    total = serializers.DecimalField(source='amount', max_digits=10, decimal_places=2)
    notes = serializers.CharField(source='internal_notes', allow_blank=True)    
    # Create custom nested fields for the complex objects React expects
    customer = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    timeline = serializers.SerializerMethodField()
    paymentStatus = serializers.SerializerMethodField()

    class Meta:
        model = Orders
        fields = [
            'id', 'orderNumber', 'date', 'status', 'paymentStatus', 
            'total', 'customer', 'items', 'timeline', 'notes'
        ]

    def get_paymentStatus(self, obj):
        # Since payment status isn't in your Orders model, we default to 'paid'
        return 'paid'

    def get_customer(self, obj):
        # Translates flat customer_name into the nested object React expects
        return {
            "name": obj.customer_name,
            "email": f"{obj.customer_name.replace(' ', '').lower()}@example.com", # Placeholder
            "phone": "+1 (555) 000-0000", # Placeholder
            "address": obj.shipping_address,
            "city": "N/A",
            "country": "US",
            "risk_score": "low",
            "orders_count": 1,
            "ltv": float(obj.amount)
        }

    def get_items(self, obj):
        # Fetches related Items and shapes them for React
        related_items = obj.items.all()
        return [
            {
                "id": str(item.id), 
                "name": item.product_name, 
                "price": float(item.price_per_unit), 
                "quantity": item.quantity, 
                "variant": "Standard", 
                "sku": f"SKU-{item.id}"
            } for item in related_items
        ]

    def get_timeline(self, obj):
        # Fetches related TimelineEvents and shapes them for React
        events = obj.timeline_events.all()
        
        # If no events exist, return a default one so the UI doesn't break
        if not events.exists():
            return [{"status": "Order Placed", "date": obj.date.strftime('%b %d, %Y'), "completed": True}]
            
        return [
            {
                "status": event.event, 
                "date": event.date.strftime('%b %d, %Y'), 
                "completed": True
            } for event in events
        ]