from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from hospitals import views

urlpatterns = [
    path('nearby/', views.NearbyHospitals.as_view()),
    path('nearby/distance/', views.NearbyHospitalsWithDistance.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
