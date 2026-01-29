from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from tasks.models import Task, Subtask
from .serializers import SubtaskSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subtask(request, task_id):
    """
    Create a subtask for a specific task
    POST /api/tasks/{task_id}/subtasks/
    Body: {"title": "Subtask title"}
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user has access to this task
    if task.is_private and task.owner != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = SubtaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_subtask(request, task_id, subtask_id):
    """
    Update a subtask (toggle completed or change title)
    PATCH /api/tasks/{task_id}/subtasks/{subtask_id}/
    Body: {"completed": true} or {"title": "New title"}
    """
    try:
        task = Task.objects.get(id=task_id)
        subtask = task.subtasks.get(id=subtask_id)
    except (Task.DoesNotExist, Subtask.DoesNotExist):
        return Response({'error': 'Task or Subtask not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    if task.is_private and task.owner != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = SubtaskSerializer(subtask, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_subtask(request, task_id, subtask_id):
    """
    Delete a subtask
    DELETE /api/tasks/{task_id}/subtasks/{subtask_id}/
    """
    try:
        task = Task.objects.get(id=task_id)
        subtask = task.subtasks.get(id=subtask_id)
    except (Task.DoesNotExist, Subtask.DoesNotExist):
        return Response({'error': 'Task or Subtask not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check permissions
    if task.is_private and task.owner != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    subtask.delete()
    return Response({'message': 'Subtask deleted'}, status=status.HTTP_204_NO_CONTENT)
