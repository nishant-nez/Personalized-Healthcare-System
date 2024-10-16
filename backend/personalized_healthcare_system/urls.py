from django.contrib import admin
from django.urls import path, include, re_path
from personalized_healthcare_system.settings.base import MEDIA_ROOT, MEDIA_URL
from django.conf.urls.static import static
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/schema/', SpectacularAPIView.as_view(), name="schema"),
    path('api/schema/docs/', SpectacularSwaggerView.as_view(url_name="schema")),
    path('api/auth/', include('djoser.social.urls')),
    path('api/auth/user/', include('accounts.urls')),
    # Blogs
    path('api/blogs/', include('blogs.urls')),
    # Disease
    path('api/diseases/', include('diseases.urls')),
    # Hospitals
    path('api/hospitals/', include('hospitals.urls')),
    # Medicine Reminder
    path('api/medicine-reminder/', include('medicine_reminder.urls')),
] + static(MEDIA_URL, document_root=MEDIA_ROOT)

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]