from django.db import models
from django.conf import settings
from django.utils import timezone

# --- ENUMS ---
PAYMENT_TYPE = [('visa', 'Visa'), ('mastercard', 'Mastercard'), ('amex', 'Amex')]

TRANSACTION_CATEGORY = [
    ('sale', 'Sale'),
    ('payout', 'Payout'),
    ('fee', 'Fee'),
    ('refund', 'Refund'),
    ('installment', 'Installment'),
    ('service', 'Service')
]

TRANSACTION_STATUS = [
    ('completed', 'Completed'),
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('failed', 'Failed')
]

PAYOUT_STATUS = [
    ('pending_approval', 'Pending Approval'),
    ('processing', 'Processing'),
    ('paid', 'Paid'),
    ('failed', 'Failed')
]

REFUND_STATUS = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
    ('escalated', 'Escalated')
]

# --- CORE WALLET MODELS ---

class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='wallet', on_delete=models.CASCADE)
    fiat_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    coin_balance = models.IntegerField(default=0)
    
    # Aggregates for Dashboard
    pending_clearance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    vendor_holdings = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Wallet: {self.user.username}"

class Transaction(models.Model):
    wallet = models.ForeignKey(Wallet, related_name='transactions', on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=[('credit', 'Credit'), ('debit', 'Debit')])
    category = models.CharField(max_length=20, choices=TRANSACTION_CATEGORY)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    merchant_or_source = models.CharField(max_length=100, default="System") # e.g. "Buyer: John Doe"
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUS, default='completed')
    date = models.DateField(auto_now_add=True) # Or DateTimeField
    reference_code = models.CharField(max_length=50, unique=True)
    
    # For Installments (stores JSON like {current: 1, total: 4, next_due: '2026-03-06'})
    installment_plan = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

class CoinHistory(models.Model):
    wallet = models.ForeignKey(Wallet, related_name='coin_history', on_delete=models.CASCADE)
    activity = models.CharField(max_length=255) # e.g., "High Volume Bonus"
    amount = models.IntegerField() # Positive for earned, negative for spent
    type = models.CharField(max_length=10, choices=[('earned', 'Earned'), ('spent', 'Spent')])
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

# --- PAYOUTS & TAX ---

class TaxProfile(models.Model):
    vendor = models.OneToOneField(settings.AUTH_USER_MODEL, related_name='tax_profile', on_delete=models.CASCADE)
    tax_id = models.CharField(max_length=20) # Masked in serializer
    w9_status = models.CharField(max_length=20, choices=[('submitted', 'Submitted'), ('missing', 'Missing')], default='missing')
    last_invoice_date = models.DateField(null=True, blank=True)
    
    @property
    def total_earnings_ytd(self):
        return 0.00 

class Payout(models.Model):
    vendor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='payouts', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=PAYOUT_STATUS, default='pending_approval')
    method = models.CharField(max_length=20, choices=[('stripe', 'Stripe'), ('bank_transfer', 'Bank Transfer'), ('paypal', 'PayPal')])
    created_at = models.DateField(auto_now_add=True)
    risk_flag = models.BooleanField(default=False) # Highlights risky payouts in UI

# --- DISPUTES ---

class RefundRequest(models.Model):
    # order = models.ForeignKey(Order, ...) # Assuming Order model exists from your snippet
    order_id = models.CharField(max_length=50) # Using CharField for simplicity if Order not imported
    customer_name = models.CharField(max_length=100)
    seller_name = models.CharField(max_length=100)
    product_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    date_requested = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=REFUND_STATUS, default='pending')
    auto_resolve_date = models.DateField(null=True, blank=True)


class PlatformSettings(models.Model):
    """
    Stores global system configurations.
    """
    key = models.CharField(max_length=50, unique=True) # e.g., 'auto_payouts'
    is_enabled = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key}: {self.is_enabled}"
    
class PaymentMethod(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='payment_methods', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=[('visa', 'Visa'), ('mastercard', 'Mastercard'), ('amex', 'Amex')])
    last4 = models.CharField(max_length=4)
    expiry = models.CharField(max_length=7) # MM/YYYY
    holder_name = models.CharField(max_length=100)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # If this is set to default, unset others
        if self.is_default:
            PaymentMethod.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)

class Subscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='subscriptions', on_delete=models.CASCADE)
    vendor_name = models.CharField(max_length=100)
    product_name = models.CharField(max_length=100)
    product_image = models.CharField(max_length=100, default="bg-gray-100 text-gray-600") # CSS classes for demo
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.CharField(max_length=20, choices=[('Weekly', 'Weekly'), ('Monthly', 'Monthly'), ('Quarterly', 'Quarterly')])
    next_billing_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'), 
        ('paused', 'Paused'), 
        ('cancelled', 'Cancelled'), 
        ('payment_failed', 'Payment Failed')
    ], default='active')
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)