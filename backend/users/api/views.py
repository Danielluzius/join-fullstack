"""
API views for user authentication.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from contacts.models import Contact

User = get_user_model()


def _create_contact_from_user(user):
    """Create a contact entry for a newly registered user."""
    name_parts = user.name.split(' ', 1) if user.name else ['', '']
    firstname = name_parts[0]
    lastname = name_parts[1] if len(name_parts) > 1 else ''
    
    Contact.objects.get_or_create(
        email=user.email,
        defaults={'firstname': firstname, 'lastname': lastname, 'phone': ''}
    )


def _prepare_user_response(user, token):
    """Prepare user data with token for response."""
    user_data = UserSerializer(user).data
    user_data['createdAt'] = user.date_joined
    return {'user': user_data, 'token': token.key}


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user and create a contact entry.
    
    POST /api/auth/register/
    {
        "email": "john@example.com",
        "name": "John Doe",
        "password": "securepass123",
        "confirm_password": "securepass123",
        "accept_privacy_policy": true
    }
    """
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    _create_contact_from_user(user)
    
    response_data = _prepare_user_response(user, token)
    return Response(response_data, status=status.HTTP_201_CREATED)


def _authenticate_user(request, email, password):
    """Authenticate user and return token with user data."""
    user = authenticate(request, username=email, password=password)
    if not user:
        return None
    
    token, _ = Token.objects.get_or_create(user=user)
    return _prepare_user_response(user, token)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login a user and return auth token.
    
    POST /api/auth/login/
    {
        "email": "john@example.com",
        "password": "securepass123"
    }
    """
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    response_data = _authenticate_user(request, email, password)
    
    if response_data:
        return Response(response_data)
    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([AllowAny])
def guest_login_view(request):
    """Guest login - creates guest user if not exists and logs in."""
    guest_email = 'guest@join.com'
    guest_password = 'guest123'
    
    try:
        user = User.objects.get(email=guest_email)
        if not user.has_usable_password():
            user.set_password(guest_password)
            user.save()
    except User.DoesNotExist:
        user = User.objects.create_user(
            username='guest',
            email=guest_email,
            password=guest_password,
            name='Guest User',
            is_active=True,
        )
    
    _create_contact_from_user(user)
    
    token, _ = Token.objects.get_or_create(user=user)
    response_data = _prepare_user_response(user, token)
    return Response(response_data)


@api_view(['POST'])
def logout_view(request):
    """
    Logout a user by deleting their auth token.
    
    POST /api/auth/logout/
    """
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out.'})
    return Response({'error': 'Not authenticated.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def current_user_view(request):
    """
    Get current authenticated user details.
    
    GET /api/auth/me/
    """
    user_data = UserSerializer(request.user).data
    user_data['createdAt'] = request.user.date_joined
    return Response(user_data)
