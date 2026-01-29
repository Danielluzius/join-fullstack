from django.urls import path
from .views import register, login, logout, current_user

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/me/', current_user, name='current-user'),
]