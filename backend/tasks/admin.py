from django.contrib import admin
from .models import Task, Subtask


class SubtaskInline(admin.TabularInline):
    model = Subtask
    extra = 1


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority', 'owner', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'is_private', 'created_at']
    search_fields = ['title', 'description']
    filter_horizontal = ['assigned_to']
    inlines = [SubtaskInline]


@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task', 'completed', 'created_at']
    list_filter = ['completed', 'created_at']
