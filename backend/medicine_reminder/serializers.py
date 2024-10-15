from rest_framework import serializers
from .models import Reminder, ReminderHistory
from accounts.models import UserAccount
from accounts.serializers import UserAccountSerializer
from django_celery_beat.models import PeriodicTask


WEEKDAYS = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
}

class PeriodicTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodicTask
        fields = ['id', 'name', 'task', 'enabled', 'crontab']

class ReminderSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer(read_only=True)
    task = PeriodicTaskSerializer(read_only=True)

    class Meta:
        model = Reminder
        fields = [
            'id', 
            'medicine_name', 
            'dosage', 
            'instructions', 
            'reminder_time', 
            'reminder_type', 
            'interval_value', 
            'interval_type', 
            'day_of_week', 
            'start_date', 
            'end_date', 
            'is_active',
            'next_reminder',
            'image',
            'user', 
            'task',
        ]
        read_only_fields = fields

    def to_representation(self, instance):
        """ Custom representation to format certain fields if needed (optional) """
        data = super().to_representation(instance)
        # Format reminder_time
        data['reminder_time'] = instance.reminder_time.strftime("%H:%M")
        
        # Convert day_of_week into array of objects with day number and weekday
        if instance.day_of_week:
            day_of_week_list = [
                {"number": int(day), "weekday": WEEKDAYS[int(day)]} 
                for day in instance.day_of_week.split(',')
            ]
            data['day_of_week'] = day_of_week_list

        return data


class ReminderHistorySerializer(serializers.ModelSerializer):
    reminder = ReminderSerializer(read_only=True)

    class Meta:
        model = ReminderHistory
        fields = ['id', 'reminder', 'status', 'date_sent', 'message']
