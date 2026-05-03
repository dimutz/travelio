from rest_framework import serializers
from .models import Booking
from django.db.models import Q

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        property_id = data.get('property')
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        if data['number_of_guests'] > data['property'].capacity:
            raise serializers.ValidationError(
                f"Capacitatea maximă a acestei proprietăți este de {data['property'].capacity} persoane."
        )

        # Verificăm dacă există rezervări care se suprapun
        # Logica: (Start1 < End2) AND (End1 > Start2)
        overlapping_bookings = Booking.objects.filter(
            property=property_id,
            check_in__lt=check_out,
            check_out__gt=check_in
        ).exists()

        if overlapping_bookings:
            raise serializers.ValidationError(
                "Această proprietate este deja rezervată pentru perioada selectată."
            )
        
        return data