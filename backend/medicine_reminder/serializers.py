from rest_framework import serializers
from .models import Reminder, ReminderHistory
from accounts.models import UserAccount
from accounts.serializers import UserAccountSerializer


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = ['id', 'medicine_name', 'dosage', 'instructions', 'reminder_time', 'reminder_type', 'interval_value', 'interval_type', 'day_of_week', 'start_date', 'end_date', 'is_active']
        read_only_fields = fields  # All fields are read-only

    def to_representation(self, instance):
        """ Custom representation to format certain fields if needed (optional) """
        data = super().to_representation(instance)
        # Example: Format reminder_time or add custom fields
        data['reminder_time'] = instance.reminder_time.strftime("%H:%M")
        return data


class ReminderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReminderHistory
        fields = ['id', 'reminder', 'status', 'date_sent', 'message']