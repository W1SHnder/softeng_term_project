from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import *
from .views import *
from django.conf import settings
from datetime import datetime


class ShowroomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showroom
        fields = ['id', 'name', 'seats', 'showtimes']

class ShowtimeSerializer(serializers.ModelSerializer):
    showroom = serializers.PrimaryKeyRelatedField(queryset=Showroom.objects.all())
    class Meta:
        model = Showtime
        fields = ['id', 'showroom', 'time']
        read_only_fields = ['showroom']


class MovieSerializer(serializers.ModelSerializer):
    #showtimes = ShowtimeSerializer(many=True, read_only=True)
    showtimes = serializers.SerializerMethodField() 
    class Meta:
        model = Movie
        fields = ['id', 'title', 'category', 'director', 'producer', 'cast', 
                'synopsis', 'trailer_picture', 'trailer_video', 'mpaa_rating', 'showtimes']
        read_only_fields = ['showtimes']
    
    def get_showtimes(self, instance):
        query_date = self.context.get('date')
        #if request:
            #query_date = datetime.strptime(request.query_params.get('date'), '%Y-%m-%d')
        if query_date:
            inst_showtimes = instance.showtime_set.filter(time__date=query_date)
        else:
            inst_showtimes = instance.showtime_set.all()
        return ShowtimeSerializer(inst_showtimes, many=True).data

    #def to_representation(self, instance):
       # ret = super().to_representation(instance)
       # query_date = self.context.get('date')
       # inst_showtimes = instance.showtime_set.all()
        #if query_date:
        #    inst_showtimes = inst_showtimes.filter(time__date=query_date)
       # ret['showtimes'] = ShowtimeSerializer(inst_showtimes, many=True).data
        #return ret
        


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
    
    def validate_seat_num(self, value):
        if not (1 <= value <= self.showtime.showroom.seats):
            raise serializers.ValidationError("Seat number out of range")
        return value

    def validate(self, data):
        showtime = data['showtime']
        if showtime.time < datetime.now():
            raise serializers.ValidationError("Cannot create tickets for past showtimes")
        
        current_ticket_count = Ticket.objects.filter(showtime=showtime).count()
        if current_ticket_count >= showtime.showroom.seats:
            raise serializers.ValidationError("Showtime is sold out")

        return data


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
        fields = ['id', 'booking', 'promotion', 'completed', 'price_total']

    def get_price_total(self, obj):
        total = 0
        for ticket in obj.booking.tickets:
            total += ticket.price
        if obj.promotion:
            total *= (1 - obj.promotion.discount)
        return total

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['id', 'code', 'discount', 'expiration_date']


