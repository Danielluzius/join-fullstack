from django.urls import path
from .views import (
    register,
    login,
    logout,
    current_user,
    board_settings,
    guest_login,
    users_list
)

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/guest-login/', guest_login, name='guest-login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/me/', current_user, name='current-user'),
    path('board-settings/', board_settings, name='board-settings'),
    path('users/', users_list, name='users-list'),
]