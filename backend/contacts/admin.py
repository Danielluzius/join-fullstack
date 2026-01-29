from django.contrib import admin
from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['firstname', 'lastname', 'email', 'phone', 'created_at']
    search_fields = ['firstname', 'lastname', 'email']
    list_filter = ['created_at']
