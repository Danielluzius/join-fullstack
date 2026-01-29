from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from tasks.models import Task, Subtask
from .serializers import TaskSerializer, SubtaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint for tasks.
    Provides: list, create, retrieve, update, destroy
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return tasks based on is_private flag"""
        user = self.request.user
        # Public tasks + user's private tasks
        return Task.objects.filter(
            Q(is_private=False) | Q(owner=user)
        ).order_by('order', '-created_at')
    
    def perform_create(self, serializer):
        """Set the owner to the current user when creating a task"""
        serializer.save(owner=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def toggle_subtask(self, request, pk=None):
        """Toggle a subtask's completed status"""
        task = self.get_object()
        subtask_id = request.data.get('subtask_id')
        
        try:
            subtask = task.subtasks.get(id=subtask_id)
            subtask.completed = not subtask.completed
            subtask.save()
            return Response({'status': 'subtask toggled'})
        except Subtask.DoesNotExist:
            return Response(
                {'error': 'Subtask not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )


class SubtaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint for subtasks.
    """
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]