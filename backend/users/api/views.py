from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    BoardSettingsSerializer
)
from contacts.models import Contact
from users.models import BoardSettings
import hashlib


def create_guest_user_profile():
    """Create guest user in database"""
    guest_user = User.objects.create_user(
        username='guest',
        email='guest@join.com',
        first_name='Guest',
        last_name='User',
        password='guest_password_not_for_login'
    )
    Token.objects.create(user=guest_user)
    return guest_user


def create_guest_contact():
    """Create contact entry for guest user"""
    Contact.objects.create(
        email='guest@join.com',
        firstname='Guest',
        lastname='User',
        phone=''
    )


def get_or_create_guest_user():
    """Get or create the guest user"""
    try:
        return User.objects.get(username='guest')
    except User.DoesNotExist:
        guest_user = create_guest_user_profile()
        create_guest_contact()
        return guest_user


def create_auth_response(user):
    """Create authentication response with user data and token"""
    token, created = Token.objects.get_or_create(user=user)
    return Response({
        'user': UserSerializer(user).data,
        'token': token.key
    })


def create_user_contact(user):
    """Create contact entry for registered user"""
    Contact.objects.create(
        email=user.email,
        firstname=user.first_name or user.username,
        lastname='',
        phone=''
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user and return token"""
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    user = serializer.save()
    create_user_contact(user)
    return create_auth_response(user)


def verify_password_hash(user, password_hash):
    """Verify SHA-256 password hash matches stored hash"""
    stored_hash = user.password.replace('sha256$$', '')
    return stored_hash == password_hash


def get_invalid_credentials_response():
    """Return standard invalid credentials response"""
    return Response(
        {'error': 'Invalid email or password'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user with email and SHA-256 password hash"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    email = serializer.validated_data['email'].lower()
    password_hash = serializer.validated_data['password']

    try:
        user = User.objects.get(username=email)
        if verify_password_hash(user, password_hash):
            return create_auth_response(user)
        return get_invalid_credentials_response()
    except User.DoesNotExist:
        return get_invalid_credentials_response()


@api_view(['POST'])
@permission_classes([AllowAny])
def guest_login(request):
    """Login as guest user and return token"""
    guest_user = get_or_create_guest_user()
    return create_auth_response(guest_user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user by deleting token"""
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user info"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


def get_board_settings_response(settings):
    """Get board settings response"""
    serializer = BoardSettingsSerializer(settings)
    return Response(serializer.data)


def update_board_settings(settings, data):
    """Update board settings with new data"""
    serializer = BoardSettingsSerializer(
        settings,
        data=data,
        partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def board_settings(request):
    """Get or update board settings for current user"""
    settings, created = BoardSettings.objects.get_or_create(
        user=request.user
    )

    if request.method == 'GET':
        return get_board_settings_response(settings)

    return update_board_settings(settings, request.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    """Get all users for task assignment"""
    users = User.objects.all().order_by('first_name', 'username')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

