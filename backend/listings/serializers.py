from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'name', 'address', 'city', 'country', 
            'description', 'property_type', 'rating_average', 
            'owner_username', 'images'
        ]
        read_only_fields = ['owner']