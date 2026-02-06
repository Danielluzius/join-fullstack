"""
URL configuration for user authentication API.
"""
from django.urls import path
from .views import register_view, login_view, logout_view, current_user_view, guest_login_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('guest-login/', guest_login_view, name='guest-login'),
    path('logout/', logout_view, name='logout'),
    path('me/', current_user_view, name='current-user'),
]
