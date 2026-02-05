from django.db import models
from contacts.models import Contact


class Task(models.Model):
    """
    Task model representing a shared board task.
    All tasks are visible to all authenticated users.
    """
    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('inprogress', 'In Progress'),
        ('awaitfeedback', 'Await Feedback'),
        ('done', 'Done'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    assigned_to = models.ManyToManyField(Contact, related_name='assigned_tasks', blank=True)
    order = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', '-created_at']
        db_table = 'tasks'
    
    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class Subtask(models.Model):
    """
    Subtask model representing a sub-item of a task.
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order', 'id']
        db_table = 'subtasks'
    
    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"{status} {self.title}"
