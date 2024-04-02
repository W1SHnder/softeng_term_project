# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta



class BillingAddress(models.Model):
    address1 = models.TextField(blank=True, null=True)
    address2 = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        db_table = 'BillingAddress'


class Booking(models.Model):
    user = models.ForeignKey('auth.User', models.DO_NOTHING)
    showtime = models.ForeignKey('Showtime', models.DO_NOTHING)
    transaction = models.ForeignKey('Transaction', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'Booking'


class Movie(models.Model):
    title = models.CharField(max_length=255, blank=True, null=False)
    category = models.CharField(max_length=255, blank=True, null=True)
    director = models.CharField(max_length=255, blank=True, null=True)
    producer = models.CharField(max_length=255, blank=True, null=True)
    cast = models.TextField(blank=True, null=True)
    duration = models.DurationField(default=timedelta(hours=0, minutes=0), null=False)
    synopsis = models.TextField(blank=True, null=True) 
    trailer_picture = models.CharField(max_length=255, blank=True, null=False)
    trailer_video = models.CharField(max_length=255, blank=True, null=False)
    mpaa_rating = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        db_table = 'Movie'


class Reveiw(models.Model):
    user = models.ForeignKey('auth.User', models.DO_NOTHING) #May need to add cascade on delete??
    movie = models.ForeignKey(Movie, models.DO_NOTHING)
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    review = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Review'


class PaymentCard(models.Model):
    user = models.ForeignKey('auth.User', models.DO_NOTHING, blank=True, null=True)
    card_number = models.CharField(max_length=256, blank=True, null=True)
    billing_addr = models.ForeignKey(BillingAddress, models.DO_NOTHING, db_column='billing_addr', blank=True, null=True)

    class Meta:
        db_table = 'PaymentCard'


class Promotion(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    discount = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)

    class Meta:
        db_table = 'Promotion'


class Showroom(models.Model):
    seats = models.IntegerField(blank=True, null=True)
    theatre = models.ForeignKey('Theatre', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'Showroom'


class Showtime(models.Model):
    movie = models.ForeignKey(Movie, models.DO_NOTHING, blank=True, null=True)
    showroom = models.ForeignKey(Showroom, models.DO_NOTHING, blank=True, null=False)
    start = models.DateTimeField(blank=True, null=True)  
    end = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'Showtime'


class Theatre(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:    
        db_table = 'Theatre'


class Ticket(models.Model):
    type = models.CharField(max_length=6, blank=True, null=True)
    showtime = models.ForeignKey(Showtime, models.DO_NOTHING)
    seat_num = models.IntegerField(unique=True)
    booking = models.ForeignKey(Booking, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'Ticket'


class Transaction(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    promo = models.ForeignKey(Promotion, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'Transaction'


