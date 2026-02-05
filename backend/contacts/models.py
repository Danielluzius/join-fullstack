from django.db import models


class Contact(models.Model):
    """
    Contact model representing a shared contact entry.
    Contacts are accessible by all authenticated users.
    """
    email = models.EmailField(unique=True)
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['firstname', 'lastname']
        db_table = 'contacts'

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.email})"
