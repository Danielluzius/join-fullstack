from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from contacts.models import Contact
from .serializers import ContactSerializer


class ContactViewSet(viewsets.ModelViewSet):
    """
    API endpoint for contacts.
    Provides: list, create, retrieve, update, destroy
    """
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return all contacts ordered by name"""
        return Contact.objects.all().order_by('firstname', 'lastname')