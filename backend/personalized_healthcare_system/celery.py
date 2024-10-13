from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from django.conf import settings
from celery.schedules import crontab
from personalized_healthcare_system.settings import base

if base.DEBUG:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personalized_healthcare_system.settings.local')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personalized_healthcare_system.settings.production]')


app = Celery('personalized_healthcare_system')
app.conf.enable_utc = False
app.conf.update(timezone='Asia/Kathmandu')
app.config_from_object(settings, namespace='CELERY')

# Celery Beat Settings
app.conf.beat_schedule = {
    'send-mail-everyday-at-8': {
        'task': 'medicine_reminder.tasks.sendmail',
        'schedule': crontab(hour=20, minute=50),
        #'args': (2,)
    }
}

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')