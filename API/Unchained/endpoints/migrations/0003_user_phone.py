# Generated by Django 5.0.4 on 2024-04-19 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('endpoints', '0002_registrationcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone',
            field=models.CharField(blank=True, max_length=10, verbose_name='phone number'),
        ),
    ]