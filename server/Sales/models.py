from django.db import models

class ProductPromotion(models.Model):
    product_name = models.CharField(max_length=200)
    discount_amount = models.CharField(max_length=100) # e.g., "20% OFF", "$15 Flat"
    duration = models.CharField(max_length=100) # e.g., "7 Days", "Ends Friday"
    status = models.CharField(max_length=50, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} - {self.discount_amount}"