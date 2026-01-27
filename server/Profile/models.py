from django.db import models
from django.conf import settings


class UserProfile(models.Model):


    CATEGORY_CHOICES = (
        ('Electronics', 'Electronics'),
        ('Fashion', 'Fashion'),
        ('Home', 'Home'),
        ('Books', 'Books'),
        ('Sports', 'Sports'),
        ('Beauty', 'Beauty'),
        ('Automotive', 'Automotive'),
        ('Toys', 'Toys'),
        ('Other', 'Other'),

    )

    ROLE_CHOICES = (
        ('guest', 'Guest'),
        ('user', 'User'),     
        ('seller', 'Seller'), 
        ('admin', 'Admin'),
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_approved = models.BooleanField(default=True)


    business_name = models.CharField(max_length=255, blank=True, null=True)
    owner_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='Other')
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    bank_details = models.TextField(blank=True, null=True)
    # This stores the PDF or Image uploaded
    id_document = models.FileField(upload_to="seller_docs/", blank=True, null=True)


    def __str__(self):
        return self.user.username
