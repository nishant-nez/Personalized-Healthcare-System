from django.contrib import admin
from .models import DiseaseHistory
from unfold.admin import ModelAdmin

# admin.site.register(DiseaseHistory)

@admin.register(DiseaseHistory)
class DiseaseHistoryAdmin(ModelAdmin):
    pass