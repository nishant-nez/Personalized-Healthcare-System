from django.db import models
from accounts.models import UserAccount
from django.utils import timezone
from datetime import datetime
from django_celery_beat.models import PeriodicTask


class Reminder(models.Model):
    def upload_to(instance, filename):
        return 'medicine_reminders/{filename}'.format(filename=filename)
    
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)

    # Medicine details
    medicine_name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100, null=True, blank=True)
    instructions = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    reminder_type_choices = [
        ('interval', 'Interval-based'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
    ]
    reminder_type = models.CharField(max_length=10, choices=reminder_type_choices, default='interval')

    # Interval-based reminder details
    interval_value = models.PositiveIntegerField(null=True, blank=True)  # Only for interval-based reminders
    interval_type = models.CharField(max_length=10, choices=[
        ('minutes', 'Minutes'),
        ('hours', 'Hours'),
        ('days', 'Days'),
        ('weeks', 'Weeks'),
    ], null=True, blank=True)  # Only for interval-based reminders

    # Time and day-related fields
    reminder_time = models.TimeField()  # Time to send the reminder (for daily, weekly, or interval-based)
    day_of_week = models.CharField(max_length=20, null=True, blank=True)  # Comma-separated list of days (e.g., '1,5' for Monday and Friday)

    is_active = models.BooleanField(default=True)
    next_reminder = models.DateTimeField(null=True, blank=True)

    image = models.ImageField(upload_to=upload_to, default='medicine_reminders/default.png')  # Optional medicine image

    task = models.OneToOneField(PeriodicTask, on_delete=models.CASCADE, null=True, blank=True)


    def __str__(self):
        return f"Reminder for {self.medicine_name}"
    
    def save(self, *args, **kwargs):
        if not self.next_reminder:
            # Calculate initial next reminder based on reminder_time and start_date
            start_date_modified = datetime.strptime(self.start_date, '%Y-%m-%d').date()
            reminder_time_modified = datetime.strptime(self.reminder_time, '%H:%M').time()
            next_reminder_time = timezone.make_aware(timezone.datetime.combine(start_date_modified, reminder_time_modified))
            self.next_reminder = next_reminder_time
        super().save(*args, **kwargs)


class ReminderHistory(models.Model):
    reminder = models.ForeignKey(Reminder, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_taken = models.BooleanField(default=True)
    notes = models.TextField(null=True, blank=True)
