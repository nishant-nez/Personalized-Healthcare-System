from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from blogs import views

urlpatterns = [
    # Blogs
    path('', views.BlogList.as_view()),
    path('<int:pk>/', views.BlogDetail.as_view()),
    path('except/<int:pk>/', views.BlogsExceptUser.as_view()),
    path('user/<int:pk>/', views.BlogsOfUser.as_view()),
    # Categories
    path('category/', views.CategoryList.as_view()),
    path('category/<int:pk>/', views.CategoryDetail.as_view()),
    # Likes
    path('like/all/', views.BlogLikeList.as_view()),
    path('like/<int:blog_id>/', views.BlogLike.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)