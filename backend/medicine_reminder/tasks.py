from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from personalized_healthcare_system.settings import base 
from dotenv import load_dotenv
import os

load_dotenv()


@shared_task(bind=True)
def send_medicine_reminder(self, to, subject, message):
    send_mail(
        subject=subject, 
        message=message, 
        from_email=base.EMAIL_HOST_USER,
        recipient_list=[to, os.environ.get('ADMIN_EMAIL')],
        fail_silently=False,
    )
    return "Medicine reminder sent to " + to