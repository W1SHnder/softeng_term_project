from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import *
from .views import *
from django.conf import settings


class ShowroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showroom
        fields = ['url', 'id', 'name', 'seats', 'showtimes']

class ShowtimeSerializer(serializers.ModelSerializer):
    showroom = ShowroomSerializer(read_only=True)
    class Meta:
        model = Showtime
        fields = ['url', 'id', 'showroom', 'start', 'end']
        read_only_fields = ['showroom']


class MovieSerializer(serializers.ModelSerializer):
    showtimes = ShowtimeSerializer(many=True, read_only=True)
    class Meta:
        model = Movie
        fields = ['id', 'title', 'category', 'director', 'producer', 'cast', 
                'synopsis', 'trailer_picture', 'trailer_video', 'mpaa_rating']
        read_only_fields = ['showtimes']


class PaymentCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCard
        fields = ['id', 'user', 'card_type', 'card_number', 'expiration_date', 'address1', 'address2', 'city', 'state', 'zipcode']
        read_only_fields = ['user']


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ['id', 'user', 'address1', 'address2', 'city', 'state', 'zipcode']
        read_only_fields = ['user']

class UserSerializer(serializers.ModelSerializer):
    payment_cards = PaymentCardSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 'promotions', 'payment_cards', 'shipping_address']
        read_only_fields = ['email']
 

class TicketSerializer(serializers.ModelSerializer):
    showtime = ShowtimeSerializer(read_only=True)
    movie_name = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    type_name = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ['id', 'movie_name', 'seat_num', 'type_name', 'price', 'showtime']
        read_only_fields = ['showtime']

    def get_movie_name(self, obj):
        return obj.showtime.movie.title

    def get_type_name(self, obj):
        return obj.type.name

    def get_price(self, obj):
        base_price = obj.showtime.movie.ticket_price
        price_mod = self.type.price_mod
        return base_price * price_mod


class BookingSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True, read_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'showtime', 'user', 'tickets']
        read_only_fields = ['user']


class OrderSerializer(serializers.ModelSerializer):
    price_total = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = ['id', 'booking', 'completed', 'price_total']

    def get_price_total(self, obj):
        total = 0
        for ticket in obj.booking.tickets:
            total += ticket.price
        return total
