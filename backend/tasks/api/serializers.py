"""
Serializers for Task and Subtask models.
"""
from rest_framework import serializers
from tasks.models import Task, Subtask
from contacts.models import Contact


class SubtaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Subtask model.
    Converts numeric ID to string for frontend compatibility.
    """
    id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'completed', 'order']
        
    def to_representation(self, instance):
        """Convert id to string for frontend."""
        data = super().to_representation(instance)
        data['id'] = str(data['id'])
        return data


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer for Task model.
    Handles nested subtasks and contact assignments.
    """
    subtasks = SubtaskSerializer(many=True, required=False)
    assigned_to = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Contact.objects.all(),
        required=False
    )
    id = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'due_date', 'priority',
            'category', 'status', 'assigned_to', 'subtasks',
            'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def to_representation(self, instance):
        """
        Convert IDs to strings and format assigned_to as list of IDs.
        """
        data = super().to_representation(instance)
        data['id'] = str(data['id'])
        data['assigned_to'] = [str(contact.id) for contact in instance.assigned_to.all()]
        return data
    
    def create(self, validated_data):
        """
        Create task with nested subtasks.
        """
        subtasks_data = validated_data.pop('subtasks', [])
        assigned_to_data = validated_data.pop('assigned_to', [])
        
        task = Task.objects.create(**validated_data)
        task.assigned_to.set(assigned_to_data)
        
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)
        
        return task
    
    def _update_task_fields(self, instance, validated_data):
        """Update task fields."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
    
    def _update_task_subtasks(self, instance, subtasks_data):
        """Replace existing subtasks with new ones."""
        instance.subtasks.all().delete()
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=instance, **subtask_data)
    
    def update(self, instance, validated_data):
        """Update task and handle nested subtasks."""
        subtasks_data = validated_data.pop('subtasks', None)
        assigned_to_data = validated_data.pop('assigned_to', None)
        
        self._update_task_fields(instance, validated_data)
        
        if assigned_to_data is not None:
            instance.assigned_to.set(assigned_to_data)
        
        if subtasks_data is not None:
            self._update_task_subtasks(instance, subtasks_data)
        
        return instance
