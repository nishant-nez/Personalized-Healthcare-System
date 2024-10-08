from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from diseases import views

urlpatterns = [
    path('predict/', views.PredictDisease.as_view()),
    path('history/<int:pk>/', views.DiseaseHistoryDetail.as_view()),
    path('history/all/', views.DiseaseList.as_view()),
    path('symptoms/', views.DiseaseSymptoms.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)