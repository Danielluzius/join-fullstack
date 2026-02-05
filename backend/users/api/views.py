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

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user.
    
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
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        user_data['createdAt'] = user.date_joined
        return Response({
            'user': user_data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Authenticate using email (USERNAME_FIELD)
        user = authenticate(request, username=email, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            user_data['createdAt'] = user.date_joined
            return Response({
                'user': user_data,
                'token': token.key
            })
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
