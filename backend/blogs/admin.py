from django.contrib import admin
from .models import Blog, Category, Like, Comment
from unfold.admin import ModelAdmin

# admin.site.register([Blog, Category, Like, Comment])


@admin.register(Blog)
class BlogAdmin(ModelAdmin):
    pass

@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    pass

@admin.register(Like)
class LikeAdmin(ModelAdmin):
    pass

@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    pass


