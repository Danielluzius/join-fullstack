"""
Custom User model for authentication.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model that extends Django's AbstractUser.
    Uses email as the primary identifier for authentication.
    """
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        """Auto-populate name from first_name and last_name if not provided."""
        if not self.name and (self.first_name or self.last_name):
            self.name = f"{self.first_name} {self.last_name}".strip()
        super().save(*args, **kwargs)
