import profile
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile



class RegisterSerializer(serializers.ModelSerializer):
    # Ensure password is not displayed in responses (write_only)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, required=False, default='user')

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    # Custom validation to check if username/email exists
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    # Override create to handle password hashing
    def create(self, validated_data):
        role = validated_data.pop('role', 'user')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Note: Your signals.py will automatically create the UserProfile
        # when this user is saved, so we don't need to do it here.
        profile.role = role
        profile = user.profile
        profile.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    image = serializers.ImageField(required=False)
    is_superuser = serializers.BooleanField(source="user.is_superuser", read_only=True)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "phone", "bio", "image", "is_superuser", "role"]
        read_only_fields = ["username", "email", "role", "is_superuser"]

    def get_role(self, obj):
        if obj.user.is_superuser:
            return "admin"
        return "user"


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import exceptions

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        try:
            profile = self.user.profile
            # BLOCK LOGIN if user is a seller and NOT approved
            if profile.role == 'seller' and not profile.is_approved:
                raise exceptions.AuthenticationFailed(
                    "Your seller account is pending approval. Please wait for admin verification."
                )
            
            # Add role to response
            data['role'] = profile.role
            data['username'] = self.user.username
            
        except UserProfile.DoesNotExist:
            pass 
        return data
    

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class SellerRegisterSerializer(serializers.ModelSerializer):
    # ... existing fields ...
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    business_name = serializers.CharField(required=True)
    owner_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    address = serializers.CharField(required=True)
    registration_number = serializers.CharField(required=True)
    bank_details = serializers.CharField(required=False, allow_blank=True)
    id_document = serializers.FileField(required=True)

    class Meta:
        model = UserProfile
        fields = [
            'username', 'email', 'password', 
            'business_name', 'owner_name', 'phone', 
            'address', 'registration_number', 'bank_details', 'id_document'
        ]

    def create(self, validated_data):
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password')

        user = User.objects.create_user(username=username, email=email, password=password)

        profile = user.profile
        profile.role = 'seller'
        profile.is_approved = False  # <--- CRITICAL: Sellers start as unapproved
        
        for attr, value in validated_data.items():
            setattr(profile, attr, value)
            
        profile.save()
        return profile    

# server/Profile/serializers.py
from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

# ... existing serializers ...

class UserManagementSerializer(serializers.ModelSerializer):
    # Map 'id' directly to the User model ID (not the profile ID) for easier deletion
    id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    is_superuser = serializers.BooleanField(source='user.is_superuser', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'phone', 'role', 'is_superuser', 'date_joined']
