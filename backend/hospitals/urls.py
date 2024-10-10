from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from hospitals import views

urlpatterns = [
    path('', views.HospitalList.as_view()),
    path('nearest/', views.NearestHospital.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)