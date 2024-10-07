from django.db import models
from accounts.models import UserAccount


class DiseaseHistory(models.Model):
    name = models.CharField(max_length=255)
    symptoms = models.TextField()
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
