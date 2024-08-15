from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from blogs import views

urlpatterns = [
    path('category/', views.CategoryList.as_view()),
    path('category/<int:pk>/', views.CategoryDetail.as_view()),
    path('', views.BlogList.as_view()),
    path('<int:pk>/', views.BlogDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)