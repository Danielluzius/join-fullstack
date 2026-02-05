"""
Serializers for user authentication and registration.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'username', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    accept_privacy_policy = serializers.BooleanField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'confirm_password', 'accept_privacy_policy']
    
    def validate(self, data):
        """Validate that passwords match and privacy policy is accepted."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        
        if not data.get('accept_privacy_policy'):
            raise serializers.ValidationError({"accept_privacy_policy": "You must accept the privacy policy."})
        
        return data
    
    def _generate_unique_username(self, email):
        """Generate a unique username from email."""
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        return username
    
    def create(self, validated_data):
        """Create a new user with encrypted password."""
        validated_data.pop('confirm_password')
        validated_data.pop('accept_privacy_policy')
        
        email = validated_data['email']
        validated_data['username'] = self._generate_unique_username(email)
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
