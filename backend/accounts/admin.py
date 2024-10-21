from django.contrib import admin
from .models import UserAccount
from unfold.admin import ModelAdmin

@admin.register(UserAccount)
class UserAccountAdmin(ModelAdmin):
    pass
