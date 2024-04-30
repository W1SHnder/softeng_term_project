from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

from endpoints import views

router = DefaultRouter()
router.register(r'Showroom', views.ShowroomViewSet)


movie_list = views.MovieViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

movie_detail = views.MovieViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

movie_showtimes = views.MovieViewSet.as_view({
    'get': 'showtimes'
})

showtime_list = views.ShowtimeViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

showtime_detail = views.ShowtimeViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

showroom_list = views.ShowroomViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

showroom_detail = views.ShowroomViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

user_list = views.UserViewSet.as_view({
    'get': 'list'
})

user_detail = views.UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update'
})

user_admin = views.UserAdminViewSet.as_view({
    'get': 'retrieve',
    'put': 'update'
})

urlpatterns = [
    path('NowPlaying/', views.now_playing),
    path('ComingSoon/', views.coming_soon),
    path('Movie/', movie_list, name='movie-list'),
    path('Movie/<int:pk>/', movie_detail, name='movie-detail'),
    path('Movie/<int:pk>/Showtimes/', movie_showtimes, name='movie-showtimes'),
    path('Showtime/', showtime_list, name='showtime-list'),
    path('Showtime/<int:pk>/', showtime_detail, name='showtime-detail'),
    path('Showroom/', showroom_list, name='showroom-list'),
    path('Showroom/<int:pk>/', showroom_detail, name='showroom-detail'),
    path('Verify/<str:email>', views.verify_email),
    path('Register/', views.register_user),
    path('Login/', views.login_user),
    path('Logout/', views.logout_user),
    path('User/', user_detail, name='user-detail'),
    path('UserList/', user_list, name='user-list'),
    path('ChangePassword/', views.change_password),
    path('RecoverPassword/', views.recover_password),
    path('UserAdmin/<int:pk>/', user_admin, name='user-admin')
]
 

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])


