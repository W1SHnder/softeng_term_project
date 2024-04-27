import random

from rest_framework import generics, renderers, viewsets, permissions
from datetime import datetime, timedelta
from django.shortcuts import render
from rest_framework.decorators import api_view, action
from rest_framework.views import APIView
from rest_framework.response import Response
from endpoints.models import *
from endpoints.serializers import *
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login


# Create your views here. 
        

class MovieViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticatedOrReadOnly]
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def list(self, request):
        queryset = Movie.objects.all()
        title = request.query_params.get('title', None)
        category = request.query_params.get('category', None)
        date = request.query_params.get('date', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if category:
            queryset = queryset.filter(category__icontains=category)
        
        serializer = self.serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data)
     
    @action(detail=True, methods=['get'])
    def showtimes(self, request, pk=None):
        showtimes = Showtime.objects.filter(movie_id=pk)
        serializer = ShowtimeSerializer(showtimes, many=True, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        permission_classes = [permissions.IsAdminUser]
        showtimes = request.data.pop('showtimes')
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        for showtime in showtimes:
            showtime['movie'] = serializer.data['id']
            showtime_serializer = ShowtimeSerializer(data=showtime)
            if showtime_serializer.is_valid():
                showtime_serializer.save()
            return Response(serializer.errors, status=400)
        return Response(serializer.errors, status=400)


class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer 


class ShowroomViewSet(viewsets.ModelViewSet):
    queryset = Showroom.objects.all()
    serializer_class = ShowroomSerializer


class UserViewSet(viewsets.ModelViewSet):
    customUser = get_user_model()
    queryset = customUser.objects.all()
    serializer_class = UserSerializer
    permisson_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(id=self.request.user.id)
        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request):
        permission_classes = [permissions.IsAuthenticated]
        queryset = request.user
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)

    def update(self, request):
        permission_classes = [permissions.IsAuthenticated]
        queryset = request.user
        serializer = self.serializer_class(queryset, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class UserAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        user = queryset.get(id=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)

    def update(self, request, pk=None):
        queryset = self.get_queryset()
        user = queryset.get(id=pk)
        serializer = self.serializer_class(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticatedOrReadOnly]
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset

@api_view(['GET'])
def now_playing(request):
    current_date = datetime.now().date()
    movies = Movie.objects.filter(id__in=Showtime.objects.filter(start__date=current_date)).distinct()
    #movies = Movie.objects.all() 
    if movies.exists():
        serializer = MovieSerializer(movies, many=True, context={'request': request})
        return Response(serializer.data)
    else:
        return Response({'message': 'No movies found'}, status=404)


@api_view(['GET'])
def coming_soon(request):
    today = datetime.now().date()
    yesterday = current_date - timedelta(days=1)

    movies = Movie.objects.filter(
            id__in=Showtime.objects.filter(date__gt=date.today()).values('movie_id')).exclude(
            id__in=Showtime.objects.filter(date__gt=date.today()).values('movie_id')).distinct()

    if movies.exists():
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)
    else:
        return Response({'message': 'No movies found'}, status=404)


@api_view(['GET'])
def reg_veri(request, email): 
    if email:
        reg_code = random.randint(100000, 999999)
        subject = 'Registration Verification'
        message = f'Your registration code is {reg_code}'
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [email], fail_silently=False)
            reg_code_obj = RegistrationCode(email=email, code=reg_code)
            reg_code_obj.save()
            return Response({'message': 'Registration code sent'}, status=200)
        except Exception as e:
            return Response({'message': 'Failed to send email', 'error': str(e)}, status=500) 
    else:
        return Response({'message': 'Email is required'}, status=400)


@api_view(['POST'])
def register_user(request):
    user_class = get_user_model()
    fname = request.data.get('first_name')
    lname = request.data.get('last_name')
    phone = request.data.get('phone')
    email = request.data.get('email')
    pword = request.data.get('password')
    reg_code = request.data.get('code')
    
    payment_cards = request.data.get('payment_cards')
    shipping_addr = request.data.get('shipping_address')

    if fname and lname and phone and email and pword and reg_code:
        # Validate registration code
        real_code = RegistrationCode.objects.filter(email=email, code=reg_code)
        if not real_code.exists():
            return Response({'message': 'Invalid registration code'}, status=400)
        real_code.delete()

        #Create new user instance
        new_user = user_class.objects.create_user(email=email, password=pword, first_name=fname, last_name=lname, phone=phone)
        new_user.save()

        #Add optional user fields [UNTESTED!!!!!!!]
        if payment_cards:
            for card in payment_cards:
                card_obj = PaymentCard(user=new_user, **card)
                card_obj.save()
        if shipping_addr:
            addr_obj = ShippingAddress(user=new_user, **shipping_addr)
            addr_obj.save()
        return Response({'message': 'User registered'}, status=201)
    else:
        return Response({'message': 'Missing required fields'}, status=400)



@api_view(['POST'])
def login_user(request):
    user_class = get_user_model()
    email = request.data.get('email')
    pword = request.data.get('password')
    long_session = request.data.get('long_session')
    user = authenticate(request, email=email, password=pword)
    if not user:
        return Response({'message': 'Invalid login credentials'}, status=400)
    login(request, user)
    if long_session:
        request.session.set_expiry(30*24*60*60)
    return Response({'message': 'Login successful'}, status=200)
