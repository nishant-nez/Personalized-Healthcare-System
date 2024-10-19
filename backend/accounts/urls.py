from django.urls import path
from .views import UpdateProfileImageView, UpdateName

urlpatterns = [
    path('update-profile-image/<int:user_id>/', UpdateProfileImageView.as_view(), name='update-profile-image'),
    path('update-name/', UpdateName.as_view()),
]