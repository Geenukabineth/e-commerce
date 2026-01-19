from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile



class RegisterSerializer(serializers.ModelSerializer):
    # Ensure password is not displayed in responses (write_only)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

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
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Note: Your signals.py will automatically create the UserProfile
        # when this user is saved, so we don't need to do it here.
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    image = serializers.ImageField(required=False)
    is_superuser = serializers.BooleanField(source="user.is_superuser", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "phone", "bio", "image", "is_superuser"]
        read_only_fields = ["username", "email"]