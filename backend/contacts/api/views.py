from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from contacts.models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact model.
    Provides CRUD operations for shared contacts.
    All authenticated users can access and manage contacts.
    
    Supports:
    - Filtering by email, firstname, lastname
    - Searching across firstname, lastname, email, phone
    - Ordering by any field
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['email', 'firstname', 'lastname']
    search_fields = ['firstname', 'lastname', 'email', 'phone']
    ordering_fields = '__all__'
    ordering = ['firstname', 'lastname']
