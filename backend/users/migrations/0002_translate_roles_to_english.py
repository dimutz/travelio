from django.db import migrations, models


def translate_roles_forward(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.filter(role="proprietar").update(role="owner")
    User.objects.filter(role="receptioner").update(role="receptionist")


def translate_roles_backward(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.filter(role="owner").update(role="proprietar")
    User.objects.filter(role="receptionist").update(role="receptioner")


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(translate_roles_forward, translate_roles_backward),
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("admin", "Admin"),
                    ("client", "Client"),
                    ("owner", "Owner"),
                    ("receptionist", "Receptionist"),
                ],
                default="client",
                max_length=20,
            ),
        ),
    ]
