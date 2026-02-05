from django.contrib import admin
from .models import Task, Subtask


class SubtaskInline(admin.TabularInline):
    """Inline admin for subtasks within task admin."""
    model = Subtask
    extra = 1
    fields = ['title', 'completed', 'order']
    ordering = ['order']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Admin interface for Task model."""
    list_display = ['title', 'status', 'priority', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'created_at']
    search_fields = ['title', 'description', 'category']
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['assigned_to']
    inlines = [SubtaskInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category')
        }),
        ('Scheduling', {
            'fields': ('due_date', 'priority', 'status', 'order')
        }),
        ('Assignment', {
            'fields': ('assigned_to',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset with prefetch_related."""
        qs = super().get_queryset(request)
        return qs.prefetch_related('assigned_to', 'subtasks')


@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    """Admin interface for Subtask model."""
    list_display = ['title', 'task', 'completed', 'order']
    list_filter = ['completed']
    search_fields = ['title', 'task__title']
    list_editable = ['completed', 'order']
    
    def get_queryset(self, request):
        """Optimize queryset with select_related."""
        qs = super().get_queryset(request)
        return qs.select_related('task')
