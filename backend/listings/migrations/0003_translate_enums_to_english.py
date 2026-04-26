from django.db import migrations, models


def translate_listing_values_forward(apps, schema_editor):
    Property = apps.get_model("listings", "Property")
    Room = apps.get_model("listings", "Room")

    Property.objects.filter(property_type="apartament").update(property_type="apartment")
    Property.objects.filter(property_type="pensiune").update(property_type="guesthouse")

    Room.objects.filter(availability_status="disponibila").update(availability_status="available")
    Room.objects.filter(availability_status="indisponibila").update(availability_status="unavailable")
    Room.objects.filter(availability_status="mentenanta").update(availability_status="maintenance")


def translate_listing_values_backward(apps, schema_editor):
    Property = apps.get_model("listings", "Property")
    Room = apps.get_model("listings", "Room")

    Property.objects.filter(property_type="apartment").update(property_type="apartament")
    Property.objects.filter(property_type="guesthouse").update(property_type="pensiune")

    Room.objects.filter(availability_status="available").update(availability_status="disponibila")
    Room.objects.filter(availability_status="unavailable").update(availability_status="indisponibila")
    Room.objects.filter(availability_status="maintenance").update(availability_status="mentenanta")


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(translate_listing_values_forward, translate_listing_values_backward),
        migrations.AlterField(
            model_name="property",
            name="property_type",
            field=models.CharField(
                choices=[("hotel", "Hotel"), ("apartment", "Apartment"), ("guesthouse", "Guesthouse")],
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="room",
            name="availability_status",
            field=models.CharField(
                choices=[
                    ("available", "Available"),
                    ("unavailable", "Unavailable"),
                    ("maintenance", "Maintenance"),
                ],
                default="available",
                max_length=20,
            ),
        ),
    ]
