from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Property
from .serializers import PropertySerializer

class PropertyListCreateView(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    # permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_authenticated:
            raise PermissionDenied('You are not authenticated.')
        user = self.request.user
        if user.role != 'owner':
            raise PermissionDenied('Only owners can create properties.')
        serializer.save(owner=self.request.user)

class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    # Oricine poate vedea detaliile, dar numai proprietarul poate edita/șterge
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
