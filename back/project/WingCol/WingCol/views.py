from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
from .auth import ClientAuthentication, AdminAuthentication, RootAuthentication
from .models import *
from .serializers import *


@api_view(['GET'])
def get_all_users(request):
    users = NormalUser.objects.filter(activo=True)
    serializer = UserSerializer(users, many = True)
    return Response(serializer.data)

@api_view(['GET'])
def get_user(request):
    try:
        id = request.data["user_id"]
        user = NormalUser.objects.get(user_id=id, activo=True)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except NormalUser.DoesNotExist:
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def get_client(request):
    try:
        id = request.data["user_id"]
        user= NormalUser.objects.get(user_id=id, activo=True)
        user_serializer = UserSerializer(user, many=False)
        client = Cliente.objects.get(user_id=id, activo=True)
        client_serializer = ClientSerializer(client, many=False)
        combined_data = user_serializer.data.copy() 
        combined_data.update(client_serializer.data)
        return Response(combined_data, status=status.HTTP_200_OK)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no existente"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_client(request):
    request.data['roles'] = 1
    user_serializer = UserSerializer(data=request.data)
    if user_serializer.is_valid():
        new_user = user_serializer.save()
        client_data = request.data.copy()
        client_data['user_id'] = new_user.user_id
        client_serializer = ClientSerializer(data=client_data)
        if client_serializer.is_valid():
            client_serializer.save()
            token, created = Token.objects.get_or_create(user=new_user)
            return Response({
                "token": token.key,
                "user_data": client_serializer.data
            }, status=status.HTTP_201_CREATED)
        NormalUser.objects.get(user_id=new_user.user_id).delete()
        return Response(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def update_client(request):
    request.data['roles'] = 1
    try:
        user = NormalUser.objects.get(user_id=request.data['user_id'], activo = True)
        client = Cliente.objects.get(user_id=request.data['user_id'], activo = True)
        user_serializer = UserSerializer(user, data=request.data)
        client_serializer = ClientSerializer(client, data=request.data)
        user_serializer.is_valid()
        client_serializer.is_valid()
        if user_serializer.is_valid() and client_serializer.is_valid():
            user_serializer.save()
            client_serializer.save()
            return Response(client_serializer.data, status=status.HTTP_202_ACCEPTED)
        
        return Response({
            "user_errors": user_serializer.errors,
            "client_errors": client_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no existente"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def delete_client(request):
    try:
        id = request.data["user_id"]
        user = NormalUser.objects.get(user_id=id, activo = True)
        client = Cliente.objects.get(user_id=id, activo = True)
        
        user.soft_delete()
        client.soft_delete()

        return Response({"message": "Cliente borrado correctamente."}, status=status.HTTP_200_OK)

    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Cliente.DoesNotExist:
        return Response({"error": "Cliente no existente"}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@authentication_classes([AdminAuthentication, RootAuthentication])
@permission_classes([IsAuthenticated])
def get_admin(request):
    try:
        id = request.data["user_id"]
        user= NormalUser.objects.get(user_id=id, activo=True)
        user_serializer = UserSerializer(user, many=False)
        admin = Administrador.objects.get(user_id=id, activo=True)
        admin_serializer = Administrador(admin, many=False)
        combined_data = user_serializer.data.copy() 
        combined_data.update(admin_serializer.data)
        return Response(combined_data, status=status.HTTP_200_OK)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Cliente.DoesNotExist:
        return Response({"error": "Administrador no existente"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@authentication_classes([RootAuthentication])
@permission_classes([IsAuthenticated])
def create_admin(request):
    request.data['roles'] = 2
    user_serializer = UserSerializer(data=request.data)
    if user_serializer.is_valid():
        new_user = user_serializer.save()
        admin_data = request.data.copy()
        admin_data['user_id'] = new_user.user_id
        admin_serializer = AdministradorSerializer(data=admin_data)
        if admin_serializer.is_valid():
            admin_serializer.save()
            return Response(admin_serializer.data, status=status.HTTP_201_CREATED)
        NormalUser.objects.get(user_id=new_user.user_id).delete()
        return Response(admin_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@authentication_classes([AdminAuthentication])
@permission_classes([IsAuthenticated])
def update_admin(request):
    request.data['roles'] = 2
    try:
        user = NormalUser.objects.get(user_id=request.data['user_id'], activo = True)
        admin = Administrador.objects.get(user_id=request.data['user_id'], activo = True)
        user_serializer = UserSerializer(user, data=request.data)
        admin_serializer = AdministradorSerializer(admin, data=request.data)
        user_serializer.is_valid()
        admin_serializer.is_valid()
        if user_serializer.is_valid() and admin_serializer.is_valid():
            user_serializer.save()
            admin_serializer.save()
            return Response(admin_serializer.data, status=status.HTTP_202_ACCEPTED)
        
        return Response({
            "user_errors": user_serializer.errors,
            "admin_errors": admin_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Administrador.DoesNotExist:
        return Response({"error": "Cliente no existente"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@authentication_classes([RootAuthentication])
@permission_classes([IsAuthenticated])
def delete_admin(request):
    try:
        id = request.data["user_id"]
        user = NormalUser.objects.get(user_id=id, activo = True)
        admin = Administrador.objects.get(user_id=id, activo = True)
        
        user.soft_delete()
        admin.soft_delete()

        return Response({"message": "Administrador borrado correctamente."}, status=status.HTTP_200_OK)

    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Administrador.DoesNotExist:
        return Response({"error": "Administrador no existente"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def login(request):
    try:
        user = NormalUser.objects.get(email=request.data['email'], activo=True)
        if not user.check_password(request.data['password']):
            return Response({"error": "Invalid Password"}, status=status.HTTP_401_UNAUTHORIZED)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)
    except KeyError:
        return Response({"error": "Invalid Request"}, status=status.HTTP_400_BAD_REQUEST)
    except NormalUser.DoesNotExist:
        return Response({"error": "User Doesn't Exist"}, status=status.HTTP_404_NOT_FOUND)
    