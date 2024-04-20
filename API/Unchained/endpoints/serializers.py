from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import *
from .views import *

#Figure out user serializer


class MovieSerializer(serializers.HyperlinkedModelSerializer):
    #showtimes = ShowtimesHyperlink(view_name='movie-showtimes', read_only=True)
    class Meta:
        model = Movie
        fields = [
                'url', 'id', 'title', 'category', 'director', 'producer', 'cast', 
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

