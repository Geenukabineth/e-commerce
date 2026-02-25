import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

# IMPORTANT: Change 'your_app_name' to the actual name of your Django app
from products.models import Product, ModerationItem, StoreSettings, ProductReview

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with dummy products, reviews, and moderation items.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # 1. Create Mock Users
        admin_user, _ = User.objects.get_or_create(username="admin", defaults={"is_staff": True, "is_superuser": True, "email": "admin@test.com"})
        if _: # Only set password if newly created
            admin_user.set_password('password123')
            admin_user.save()

        seller1, _ = User.objects.get_or_create(username="TechStore", defaults={"email": "tech@test.com"})
        seller2, _ = User.objects.get_or_create(username="LifestyleCo", defaults={"email": "life@test.com"})
        customer1, _ = User.objects.get_or_create(username="AlexBuyer", defaults={"email": "alex@test.com"})
        customer2, _ = User.objects.get_or_create(username="SamShopper", defaults={"email": "sam@test.com"})

        # 2. Store Settings (Singleton)
        StoreSettings.objects.get_or_create(pk=1, defaults={'auto_reply_enabled': True})

        # 3. Create Mock Products
        product1, _ = Product.objects.get_or_create(
            name="Mechanical Gaming Keyboard",
            defaults={
                "seller": seller1,
                "description": "A high-quality mechanical keyboard with customizable RGB lighting and tactile switches.",
                "price": Decimal("129.99"),
                "stock_quantity": 50,
                "status": "approved",
                "internal_interest": 85,
                "external_interest": "High demand in gaming sector",
                "demand_score": 90
            }
        )

        product2, _ = Product.objects.get_or_create(
            name="Ergonomic Desk Chair",
            defaults={
                "seller": seller2,
                "description": "Comfortable mesh chair designed for long working hours with lumbar support.",
                "price": Decimal("249.50"),
                "stock_quantity": 20,
                "status": "approved",
                "internal_interest": 60,
                "external_interest": "Steady steady growth",
                "demand_score": 75
            }
        )

        # 4. Create Reviews & Replies
        review1, _ = ProductReview.objects.get_or_create(
            product=product1,
            user=customer1,
            rating=5,
            comment="Absolutely love this keyboard! The switches are so tactile and responsive.",
            defaults={
                "likes": 12,
                "status": "approved"
            }
        )

        # Create a seller reply to the first review
        ProductReview.objects.get_or_create(
            product=product1,
            user=seller1,
            rating=0, # Rating doesn't matter for replies
            comment="Thank you for the great feedback, Alex! Enjoy your gaming sessions.",
            reply_to=review1,
            status="approved"
        )

        review2, _ = ProductReview.objects.get_or_create(
            product=product2,
            user=customer2,
            rating=2,
            comment="The chair is okay, but the armrests are a bit wobbly and hard to adjust.",
            defaults={
                "likes": 4,
                "status": "pending"
            }
        )

        # 5. Create Moderation Items (Flagged Content)
        ModerationItem.objects.get_or_create(
            content_type="Product Review",
            content="This product is absolute garbage and the seller is a scammer! Avoid at all costs!",
            defaults={
                "reported_by": "AI System",
                "risk_level": "High",
                "ml_confidence": 95,
                "recommended_action": "Remove Content",
                "is_resolved": False
            }
        )

        ModerationItem.objects.get_or_create(
            content_type="Seller Comment",
            content="Hey, we offer a 10% discount if you message us outside the platform and pay via wire transfer.",
            defaults={
                "reported_by": "User Report",
                "risk_level": "Medium",
                "ml_confidence": 78,
                "recommended_action": "Manual Review",
                "is_resolved": False
            }
        )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with Products, Reviews, and Moderation Items!"))