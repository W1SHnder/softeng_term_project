# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
# Feel free to rename the models, but don't rename db_table values or field names.

from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings

class UserManager(BaseUserManager):
    user_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not password:
            raise ValueError('The Password field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        return self._create_user(email, password, **extra_fields)

    def create_staff(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        return self._create_user(email, password, **extra_fields)



class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    phone = models.CharField(_('phone number'), max_length=16, blank=True)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    promotions = models.BooleanField(_('promotions'), default=False)
    is_active = models.BooleanField(_('active'), default=True)
    is_staff = models.BooleanField(_('staff'), default=False)
    promotions_opt_in = models.BooleanField(_('promotions_opt_in'), default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name


class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING)
    showtime = models.ForeignKey('Showtime', models.DO_NOTHING)
    transaction = models.ForeignKey('Transaction', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'Booking'


class Movie(models.Model):
    title = models.CharField(max_length=255, blank=True, null=False, unique=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    director = models.CharField(max_length=255, blank=True, null=True)
    producer = models.CharField(max_length=255, blank=True, null=True)
    cast = models.TextField(blank=True, null=True)
    duration = models.DurationField(default=timedelta(hours=0, minutes=0), null=False)
    synopsis = models.TextField(blank=True, null=True) 
    trailer_picture = models.CharField(max_length=255, blank=True, null=False)
    trailer_video = models.CharField(max_length=255, blank=True, null=False)
    mpaa_rating = models.CharField(max_length=8, blank=True, null=True)
    ticket_price = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'Movie'


class Reveiw(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING) #May need to add cascade on delete??
    movie = models.ForeignKey(Movie, models.DO_NOTHING)
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    review = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Review'


class PaymentCard(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE, blank=True, null=True)
    card_type = models.CharField(max_length=32, blank=True, null=True)
    card_number = models.CharField(max_length=256, blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    address1 = models.TextField(blank=True, null=True)
    address2 = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=32, blank=True, null=True)

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
    time = models.DateTimeField(blank=True, null=True)  

    class Meta:
        db_table = 'Showtime'


class Theatre(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:    
        db_table = 'Theatre'

class TicketType(models.Model):
    type_name = models.CharField(max_length=6, blank=False, null=False)
    price_modifier = models.DecimalField(max_digits=5, decimal_places=2, blank=False, null=False)

    class Meta:
        db_table = 'TicketType'

class Ticket(models.Model):
    type = models.ForeignKey(TicketType, models.CASCADE) 
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


class VerificationCode(models.Model):
    email = models.CharField(max_length=64)
    code = models.CharField(max_length=8)
    
    class Meta:
        db_table = 'RegistrationCodes'


class ShippingAddress(models.Model):
    address1 = models.TextField(blank=True, null=True)
    address2 = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    state = models.CharField(max_length=255, blank=True, null=True)
    zipcode = models.CharField(max_length=32, blank=True, null=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, models.CASCADE)

    class Meta:
        db_table = 'ShippingAddress'


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE)
    booking = models.ForeignKey(Booking, models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        db_table = 'Order'
