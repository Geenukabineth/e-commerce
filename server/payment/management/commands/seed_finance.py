import random
import string
from decimal import Decimal
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

# Adjust 'your_app' to the actual name of the app where your models live
from payment.models import (
    Wallet, Transaction, CoinHistory, TaxProfile, Payout, 
    RefundRequest, PlatformSettings, PaymentMethod, 
    Subscription, PromotionRequest, Orders, TimelineEvent, Items
)
from products.models import Product  # Assumed to exist based on your imports

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with dummy finance and order data.'

    def generate_ref_code(self, prefix):
        return f"{prefix}-{''.join(random.choices(string.ascii_uppercase + string.digits, k=8))}"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # 1. Create Mock Users
        admin_user, _ = User.objects.get_or_create(username="admin", defaults={"is_staff": True, "is_superuser": True, "email": "admin@test.com"})
        if _: # Only set password if newly created
            admin_user.set_password('password123')
            admin_user.save()

        vendor1, _ = User.objects.get_or_create(username="TechStore", defaults={"email": "tech@test.com"})
        vendor2, _ = User.objects.get_or_create(username="FashionHub", defaults={"email": "fashion@test.com"})
        buyer1, _ = User.objects.get_or_create(username="AlexBuyer", defaults={"email": "alex@test.com"})

        users = [vendor1, vendor2, buyer1]

        # 2. Create Mock Products (FIXED: Added required seller and price fields)
        product1, _ = Product.objects.get_or_create(
            name="Mechanical Keyboard",
            defaults={
                "seller": vendor1,
                "price": Decimal("99.99"),
                "stock_quantity": 50
            }
        )
        
        product2, _ = Product.objects.get_or_create(
            name="Gaming Mouse",
            defaults={
                "seller": vendor2,
                "price": Decimal("49.99"),
                "stock_quantity": 100
            }
        )

        # 3. Platform Settings
        PlatformSettings.objects.get_or_create(key="auto_payouts", defaults={"is_enabled": True})

        # 4. Wallets, Transactions, and Coin History
        categories = ['sale', 'payout', 'fee', 'refund', 'installment', 'service']
        statuses = ['completed', 'pending', 'processing', 'failed']

        for user in users:
            wallet, _ = Wallet.objects.get_or_create(
                user=user,
                defaults={
                    "fiat_balance": Decimal(random.randint(100, 5000)),
                    "coin_balance": random.randint(100, 1000),
                    "pending_clearance": Decimal(random.randint(0, 500)),
                    "vendor_holdings": Decimal(random.randint(0, 1000)) if user != buyer1 else Decimal(0)
                }
            )

            # Seed Transactions
            for _ in range(3):
                Transaction.objects.get_or_create(
                    wallet=wallet,
                    reference_code=self.generate_ref_code("TXN"),
                    defaults={
                        "type": random.choice(['credit', 'debit']),
                        "category": random.choice(categories),
                        "amount": Decimal(random.randint(10, 300)),
                        "description": f"Payment for Order #{random.randint(1000,9999)}",
                        "merchant_or_source": "System",
                        "status": random.choice(statuses)
                    }
                )

            # Seed Coin History
            for _ in range(2):
                CoinHistory.objects.get_or_create(
                    wallet=wallet,
                    activity="Review Bonus" if random.choice([True, False]) else "Purchase Reward",
                    amount=random.randint(10, 50),
                    type=random.choice(['earned', 'spent'])
                )

        # 5. Vendor Specific Data (Tax & Payouts)
        for vendor in [vendor1, vendor2]:
            TaxProfile.objects.get_or_create(
                vendor=vendor,
                defaults={
                    "tax_id": f"TAX-{random.randint(10000,99999)}",
                    "w9_status": random.choice(['submitted', 'missing']),
                    "last_invoice_date": timezone.now().date()
                }
            )

            Payout.objects.get_or_create(
                vendor=vendor,
                defaults={
                    "amount": Decimal(random.randint(500, 2000)),
                    "status": random.choice(['pending_approval', 'processing', 'paid']),
                    "method": random.choice(['stripe', 'bank_transfer', 'paypal']),
                    "risk_flag": random.choice([True, False])
                }
            )

            PromotionRequest.objects.get_or_create(
                vendor=vendor,
                product_name=product1 if vendor == vendor1 else product2,
                defaults={
                    "discount_amount": "20% OFF",
                    "duration": "7 Days",
                    "status": random.choice(["pending", "approved", "rejected"])
                }
            )

        # 6. Payment Methods & Subscriptions (For Buyer)
        payment_method, _ = PaymentMethod.objects.get_or_create(
            user=buyer1,
            last4="4242",
            defaults={
                "type": "visa",
                "expiry": "12/2026",
                "holder_name": "Alex Buyer",
                "is_default": True
            }
        )

        Subscription.objects.get_or_create(
            user=buyer1,
            product_name="Pro Member Tier",
            defaults={
                "vendor_name": "System",
                "amount": Decimal("19.99"),
                "frequency": "Monthly",
                "next_billing_date": timezone.now().date() + timedelta(days=15),
                "status": "active",
                "payment_method": payment_method
            }
        )

        # 7. Orders & Refunds
        for i in range(3):
            order_id = self.generate_ref_code("ORD")
            order, _ = Orders.objects.get_or_create(
                order_id=order_id,
                defaults={
                    "customer_name": buyer1.username,
                    "seller_name": random.choice([vendor1.username, vendor2.username]),
                    "product_name": "Assorted Tech Goods",
                    "amount": Decimal(random.randint(50, 400)),
                    "shipping_cost": Decimal("15.00"),
                    "subtotal": Decimal("0.00"), # Will be updated dynamically usually
                    "shipping_address": "123 Seed Street, Data City, NY",
                    "status": random.choice(['pending', 'shipped', 'delivered'])
                }
            )

            # Order Items
            Items.objects.get_or_create(
                order=order,
                product_name="Wireless Earbuds",
                defaults={"quantity": random.randint(1, 3), "price_per_unit": Decimal("49.99")}
            )

            # Order Timeline
            TimelineEvent.objects.get_or_create(
                order=order,
                event="Order Placed Successfully"
            )

            # Randomly dispute one order
            if i == 0:
                RefundRequest.objects.get_or_create(
                    order_id=order.order_id,
                    defaults={
                        "customer_name": order.customer_name,
                        "seller_name": order.seller_name,
                        "product_name": order.product_name,
                        "amount": order.amount,
                        "reason": "Item arrived damaged.",
                        "status": "pending"
                    }
                )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully!"))