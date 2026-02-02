from django.db import models
from django.conf import settings

class Product(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(upload_to="products/", blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    internal_interest = models.IntegerField(default=0) # Percentage (0-100)
    external_interest = models.CharField(max_length=100, default="Analyzing...")
    demand_score = models.IntegerField(default=0)

    def __str__(self):
        return self.name + self.status