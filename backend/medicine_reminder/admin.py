from django.contrib import admin
from .models import Reminder, ReminderHistory

admin.site.register([Reminder, ReminderHistory])