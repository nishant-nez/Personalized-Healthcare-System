from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from personalized_healthcare_system.settings import base 
from dotenv import load_dotenv
from .models import ReminderHistory, Reminder
import os

load_dotenv()


@shared_task(bind=True)
def send_medicine_reminder(self, to, subject, message, user, medicine_name, reminder_type, interval_type, interval_value):
    try:
        send_mail(
            subject=subject, 
            message=message, 
            from_email=base.EMAIL_HOST_USER,
            recipient_list=[to, os.environ.get('ADMIN_EMAIL')],
            fail_silently=False,
        )

        reminder = Reminder.objects.get(
            user_id=user,
            medicine_name=medicine_name,
            reminder_type=reminder_type,
            interval_type=interval_type,
            interval_value=interval_value,
        )
        ReminderHistory.objects.create(reminder=reminder)
    except Exception as e:
        return "Error occured: " + str(e)
    return "Medicine reminder sent to " + to