from django.contrib import admin
from .models import BoardSettings


@admin.register(BoardSettings)
class BoardSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'view_mode', 'last_changed']
    list_filter = ['view_mode']
    search_fields = ['user__username', 'user__email']

