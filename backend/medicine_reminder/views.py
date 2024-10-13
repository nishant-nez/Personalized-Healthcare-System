from django.shortcuts import render
from .tasks import sendmail
from rest_framework.response import Response
from rest_framework.views import APIView
from django_celery_beat.models import PeriodicTask, CrontabSchedule
import json


class Test(APIView):
    def get(self, request):
        sendmail.delay(test=123)
        return Response("Mail Sent")


class CreateCeleryTask(APIView):
    def get(self, request):
        schedule, created = CrontabSchedule.objects.get_or_create(hour=1, minute=1)
        task = PeriodicTask.objects.create(
            crontab=schedule,
            name='Send Mail',
            task='medicine_reminder.tasks.sendmail',
            args=json.dumps((2, 3,)),
        )
        return Response("Schedule Added")