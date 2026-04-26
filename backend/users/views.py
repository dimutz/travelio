from django.shortcuts import render
from rest_framework.permissions import IsAdminUser

class UserListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
