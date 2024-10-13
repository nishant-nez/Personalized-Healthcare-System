from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from personalized_healthcare_system.settings import base 

@shared_task(bind=True)
def sendmail(self, *args, **kwargs):
    # operations
    for i in range(10):
        print(i)
    print(args)
    print(kwargs)
    # timezone.localtime(users.date_time) + timedelta(days=2)
    mail_subject = "Celery Testing"
    message = "testing email contents for celery"
    to = ""
    send_mail(
        subject=mail_subject, 
        message=message, 
        from_email=base.EMAIL_HOST_USER,
        recipient_list=[to],
        fail_silently=False,
    )
    return "Sent"