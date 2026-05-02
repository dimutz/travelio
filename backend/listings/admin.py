from django.contrib import admin
from .models import Property, Room, PropertyImage

admin.site.register(Property)
admin.site.register(Room)
admin.site.register(PropertyImage) # Aceasta este linia critică