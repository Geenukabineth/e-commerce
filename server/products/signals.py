from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ProductReview, StoreSettings

@receiver(post_save, sender=ProductReview)
def process_auto_reply(sender, instance, created, **kwargs):
    # Only trigger on newly created, top-level reviews
    if created and instance.reply_to is None:
        settings = StoreSettings.load()
        
        if settings.auto_reply_enabled:
            # Determine template based on rating
            if instance.rating >= 4:
                reply_text = "Thank you so much for your kind words! We're thrilled to hear you love it."
            elif instance.rating <= 2:
                reply_text = "We're so sorry to hear this didn't meet your expectations. Please DM us so we can make it right."
            else:
                reply_text = "Thanks for the feedback! We'll pass this along to our product team immediately."
            
            # Create the reply review automatically
            ProductReview.objects.create(
                product=instance.product,
                user=instance.product.seller,  # The seller creates the reply
                rating=0, # Rating doesn't matter for a reply
                comment=reply_text,
                reply_to=instance, # Link it to the parent review
                status='approved'
            )