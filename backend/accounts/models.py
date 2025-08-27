from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_company = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.username