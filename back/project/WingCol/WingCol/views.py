from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes, authentication_classes
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from django.db.models import Q
from django.db.models.signals import post_save
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.response import Response
from django.urls import reverse
from rest_framework import status
from datetime import datetime
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
        id = request.query_params.get("user_id")
        user = NormalUser.objects.get(user_id=id, activo=True)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def get_client(request):
    try:
        id = request.query_params.get("user_id")
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
    data = request.data.copy()
    data['roles'] = 1  

    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        new_user = user_serializer.save()
        client_data = data.copy()
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
    data = request.data.copy()
    data['roles'] = 1  
    try:
        user = NormalUser.objects.get(user_id=data['user_id'], activo = True)
        client = Cliente.objects.get(user_id=data['user_id'], activo = True)
        user_serializer = UserSerializer(user, data=data)
        client_serializer = ClientSerializer(client, data=data)
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
        id = request.query_params.get("user_id")
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
        id = request.query_params.get("user_id")
        user= NormalUser.objects.get(user_id=id, activo=True)
        user_serializer = UserSerializer(user, many=False)
        admin = Administrador.objects.get(user_id=id, activo=True)
        admin_serializer = Administrador(admin, many=False)
        combined_data = user_serializer.data.copy() 
        combined_data.update(admin_serializer.data)
        return Response(combined_data, status=status.HTTP_200_OK)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Administrador.DoesNotExist:
        return Response({"error": "Administrador no existente"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@authentication_classes([RootAuthentication])
@permission_classes([IsAuthenticated])
def create_admin(request):
    data = request.data.copy()
    data['roles'] = 2
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        new_user = user_serializer.save()
        admin_data = data.copy()
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
    data = request.data.copy()
    data['roles'] = 2
    try:
        user = NormalUser.objects.get(user_id=data['user_id'], activo = True)
        admin = Administrador.objects.get(user_id=data['user_id'], activo = True)
        user_serializer = UserSerializer(user, data=data)
        admin_serializer = AdministradorSerializer(admin, data=data)
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

        refresh = RefreshToken.for_user(user)
        refresh['roles'] = user.roles
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    
    except KeyError:
        return Response({"error": "Los Datos no son Correctos"}, status=status.HTTP_400_BAD_REQUEST)  
    except NormalUser.DoesNotExist:
        return Response({"error": "El Usuario no fue Encontrado, Debes Registrarte"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@authentication_classes([AdminAuthentication])
@permission_classes([IsAuthenticated])
def create_flight(request):
    flight_serializer = FlightSerializer(data=request.data)
    if flight_serializer.is_valid():
        flight = flight_serializer.save()
        flight.create_reference()
        flight.save()
        return Response(flight_serializer.data, status=status.HTTP_201_CREATED)
    return Response(flight_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([AdminAuthentication])
@permission_classes([IsAuthenticated])
def get_flight(request):
    try:
        flight_id = request.query_params.get("id_vuelo")
        flight = Vuelos.objects.get(id_vuelo=flight_id)
        print(flight)
        serializer = FlightSerializer(flight)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Vuelos.DoesNotExist:
        return Response({"error": "Vuelo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_all_flights(request):
    try:
        flights = Vuelos.objects.get(activo=True)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)
    except Vuelos.DoesNotExist:
        return Response({"error": "No hay vuelos disponibles"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_flights(request):
    try:
        city_arrive = request.query_params.get("ciudad_destino")
        city_departure = request.query_params.get("ciudad_origen")
        date = request.query_params.get("fecha_salida")
        search_query = Q(activo =True)
        if city_arrive:
            search_query &= Q(ciudad_destino=city_arrive)
        if city_departure:
            search_query &= Q(ciudad_origen=city_departure)
        if date:
            arrive_date = datetime.strptime(date, "%Y-%m-%d").date()
            search_query &= Q(fecha_salida__date=arrive_date)
        flights = Vuelos.objects.filter(search_query)
        # search_serializer = SearchSerializer(request.data)
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Vuelos.DoesNotExist:
        return Response({"error": "Vuelo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['PUT'])
@authentication_classes([AdminAuthentication])
@permission_classes([IsAuthenticated])
def update_flight(request):
    id = request.data['id']
    flight = Vuelos.objects.get(id_vuelo=id, activo=True)
    flight_serializer = FlightSerializer(flight, request.data)
    flight_serializer.is_valid()
    if flight_serializer.is_valid():
        flight = flight_serializer.save()
        flight.create_reference()
        flight.save()
        return Response(flight_serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response({'errors': flight_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@authentication_classes([RootAuthentication])
@permission_classes([IsAuthenticated])
def delete_flight(request):
    try:
        id = request.data['id_vuelo']
        flight = Vuelos.objects.get(id_vuelo=id, activo=True)
        flight.soft_delete()
        return Response({"message": "Vuelo borrado correctamente."}, status=status.HTTP_200_OK)
    except Vuelos.DoesNotExist:
        return Response({"error": "Vuelo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_card(request):
    try:
        print("creando")
        card_serializer = CardSerializer(data=request.data)
        print("si creó")
        if card_serializer.is_valid():
            print("checado")
            card_serializer.save()
            return Response(card_serializer.data, status=status.HTTP_201_CREATED)
        return Response(card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except KeyError:

        return Response({"error": "Datos incorrectos"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_card(request):
    try:
        user_id = request.query_params.get('id_cliente')
        card = Tarjetas.objects.get(id_cliente=user_id, activo=True)
        card_serializer = CardSerializer(card, many=True)
    
        return Response(card_serializer.data, status=status.HTTP_200_OK)
    except Tarjetas.DoesNotExist:
        return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def delete_card(request):
    id = request.data['id_tarjeta']
    card = Tarjetas.objects.get(id_tarjeta=id, activo=True)
    card.soft_delete()
    return Response({"message": "Tarjeta borrada correctamente."}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_card(request):
    id = request.data['id_tarjeta']
    card = Tarjetas.objects.get(id_tarjeta=id, activo=True)
    card_serializer = CardSerializer(card, request.data)
    card_serializer.is_valid()
    if card_serializer.is_valid():
        card_serializer.save()
        return Response(card_serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response({'errors': card_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@receiver(post_save, sender=Vuelos)
def create_seats(sender, instance, created, **kwargs):
    if created:
        try:
            number_seats = 150 if instance.tipo == 'N' else 250
            for i in range(number_seats):
                Sillas.objects.create(
                        id_vuelo=instance, 
                        ubicacion=f"{i+1}", 
                        clase='E' if i < number_seats*0.8 else 'P', 
                        estado='L'
                    ) 
        except Exception as exception:
            raise exception
        
@receiver(post_save, sender=Vuelos)
def delete_seats(sender, instance, **kwargs):
    if not instance.activo:
        try:
            Sillas.objects.filter(id_vuelo=instance, activo=True).update(activo=False)
        except Exception as exception:
            raise exception

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    print("deberia enviar correo")
    context = {
        'current_user': reset_password_token.user,
        'email': reset_password_token.user.email,
        'token': reset_password_token.key
    }

    html_message = render_to_string("pruebaplantilla.html", context)
    email_plaintext_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        "Recuperación de contraseña - {title}".format(title="WingCol"),
        email_plaintext_message,
        "wingcolairlines@gmail.com",
        [reset_password_token.user.email]
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()

    return Response({"message": "correo enviado"}, status=status.HTTP_200_OK)

    