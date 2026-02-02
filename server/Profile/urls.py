from django.urls import path

from .social_views import  GoogleLogin
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('register/', RegisterView.as_view(), name='register'),
    # This handles the login functionality
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('register-seller/', SellerRegisterView.as_view(), name='register-seller'),
    path('users/sellers/', SellerListView.as_view(), name='all-sellers'),

    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user-delete'),
    path("admin/sellers/<int:pk>/approve/", SellerListView.as_view(), name="approve-seller"),
    path("admin/sellers/<int:pk>/restrict/", RestrictSellerView.as_view(), name="restrict-seller"),

]
