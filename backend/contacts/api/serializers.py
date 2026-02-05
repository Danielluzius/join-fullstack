from rest_framework import serializers
from contacts.models import Contact


class ContactSerializer(serializers.ModelSerializer):
    """
    Serializer for Contact model.
    Handles serialization/deserialization of contact data.
    """
    class Meta:
        model = Contact
        fields = ['id', 'email', 'firstname', 'lastname', 'phone', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
