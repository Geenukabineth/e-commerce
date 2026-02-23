from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .models import ProductPromotion
from .serializers import ProductPromotionSerializer

# Import the logic from your uploaded nlp_utils.py file
from .nlp_utils import find_tiktok_ambassadors

logger = logging.getLogger(__name__)

class TikTokInfluencerSearchAPI(APIView):
    """
    API endpoint that accepts a search query, triggers live TikTok scraping,
    and returns influencers ranked by Hugging Face semantic similarity.
    """
    def get(self, request):
        # 1. Get the search query from the React frontend (e.g., ?query=vegan cooking)
        query = request.query_params.get('query', '').strip()
        
        # 2. Get the target usernames to scrape
        # Since this is a live scraper, we need a list of accounts to check.
        # You can accept this from the frontend or default to a curated list in your DB.
        # For now, we allow the frontend to pass them or fall back to a default demo list.
        default_targets = "mkbhd,gordonramsayofficial"
        targets_param = request.query_params.get('targets', default_targets)
        
        if not query:
            return Response(
                {"error": "Please provide a 'query' parameter (e.g., ?query=tech gadgets)"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Clean up the list of usernames (remove spaces, empty strings)
        target_usernames = [t.strip() for t in targets_param.split(',') if t.strip()]

        try:
            # 3. Trigger the Scraper + NLP Engine from nlp_utils.py
            # This runs the logic: Scrape -> Embed (Hugging Face) -> Rank (Cosine Similarity)
            matches = find_tiktok_ambassadors(query, target_usernames)
            
            # 4. Return the ranked list as JSON
            return Response(matches, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error in TikTok search: {str(e)}")
            return Response(
                {"error": f"An error occurred during analysis: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class ProductPromotionAPI(APIView):
    """
    API endpoint to manage product promotions.
    """
    def get(self, request):
        promotions = ProductPromotion.objects.all()
        serializer = ProductPromotionSerializer(promotions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # This will be implemented to create a new promotion in the database
        serializer = ProductPromotionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)