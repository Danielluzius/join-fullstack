from rest_framework import serializers
from contacts.models import Contact


class ContactSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    class Meta:
        model = Contact
        fields = [
            'id', 'email', 'firstname', 'lastname', 'phone',
            'createdAt', 'updatedAt'
        ]
        read_only_fields = ['id', 'createdAt', 'updatedAt']
    
    def get_id(self, obj):
        """Return ID as string for frontend compatibility"""
        return str(obj.id) if obj.id else None