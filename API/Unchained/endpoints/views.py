import random

from rest_framework import generics, renderers, viewsets
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
# Create your views here. 
        

class MovieViewSet(viewsets.ModelViewSet):
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


class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.all()
    serializer_class = ShowtimeSerializer 


class ShowroomViewSet(viewsets.ModelViewSet):
    queryset = Showroom.objects.all()
    serializer_class = ShowroomSerializer



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

    if fname and lname and phone and email and pword and reg_code:
        real_code = RegistrationCode.objects.filter(email=email, code=reg_code)
        if not real_code.exists():
            return Response({'message': 'Invalid registration code'}, status=400)
        real_code.delete()
        new_user = user_class.objects.create_user(email=email, password=pword, first_name=fname, last_name=lname, phone=phone)
        new_user.save()
