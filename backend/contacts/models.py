from django.db import models


class Contact(models.Model):
    """Contact model - represents a contact entry"""

    email = models.EmailField(max_length=255)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['firstname', 'lastname']

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.email})"

