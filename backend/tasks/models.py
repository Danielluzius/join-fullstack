from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    """Task model - represents a task on the board"""

    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('inprogress', 'In Progress'),
        ('awaitfeedback', 'Await Feedback'),
        ('done', 'Done'),
    ]

    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='todo')
    order = models.IntegerField(default=0)

    assigned_to = models.ManyToManyField(User, related_name='assigned_tasks', blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_tasks')

    is_private = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.title} ({self.status})"


class Subtask(models.Model):
    """Subtask model - belongs to a Task"""

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        status = "✓" if self.completed else "○"
        return f"{status} {self.title}"
