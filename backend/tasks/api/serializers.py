from rest_framework import serializers
from tasks.models import Task, Subtask
from django.contrib.auth.models import User


class AssignedUserSerializer(serializers.ModelSerializer):
    """Lightweight user serializer for assigned_to field"""
    name = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name']
    
    def get_id(self, obj):
        """Return ID as string for frontend compatibility"""
        return str(obj.id)
    
    def get_name(self, obj):
        """Return first_name or email as name"""
        return obj.first_name if obj.first_name else obj.email


class SubtaskSerializer(serializers.ModelSerializer):
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'completed', 'order', 'createdAt']
        read_only_fields = ['id', 'createdAt']


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, required=False)
    ownerId = serializers.SerializerMethodField()
    assignedTo = serializers.SerializerMethodField()
    dueDate = serializers.DateTimeField(source='due_date')
    isPrivate = serializers.BooleanField(source='is_private', required=False)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    assigned_to_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'dueDate', 'priority',
            'category', 'status', 'order', 'assignedTo', 'assigned_to_ids',
            'ownerId', 'isPrivate', 'subtasks', 'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'ownerId', 'createdAt', 'updatedAt']
    
    def get_ownerId(self, obj):
        """Return owner ID as string"""
        return str(obj.owner.id) if obj.owner else None
    
    def get_assignedTo(self, obj):
        """Return assigned user IDs as string array"""
        return [str(user.id) for user in obj.assigned_to.all()]

    def set_assigned_users(self, task, assigned_ids):
        """Set assigned users for task"""
        if assigned_ids:
            task.assigned_to.set(assigned_ids)

    def create_subtasks(self, task, subtasks_data):
        """Create subtasks for a task"""
        for subtask_data in subtasks_data:
            Subtask.objects.create(task=task, **subtask_data)

    def create(self, validated_data):
        """Create task with nested subtasks"""
        subtasks_data = validated_data.pop('subtasks', [])
        assigned_to_ids = self.initial_data.get('assigned_to_ids', [])

        task = Task.objects.create(**validated_data)
        self.set_assigned_users(task, assigned_to_ids)
        self.create_subtasks(task, subtasks_data)

        return task

    def update_task_fields(self, instance, validated_data):
        """Update task basic fields"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

    def update_subtasks(self, instance, subtasks_data):
        """Update subtasks for a task"""
        instance.subtasks.all().delete()
        self.create_subtasks(instance, subtasks_data)

    def update(self, instance, validated_data):
        """Update task with nested subtasks"""
        subtasks_data = validated_data.pop('subtasks', None)
        assigned_to_ids = self.initial_data.get('assigned_to_ids', None)

        self.update_task_fields(instance, validated_data)
        self.set_assigned_users(instance, assigned_to_ids)

        if subtasks_data is not None:
            self.update_subtasks(instance, subtasks_data)

        return instance