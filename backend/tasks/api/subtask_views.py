from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from tasks.models import Task, Subtask
from .serializers import SubtaskSerializer


def check_task_permission(task, user):
    """Check if user has permission to access task"""
    if task.is_private and task.owner != user:
        return False
    return True


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subtask(request, task_id):
    """Create a subtask for a specific task"""
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(
            {'error': 'Task not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not check_task_permission(task, request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = SubtaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(task=task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_subtask(request, task_id, subtask_id):
    """Update a subtask (toggle completed or change title)"""
    try:
        task = Task.objects.get(id=task_id)
        subtask = task.subtasks.get(id=subtask_id)
    except (Task.DoesNotExist, Subtask.DoesNotExist):
        return Response(
            {'error': 'Task or Subtask not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not check_task_permission(task, request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = SubtaskSerializer(subtask, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_subtask(request, task_id, subtask_id):
    """Delete a subtask"""
    try:
        task = Task.objects.get(id=task_id)
        subtask = task.subtasks.get(id=subtask_id)
    except (Task.DoesNotExist, Subtask.DoesNotExist):
        return Response(
            {'error': 'Task or Subtask not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if not check_task_permission(task, request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    subtask.delete()
    return Response(
        {'message': 'Subtask deleted'},
        status=status.HTTP_204_NO_CONTENT
    )
