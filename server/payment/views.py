from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db.models import Sum, Q
from django.shortcuts import get_object_or_404
from .models import Wallet, Payout, RefundRequest, TaxProfile, Subscription,PaymentMethod
from .serializers import (
    WalletDashboardSerializer, 
    PayoutSerializer, 
    RefundRequestSerializer,
    TaxProfileSerializer,
    PaymentMethodSerializer,
    SubscriptionSerializer,
)

# --- WALLET HUB ---

class WalletHubView(APIView):
    """
    Handles data for the Wallet Hub Dashboard (Balances + History).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Ensure wallet exists
        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        
        # Optional: Filter transactions by search query
        search_query = request.query_params.get('search', '')
        
        # Serialize the main wallet data
        serializer = WalletDashboardSerializer(wallet)
        data = serializer.data

        # If search is present, filter the transactions list manually in the response
        if search_query:
            filtered_txns = wallet.transactions.filter(
                Q(description__icontains=search_query) | 
                Q(reference_code__icontains=search_query)
            )
            # Replace the full list with filtered list in the response data
            from .serializers import TransactionSerializer
            data['transactions'] = TransactionSerializer(filtered_txns, many=True).data

        return Response(data, status=status.HTTP_200_OK)


# --- PAYOUT MANAGEMENT ---

class PayoutListView(APIView):
    """
    Handles listing payouts and creating new payout requests.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Admins see all payouts; Vendors see only their own
        if request.user.is_staff:
            payouts = Payout.objects.all().order_by('-created_at')
        else:
            payouts = Payout.objects.filter(vendor=request.user).order_by('-created_at')
            
        serializer = PayoutSerializer(payouts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Create a new payout request
        serializer = PayoutSerializer(data=request.data)
        if serializer.is_valid():
            # Auto-assign the logged-in user as vendor
            serializer.save(vendor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PayoutActionView(APIView):
    """
    Handles specific actions on a payout (e.g., Approve/Reject).
    """
    permission_classes = [permissions.IsAdminUser] # Only admins can approve

    def post(self, request, pk):
        payout = get_object_or_404(Payout, pk=pk)
        action_type = request.data.get('action')

        if action_type == 'approve':
            # Logic: Integrate with Stripe/PayPal API here
            payout.status = 'paid'
            payout.save()
            return Response({'status': 'approved', 'id': payout.id}, status=status.HTTP_200_OK)
        
        elif action_type == 'reject':
            payout.status = 'failed'
            payout.save()
            return Response({'status': 'rejected', 'id': payout.id}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid action provided'}, status=status.HTTP_400_BAD_REQUEST)


# --- REFUND DISPUTES ---

class RefundListView(APIView):
    """
    Lists all refund requests.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Logic: Admins see all, Vendors see refunds for their products
        if request.user.is_staff:
            refunds = RefundRequest.objects.all().order_by('-date_requested')
        else:
            # Assuming 'seller_name' matches username or you have a vendor FK
            refunds = RefundRequest.objects.filter(seller_name=request.user.username).order_by('-date_requested')
            
        serializer = RefundRequestSerializer(refunds, many=True)
        return Response(serializer.data)


class RefundActionView(APIView):
    """
    Handles resolving a refund (Approve/Deny).
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        refund = get_object_or_404(RefundRequest, pk=pk)
        action_type = request.data.get('action') # 'approve' or 'reject'

        if action_type == 'approve':
            refund.status = 'approved'
            refund.save()
            # TODO: Logic to deduct funds from Vendor Wallet
            return Response({'status': 'refund approved', 'id': refund.id})
        
        elif action_type == 'reject':
            refund.status = 'rejected'
            refund.save()
            return Response({'status': 'refund rejected', 'id': refund.id})

        return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)


# views.py
from .models import PlatformSettings  # <--- Import the new model
from .serializers import AutoPayoutToggleSerializer # <--- Import new serializer

# ... existing views ...

# --- NEW VIEW FOR THE TOGGLE ---
class AutoPayoutsView(APIView):
    """
    Toggles the system-wide Auto-Payouts setting.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = AutoPayoutToggleSerializer(data=request.data)
        if serializer.is_valid():
            enabled = serializer.validated_data['enabled']
            
            # Update or Create the setting
            setting, created = PlatformSettings.objects.update_or_create(
                key='auto_payouts',
                defaults={'is_enabled': enabled}
            )
            
            return Response({
                'status': 'success', 
                'automation_enabled': setting.is_enabled
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- UPDATED FINANCE DASHBOARD VIEW ---
class FinanceDashboardView(APIView):
    """
    Aggregates data for the Admin Finance Overview.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # 1. Calculate Aggregates
        total_revenue = Wallet.objects.aggregate(sum=Sum('fiat_balance'))['sum'] or 0
        vendor_holdings = Wallet.objects.aggregate(sum=Sum('vendor_holdings'))['sum'] or 0
        pending_clearance = Wallet.objects.aggregate(sum=Sum('pending_clearance'))['sum'] or 0

        # 2. Get Real Automation Status (New Logic)
        try:
            # Fetch from DB, default to True if not set
            setting = PlatformSettings.objects.get(key='auto_payouts')
            is_auto_enabled = setting.is_enabled
        except PlatformSettings.DoesNotExist:
            is_auto_enabled = True

        # 3. Get Tax Profiles
        tax_profiles = TaxProfile.objects.all()
        tax_serializer = TaxProfileSerializer(tax_profiles, many=True)

        data = {
            'stats': {
                'platform_revenue': total_revenue,
                'vendor_holdings': vendor_holdings,
                'pending_clearance': pending_clearance,
                'automation_enabled': is_auto_enabled # <--- Now dynamic
            },
            'tax_records': tax_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)
    

class PaymentMethodView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cards = PaymentMethod.objects.filter(user=request.user).order_by('-is_default')
        serializer = PaymentMethodSerializer(cards, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PaymentMethodSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        card = get_object_or_404(PaymentMethod, pk=pk, user=request.user)
        card.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, pk):
        # Used for "Make Default" or Edit
        card = get_object_or_404(PaymentMethod, pk=pk, user=request.user)
        serializer = PaymentMethodSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- SUBSCRIPTIONS ---

class SubscriptionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        subs = Subscription.objects.filter(user=request.user)
        serializer = SubscriptionSerializer(subs, many=True)
        return Response(serializer.data)

    def post(self, request, pk):
        sub = get_object_or_404(Subscription, pk=pk, user=request.user)
        action = request.data.get('action') # pause, resume, cancel

        if action == 'pause':
            sub.status = 'paused'
        elif action == 'resume':
            sub.status = 'active'
        elif action == 'cancel':
            sub.status = 'cancelled'
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        sub.save()
        return Response({'status': sub.status, 'id': sub.id})