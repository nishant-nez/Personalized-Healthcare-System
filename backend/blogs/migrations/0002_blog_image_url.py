# Generated by Django 5.1 on 2024-10-08 04:55

import blogs.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='image_url',
            field=models.ImageField(blank=True, null=True, upload_to=blogs.models.Blog.upload_to),
        ),
    ]
