from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, SubtaskViewSet
from .subtask_views import create_subtask, update_subtask, delete_subtask

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'subtasks', SubtaskViewSet, basename='subtask')

urlpatterns = [
    path('', include(router.urls)),
    path('tasks/<int:task_id>/subtasks/', create_subtask, name='create-subtask'),
    path('tasks/<int:task_id>/subtasks/<int:subtask_id>/', update_subtask, name='update-subtask'),
    path('tasks/<int:task_id>/subtasks/<int:subtask_id>/delete/', delete_subtask, name='delete-subtask'),
]