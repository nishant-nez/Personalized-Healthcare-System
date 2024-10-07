from rest_framework import serializers
from .models import DiseaseHistory
from accounts.models import UserAccount
from accounts.serializers import UserAccountSerializer


class DiseaseHistorySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    symptoms = serializers.CharField()
    user = serializers.PrimaryKeyRelatedField(queryset=UserAccount.objects.all(), required=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
        Create and return a new `History` instance, given the validated data.
        """
        user = validated_data.pop('user')

        history = DiseaseHistory.objects.create(user=user, **validated_data)
        return history
    
    def update(self, instance, validated_data):
        """
        Update and return an existing `History` instance, given the validated data.
        """
        user = validated_data.pop('user', None)

        if user:
            instance.user = user

        instance.name = validated_data.get('name', instance.name)
        instance.symptoms = validated_data.get('symptoms', instance.symptoms)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        """
        Convert the instance into a JSON-serializable format.
        """
        representation = super().to_representation(instance)

        # Convert user to full details for GET requests
        representation['user'] = UserAccountSerializer(instance.user).data

        return representation