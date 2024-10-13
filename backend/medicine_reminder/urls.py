from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from medicine_reminder import views

urlpatterns = [
    path('test/', views.Test.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)