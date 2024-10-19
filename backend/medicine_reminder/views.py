from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import mixins, generics, permissions
from rest_framework import status
from rest_framework.views import APIView
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from .models import Reminder, ReminderHistory
from datetime import datetime, timedelta
from .serializers import ReminderSerializer, ReminderHistorySerializer
import json
from django.utils import timezone
import pytz


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
        end_date = data.get('end_date', None)
        interval_value = data.get('interval_value', None)
        interval_type = data.get('interval_type', None)
        day_of_week = data.get('day_of_week', None)

        # Format reminder message for the email
        subject = f"Medicine Reminder for {medicine_name}"
        message = f"Hello,\n\nThis is a reminder to take {medicine_name} ({dosage}) as per the instructions: {instructions}.\n\nPersonalized Healthcare System."

        # Prepare the schedule based on the reminder type
        try:
            hour, minute = map(int, reminder_time.split(':'))
        except ValueError:
            return Response({"error": "Invalid reminder_time format. It should be HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

        if not reminder_type:
            return Response({"error": "Reminder type is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        schedule = None

        if reminder_type == 'daily':
            # Daily reminder
            schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=hour)

        elif reminder_type == 'weekly':
            # Weekly reminder (with day_of_week)
            schedule, created = CrontabSchedule.objects.get_or_create(minute=minute, hour=hour, day_of_week=day_of_week)

        elif reminder_type == 'interval':
            # Interval reminder (e.g., every X hours or days)
            if interval_type == 'minutes':
                # Every X minutes
                schedule, created = CrontabSchedule.objects.get_or_create(minute=f'*/{interval_value}')
            elif interval_type == 'hours':
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
            args=json.dumps([user_email, subject, message, request.user.id, medicine_name, reminder_type, interval_type, interval_value]),  # Send email reminder
        )

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
        reminder.save()

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


class ReminderHistoryView(APIView):
    """
    API endpoint to retrieve the history of reminders sent
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            reminders_history = ReminderHistory.objects.all()
        else:
            reminders_history = ReminderHistory.objects.filter(reminder__user=request.user)
        serializer = ReminderHistorySerializer(reminders_history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReminderHistoryStats(APIView):
    """
    API endpoint to retrieve the statistics of reminders sent
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            reminders_history = ReminderHistory.objects.all()
        else:
            reminders_history = ReminderHistory.objects.filter(reminder__user=request.user)

        total_reminders = reminders_history.count()
        oldest_history_date = reminders_history.order_by("-timestamp").first().timestamp.strftime("%b %Y")
        newest_history_date = reminders_history.order_by("timestamp").first().timestamp.strftime("%b %Y")
        reminders_taken = reminders_history.filter(is_taken=True).count()
        reminders_missed = reminders_history.filter(is_taken=False).count()
        # Define the timezone
        kathmandu_tz = pytz.timezone('Asia/Kathmandu')

        # Calculate reminders in the last day using the specified timezone
        reminders_last_day = reminders_history.filter(timestamp__gte=datetime.now(tz=kathmandu_tz) - timedelta(days=1)).count()

        # Reminder success, missed and total counts for each month
        reminder_stats = []
        stats_dict = {}
        for reminder in reminders_history:
            month_year = reminder.timestamp.strftime("%b %Y")
            if month_year not in stats_dict:
                stats_dict[month_year] = {
                    "total": 0,
                    "taken": 0,
                    "missed": 0,
                }
            stats_dict[month_year]["total"] += 1
            if reminder.is_taken:
                stats_dict[month_year]["taken"] += 1
            else:
                stats_dict[month_year]["missed"] += 1

        for month_year, stats in stats_dict.items():
            reminder_stats.append({
            "month_year": month_year,
            "total": stats["total"],
            "taken": stats["taken"],
            "missed": stats["missed"]
            })

        stats = {
            "total_reminders": total_reminders,
            "reminders_taken": reminders_taken,
            "reminders_missed": reminders_missed,
            "reminders_last_day": reminders_last_day,
            "oldest": oldest_history_date,
            "newest": newest_history_date,
            "by_month": reminder_stats,
        }

        return Response(stats, status=status.HTTP_200_OK)


class ReminderHistoryOneDay(APIView):
    """
    API endpoint to retrieve the history of reminders sent for the last 24 hours
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.is_staff:
            reminders_history = ReminderHistory.objects.filter(timestamp__gte=datetime.now() - timedelta(days=1))
        else:
            reminders_history = ReminderHistory.objects.filter(reminder__user=request.user, timestamp__gte=datetime.now() - timedelta(days=1))
        serializer = ReminderHistorySerializer(reminders_history, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReminderHistoryUpdateStatus(APIView):
    """
    API endpoint to update the status of a reminder history entry
    """

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, id):
        try:
            reminder_history = ReminderHistory.objects.get(id=id)
            new_status = request.data.get('status')
            reminder_history.is_taken = new_status
            reminder_history.save()
            return Response({"message": "Reminder history status updated successfully."}, status=status.HTTP_200_OK)
        except ReminderHistory.DoesNotExist:
            return Response({"detail": "Reminder history not found."}, status=status.HTTP_404_NOT_FOUND)


class ReminderHistoryDetail(APIView):
    """
    API endpoint to retrieve a specific reminder history entry
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        try:
            reminder_history = ReminderHistory.objects.get(id=id)
            serializer = ReminderHistorySerializer(reminder_history)
            if request.user.is_staff or request.user.id == reminder_history.reminder.user.id:
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"detail": "You do not have permission to access this reminder history."}, status=status.HTTP_403_FORBIDDEN)
        except ReminderHistory.DoesNotExist:
            return Response({"detail": "Reminder history not found."}, status=status.HTTP_404_NOT_FOUND)