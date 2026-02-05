from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    """
    Admin interface for Contact model.
    """
    list_display = ['firstname', 'lastname', 'email', 'phone', 'created_at']
    list_filter = ['created_at']
    search_fields = ['firstname', 'lastname', 'email', 'phone']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['firstname', 'lastname']
