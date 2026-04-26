from django.urls import path
from .views import PropertyListCreateView

urlpatterns = [
    path('properties/', PropertyListCreateView.as_view(), name='property-list-create'),
]
