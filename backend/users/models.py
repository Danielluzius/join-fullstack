from django.db import models
from django.contrib.auth.models import User


class BoardSettings(models.Model):
    """Board settings for a user - controls view mode (public/private)"""
    
    VIEW_MODE_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='board_settings',
        primary_key=True
    )
    view_mode = models.CharField(
        max_length=10, 
        choices=VIEW_MODE_CHOICES, 
        default='public'
    )
    last_changed = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Board Settings"
    
    def __str__(self):
        return f"{self.user.username} - {self.view_mode}"