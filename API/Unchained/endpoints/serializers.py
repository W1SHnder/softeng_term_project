from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import *
from .views import *
from django.conf import settings

#Figure out user serializer


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'title', 'category', 'director', 'producer', 'cast', 
                'synopsis', 'trailer_picture', 'trailer_video', 'mpaa_rating']


class ShowtimeSerializer(serializers.HyperlinkedModelSerializer):
    movie = serializers.HyperlinkedRelatedField(view_name='movie-detail', read_only=True)
    showroom = serializers.HyperlinkedRelatedField(view_name='showroom-detail', read_only=True)

    class Meta:
        model = Showtime
        fields = ['url', 'id', 'movie', 'showroom', 'start', 'end']

class ShowroomSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = Showroom
        fields = ['url', 'id', 'name', 'seats', 'showtimes']


class UserSerializer(serializers.ModelSerializer):
    #add paymentcard field?
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone']
        read_only_fields = ['email']
 

class TicketSerializer(serializers.ModelSerializer):
    showtime = ShowtimeSerializer(read_only=True) 
    class Meta:
        model = Ticket
        fields = ['id', 'type', 'seat_num', 'showtime']

class BookingSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True, read_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'showtime', 'user', 'tickets']
        read_only_fields = ['user']

