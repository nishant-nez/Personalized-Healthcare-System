from django.contrib import admin
from .models import Blog, Category, Like, Comment

admin.site.register([Blog, Category, Like, Comment])
