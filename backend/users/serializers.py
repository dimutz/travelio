# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from listings.serializers import PropertySerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    # 'owned_properties' este numele relației (related_name în models.py) sau filtrăm manual
    properties = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'properties']

    def get_properties(self, obj):
        # Doar dacă user-ul este owner, returnăm proprietățile lui
        if obj.role == 'owner':
            properties = Property.objects.filter(owner=obj)
            return PropertySerializer(properties, many=True).data
        return []
    
# Acest serializer se ocupă de înregistrare
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'client')
        )
        return user

# Acest serializer se ocupă de Login (aici „injectăm” rolul în răspuns)
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Adăugăm câmpurile de care avem nevoie în React
        data['mesaj_test'] = "Salut, Django ma asculta!"
        data['username'] = self.user.username
        data['role'] = self.user.role 
        return data