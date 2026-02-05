from rest_framework import viewsets, permissions, filters
from contacts.models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact model.
    Provides CRUD operations for shared contacts.
    All authenticated users can access and manage contacts.
    
    Supports:
    - Searching across firstname, lastname, email, phone
    - Ordering by any field
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['firstname', 'lastname', 'email', 'phone']
    ordering_fields = '__all__'
    ordering = ['firstname', 'lastname']
