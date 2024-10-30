"""
URL configuration for WingCol project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from .views import *
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('allusers/', get_all_users),
    path('users/', get_user),
    path('users/client/', get_client), 
    path('users/client/create/', create_client),
    path('users/client/update/', update_client),
    path('users/client/delete/', delete_client),
    path('users/admin/', get_admin), 
    path('users/admin/create/', create_admin),
    path('users/admin/update/', update_admin),
    path('users/admin/delete/', delete_admin),
    path('login/', login),
    path('flight/create/', create_flight),
    path('flight/', get_all_flights),
	path('flight/get/', get_flight),
    path('api/token/', TokenObtainPairView.as_view(serializer_class=CustomTokenObtainPairSerializer), name='token_obtain_pair'),
    path('flight/search/', get_flights),
	path('flight/update/', update_flight),
	path('flight/delete/', delete_flight),
    path('card/create/', create_card),
	path('card/update/', update_card),
	path('card/delete/', delete_card),
	path('card/', get_card),
    path('password_reset/', include('django_rest_passwordreset.urls')),
]
