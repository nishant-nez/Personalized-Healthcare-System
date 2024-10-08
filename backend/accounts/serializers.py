from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import UserAccount

User = get_user_model()

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'image', 'first_name', 'last_name']

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'image', 'first_name', 'last_name', 'password', 'is_superuser')

class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['image']