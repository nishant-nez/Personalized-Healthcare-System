from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import mixins, generics, permissions
from rest_framework import status
from rest_framework.views import APIView
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from .models import Reminder
from datetime import datetime, timedelta
from .serializers import ReminderSerializer
import json


class MedicineReminder(APIView):
    """
    API endpoints to create new medicine reminder and to retrieve existing reminders
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            reminders = Reminder.objects.all()
        else:
            reminders = Reminder.objects.filter(user=request.user)
        serializer = ReminderSerializer(reminders, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        # Extract values from the request data
        user_email = request.user.email
        medicine_name = data.get('medicine_name')
        dosage = data.get('dosage', '')
        instructions = data.get('instructions', '')
        reminder_type = data.get('reminder_type')
        reminder_time = data.get('reminder_time')
        start_date = data.get('start_date')
        end_date = data.get('end_date', None)  # Can be null
        interval_value = data.get('interval_value', None)
        interval_type = data.get('interval_type', None)
        day_of_week = data.get('day_of_week', None)  # Can be null

        # Format reminder message for the email
        subject = f"Medicine Reminder for {medicine_name}"
        message = f"Hello,\n\nThis is a reminder to take {medicine_name} ({dosage}) as per the instructions: {instructions}.\n\nPersonalized Healthcare System."

        # Prepare the schedule based on the reminder type
        try:
            hour, minute = map(int, reminder_time.split(':'))
        except ValueError:
            return Response({"error": "Invalid reminder_time format. It should be HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

        if reminder_type == 'daily':
            # Daily reminder
            schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=hour)

        elif reminder_type == 'weekly':
            # Weekly reminder (with day_of_week)
            schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=hour, day_of_week=day_of_week)

        elif reminder_type == 'interval':
            # Interval reminder (e.g., every X hours or days)
            if interval_type == 'hours':
                # Create periodic tasks for intervals (e.g., every 8 hours)
                schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=f'*/{interval_value}')
            elif interval_type == 'days':
                # Every X days (use the day_of_month field)
                schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=hour, day_of_month=f'*/{interval_value}')
            elif interval_type == 'weeks':
                # Every X weeks (use the day_of_week field)
                schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=hour, day_of_week=f'*/{interval_value}')

        # Create the periodic task for the reminder
        task = PeriodicTask.objects.create(
            crontab=schedule,
            name=f'Reminder for {medicine_name} - {datetime.now()}',  # Unique name for the task
            task='medicine_reminder.tasks.send_medicine_reminder',
            args=json.dumps([user_email, subject, message]),  # Send email reminder
        )

        # Save the reminder details to the database (if needed)
        reminder = Reminder.objects.create(
            user=request.user,
            medicine_name=medicine_name,
            dosage=dosage,
            instructions=instructions,
            start_date=start_date,
            end_date=end_date,
            reminder_type=reminder_type,
            interval_value=interval_value,
            interval_type=interval_type,
            reminder_time=reminder_time,
            day_of_week=day_of_week,
            is_active=True,
            task=task,
        )

        return Response({"message": "Reminder and cronjob created successfully."})


class ReminderDetail(APIView):
    """
    API endpoint to retrieve, pause, resume, or delete a specific reminder
    """

    permission_classes = [permissions.IsAuthenticated]

    # def pause_reminder(self, reminder_id):
    #     reminder = Reminder.objects.get(id=reminder_id)
    #     reminder.task.enabled = False  # Disable the task
    #     reminder.is_active = False
    #     reminder.task.save()  # Save changes to the task
    #     reminder.save()  # Ensure the reminder state is also saved

    # def resume_reminder(self, reminder_id):
    #     reminder = Reminder.objects.get(id=reminder_id)
    #     reminder.task.enabled = True  # Enable the task
    #     reminder.is_active = True
    #     reminder.task.save()  # Save changes to the task
    #     reminder.save()  # Ensure the reminder state is also saved

    # def delete_reminder(self, reminder_id):
    #     reminder = Reminder.objects.get(id=reminder_id)
    #     reminder.task.delete()  # Delete the associated periodic task
    #     reminder.delete()  # Delete the reminder itself

    def get(self, request, id):
        try:
            reminder = Reminder.objects.get(id=id)
            serializer = ReminderSerializer(reminder, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Reminder.DoesNotExist:
            return Response({"detail": "Reminder not found."}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        try:
            reminder = Reminder.objects.get(id=id)
            action = request.data.get('action')

            if action == 'pause':
                # self.pause_reminder(reminder.id)
                # reminder = Reminder.objects.get(id=reminder_id)
                reminder.task.enabled = False  # Disable the task
                reminder.is_active = False
                reminder.task.save()  # Save changes to the task
                reminder.save()  # Ensure the reminder state is also saved
                return Response({"message": "Reminder paused."}, status=status.HTTP_200_OK)

            elif action == 'resume':
                # self.resume_reminder(reminder.id)
                reminder.task.enabled = True  # Enable the task
                reminder.is_active = True
                reminder.task.save()  # Save changes to the task
                reminder.save()  # Ensure the reminder state is also saved
                return Response({"message": "Reminder resumed."}, status=status.HTTP_200_OK)

            elif action == 'delete':
                # self.delete_reminder(reminder.id)
                reminder.task.delete()  # Delete the associated periodic task
                reminder.delete()  # Delete the reminder itself
                return Response({"message": "Reminder deleted."}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        except Reminder.DoesNotExist:
            return Response({"detail": "Reminder not found."}, status=status.HTTP_404_NOT_FOUND)
