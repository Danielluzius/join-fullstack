from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from users.models import BoardSettings


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name']
        read_only_fields = ['id', 'name']
    
    def get_id(self, obj):
        """Return ID as string for frontend compatibility"""
        return str(obj.id)
    
    def get_name(self, obj):
        """Return first_name or email as name"""
        return obj.first_name if obj.first_name else obj.email


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=64,
        max_length=64
    )
    name = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'name']
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value.lower()

    def create_user_instance(self, email, name, password_hash):
        """Create user instance with SHA-256 password"""
        user = User(
            username=email,
            email=email,
            first_name=name
        )
        user.password = f'sha256$${password_hash}'
        user.save()
        return user

    def create(self, validated_data):
        """Create new user with token"""
        email = validated_data['email']
        password_hash = validated_data['password']
        name = validated_data['name']

        user = self.create_user_instance(email, name, password_hash)
        Token.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        min_length=64,
        max_length=64
    )

class BoardSettingsSerializer(serializers.ModelSerializer):
    userId = serializers.SerializerMethodField()
    viewMode = serializers.CharField(source='view_mode')
    lastChanged = serializers.DateTimeField(
        source='last_changed',
        read_only=True
    )
    
    class Meta:
        model = BoardSettings
        fields = ['userId', 'viewMode', 'lastChanged']
        read_only_fields = ['userId', 'lastChanged']
    
    def get_userId(self, obj):
        """Return user ID as string"""
        return str(obj.user.id)
