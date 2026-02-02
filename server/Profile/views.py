from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import UserProfile
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken


class ProfileView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request):
        try:
            profile = UserProfile.objects.get(user=request.user)
            profile.delete()
            # Optionally delete the user account too:
            # request.user.delete()
            return Response({"detail": "Profile deleted."}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
class LoginView(APIView):     
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the refresh token from request body
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            # Blacklist it (requires 'rest_framework_simplejwt.token_blacklist' app installed)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            # Even if it fails (e.g. token invalid), we still want to log out on frontend
            return Response(status=status.HTTP_400_BAD_REQUEST)    

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SellerRegisterView(APIView):
    def post(self, request):
        serializer = SellerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Seller registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellerListView(APIView):
    # Reuse the same serializer used for User Management
    serializer_class = UserManagementSerializer
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Filter only users with the 'seller' role
        sellers = UserProfile.objects.filter(role='seller').order_by('-user__date_joined')
        serializer = self.serializer_class(sellers, many=True)
        return Response(serializer.data)
    def post(self, request, pk):
        try:
            profile = UserProfile.objects.get(user__id=pk, role='seller')
            profile.is_approved = True
            profile.save()
            return Response({"message": "Seller approved successfully"}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Seller profile not found."}, status=status.HTTP_404_NOT_FOUND)
    
class RestrictSellerView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def post(self, request, pk):
        try:
            profile = UserProfile.objects.get(user__id=pk, role='seller')
            profile.is_approved = False
            profile.save()
            return Response({"message": "Seller restricted successfully"}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({"detail": "Seller profile not found."}, status=status.HTTP_404_NOT_FOUND)
    

# server/Profile/views.py
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserManagementSerializer

# 1. LIST ALL USERS (Admin Only)
class UserListView(generics.ListAPIView):
    # We query UserProfile because it holds the 'role' and 'phone'
    queryset = UserProfile.objects.all().select_related('user').order_by('-user__date_joined')
    serializer_class = UserManagementSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDeleteView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            
            # Safety: Prevent deleting yourself
            if user.id == request.user.id:
                return Response(
                    {"detail": "You cannot delete your own admin account."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Deleting the User automatically cascades and deletes the UserProfile
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

