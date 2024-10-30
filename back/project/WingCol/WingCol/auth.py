from rest_framework import authentication, permissions, exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import NormalUser

class ClientAuthentication(JWTAuthentication):
    def authenticate(self, request):
        user, _ = super().authenticate(request)
        if user is not None and user.roles == 1:
            return (user, None)
        raise exceptions.AuthenticationFailed('No Permissions Provided')

class AdminAuthentication(JWTAuthentication):
    def authenticate(self, request):
        user, _ = super().authenticate(request)
        if user is not None and user.roles == 2:
            return (user, None)
        raise exceptions.AuthenticationFailed('No Permissions Provided')

class RootAuthentication(JWTAuthentication):
    def authenticate(self, request):
        user, _ = super().authenticate(request)
        if user is not None and user.roles == 3:
            return (user, None)
        raise exceptions.AuthenticationFailed('No Permissions Provided')
