from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile



class registeredsrerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    password = serializers.CharField(source='user.password', write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = UserProfile
        fields = ["username", "email", "phone", "bio", "image"]