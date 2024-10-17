from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from medicine_reminder import views

urlpatterns = [
    path('', views.MedicineReminder.as_view()),
    path('<int:id>/', views.ReminderDetail.as_view()),
    path('history/', views.ReminderHistoryView.as_view()),
    path('history/<int:id>/', views.ReminderHistoryDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)