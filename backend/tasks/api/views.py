"""
API views for Task management.
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from tasks.models import Task, Subtask
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task model.
    Provides CRUD operations for tasks.
    All authenticated users can access and manage tasks.
    
    Supports:
    - Filtering by status, priority
    - Searching across title, description, category
    - Ordering by any field
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description', 'category']
    ordering_fields = '__all__'
    ordering = ['order', '-created_at']
    
    def get_queryset(self):
        """
        Optimize queryset with prefetch_related for subtasks and assigned contacts.
        """
        return Task.objects.prefetch_related('subtasks', 'assigned_to').all()
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Custom action to update only the task status.
        
        PATCH /api/tasks/{id}/update_status/
        {
            "status": "done"
        }
        """
        task = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Task.STATUS_CHOICES):
            return Response(
                {'error': 'Invalid status'},
                status=400
            )
        
        task.status = new_status
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def toggle_subtask(self, request, pk=None):
        """
        Custom action to toggle a subtask's completed status.
        
        PATCH /api/tasks/{id}/toggle_subtask/
        {
            "subtask_id": 123
        }
        """
        task = self.get_object()
        subtask_id = request.data.get('subtask_id')
        
        try:
            subtask = task.subtasks.get(id=subtask_id)
            subtask.completed = not subtask.completed
            subtask.save()
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except Subtask.DoesNotExist:
            return Response(
                {'error': 'Subtask not found'},
                status=404
            )
