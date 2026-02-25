from django.db import models
from django.conf import settings
from django.utils import timezone


REVIEW_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]

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

class ModerationItem(models.Model):
    RISK_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]
    
    CONTENT_TYPE_CHOICES = [
        ('Product Review', 'Product Review'),
        ('Product Description', 'Product Description'),
        ('Seller Comment', 'Seller Comment'),
    ]

    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    content = models.TextField()
    reported_by = models.CharField(max_length=100, default="AI System")
    
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES, blank=True)
    ml_confidence = models.IntegerField(default=0)
    recommended_action = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.content_type} - {self.risk_level} Risk"
    

class StoreSettings(models.Model):
    auto_reply_enabled =models.BooleanField(default=False)   

    def save(self, *args, **kwargs):
        self.pk = 1  # Ensure only one instance exists
        return super().save(*args, **kwargs)
    
    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
                      
class ProductReview(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    likes = models.IntegerField(default=0)
    reply_to = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=REVIEW_STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.product.name} - {self.rating} Stars"