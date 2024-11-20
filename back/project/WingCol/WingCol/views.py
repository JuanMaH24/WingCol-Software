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
from django.conf import settings
from rest_framework.response import Response
from django.urls import reverse
from rest_framework import status
from datetime import datetime
import stripe
from .auth import ClientAuthentication, AdminAuthentication, RootAuthentication
from .models import *
from .serializers import *
from .services import *

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
        id = request.query_params.get("user_id")
        user= NormalUser.objects.get(user_id=id, activo=True)
        user_serializer = UserSerializer(user, many=False)
        admin = Administrador.objects.get(user_id=id, activo=True)
        admin_serializer = AdministradorSerializer(admin, many=False)
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
        return Response({"error": "Administrador no existente"}, status=status.HTTP_404_NOT_FOUND)

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
        price = request.query_params.get("precio")
        search_query = Q(activo = True, estado = 'P')
        if city_arrive:
            search_query &= Q(ciudad_destino=city_arrive)
        if city_departure:
            search_query &= Q(ciudad_origen=city_departure)
        if price:
            search_query &= Q(precio=price)
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
@authentication_classes([AdminAuthentication])
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
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def create_card(request):
    try:
        user = NormalUser.objects.get(user_id=request.data['user_id'], activo=True)
        card_serializer = CardSerializer(data=request.data)
        if card_serializer.is_valid():
            card_serializer.save()
            return Response(card_serializer.data, status=status.HTTP_201_CREATED)
        return Response(card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no existente"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({"error": error}, status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(['GET'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def get_card(request):
    try:
        user_id = request.query_params.get('user_id')
        card = Tarjetas.objects.filter(user_id=user_id, activo=True)
        card_serializer = CardSerializer(card, many=True)
    
        return Response(card_serializer.data, status=status.HTTP_200_OK)
    except Tarjetas.DoesNotExist:
        return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def get_card_by_id(request):
    try:
        card_id = request.query_params.get('id_tarjeta')
        card = Tarjetas.objects.get(id_tarjeta=card_id, activo=True)
        card_serializer = CardSerializer(card)
        return Response(card_serializer.data, status=status.HTTP_200_OK)
    except Tarjetas.DoesNotExist:
        return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def delete_card(request):
    id = request.data['id_tarjeta']
    card = Tarjetas.objects.get(id_tarjeta=id, activo=True)
    card.soft_delete()
    return Response({"message": "Tarjeta borrada correctamente."}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def update_card(request):
    id = request.data['id_tarjeta']
    card = Tarjetas.objects.get(id_tarjeta=id, activo=True)
    card_serializer = CardSerializer(card, request.data)
    card_serializer.is_valid()
    if card_serializer.is_valid():
        card_serializer.save()
        return Response(card_serializer.data, status=status.HTTP_202_ACCEPTED)
    return Response({'errors': card_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
# @authentication_classes([ClientAuthentication])
# @permission_classes([IsAuthenticated])
def create_ticket(request):
    try:
        seat_id = select_seat(request.data['id_vuelo'], request.data['clase'])
        seat = Sillas.objects.get(id_silla=seat_id, clase=request.data['clase'], activo=True)
        user = NormalUser.objects.get(user_id=request.data['user_id'], activo=True)
        request.data['id_silla'] = seat_id
        ticket_serializer = TicketSerializer(data=request.data)
        tickets = Tiquete.objects.filter(user_id=request.data['user_id'], id_silla__id_vuelo__id_vuelo=seat.id_vuelo.id_vuelo, activo=True)
        validate_tickets_per_flight(tickets.count())
        if ticket_serializer.is_valid():
            ticket = ticket_serializer.save()
            ticket.create_code()
            ticket.save()
            seat.estado = request.data['estado']
            seat.save()
            return Response(ticket_serializer.data, status=status.HTTP_201_CREATED)
        return Response(ticket_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Sillas.DoesNotExist:
        return Response({"error": "Silla no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except ValueError as error:
        return Response({"error": f"{error}"}, status=status.HTTP_406_NOT_ACCEPTABLE)
    
@api_view(['GET'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def get_ticket(request):
    try:
        ticket_id = request.query_params.get('id_tiquete')
        ticket = Tiquete.objects.get(id_tiquete=ticket_id, activo=True)
        ticket_serializer = TicketSerializer(ticket)
        return Response(ticket_serializer.data, status=status.HTTP_200_OK)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_ticket_by_user(request):
    try:
        user_id = request.query_params.get('user_id')
        ticket = Tiquete.objects.get(user_id=user_id, activo=True)
        ticket_serializar = TicketSerializer(ticket, many=True)
        return Response(ticket_serializar.data, status=status.HTTP_200_OK)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def cancel_ticket(request):
    try:
        id = request.data['id_tiquete']
        ticket = Tiquete.objects.get(id_tiquete=id, activo=True)
        seat = Sillas.objects.get(id_silla=ticket.id_silla.id_silla)
        seat.estado = 'L'
        seat.save()
        ticket.soft_delete()
        return Response({"message": "Tiquete cancelado correctamente."}, status=status.HTTP_200_OK)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def update_ticket(request):
    try:
        id = request.data['id_tiquete']
        ticket = Tiquete.objects.get(id_tiquete=id, activo=True)
        ticket_serializer = TicketSerializer(ticket, request.data)
        ticket_serializer.is_valid()
        if ticket_serializer.is_valid():
            ticket_serializer.save()
            return Response(ticket_serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response({'errors': ticket_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def fast_verification(request):
    try:
        verification_code = request.data['verificacion']
        ticket = Tiquete.objects.get(verificacion=verification_code, activo=True)
        ticket.verificado = True
        ticket_serializer = TicketSerializer(ticket)
        return Response(ticket_serializer.data, status=status.HTTP_200_OK)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def identify_verification(request):
    try:
        user = request.data['user_id']
        flight = request.data['id_vuelo']
        ticket = Tiquete.objects.get(user_id=user, id_silla__id_vuelo__id_vuelo=flight, activo=True)
        ticket_serializer = TicketSerializer(ticket)
        return Response(ticket_serializer.data, status=status.HTTP_200_OK)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_cart(request):
    try:
        user = request.query_params.get('user_id')
        cart = CarritoCompras.objects.get(user_id=user, activo=True)
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_200_OK)
    except CarritoCompras.DoesNotExist:
        return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_cart(request):
    try:
        user = request.data['user_id']
        cart = CartSerializer(data=request.data)
        if cart.is_valid():
            cart.save()
            return Response({"message": "Carrito creado correctamente."}, status=status.HTTP_201_CREATED)
        return Response(cart.errors, status=status.HTTP_400_BAD_REQUEST)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_to_cart(request):
    try:
        user = request.data['user_id']
        ticket = Tiquete.objects.get(id_tiquete=request.data['id_tiquete'], activo=True)
        cart = CarritoCompras.objects.get(user_id=user, activo=True)
        request.data['id_carrito'] = cart.id_carrito
        item = ItemSerializer(data=request.data)
        if item.is_valid():
            item.save()
            return Response({"message": "Tiquete añadido al carrito correctamente."}, status=status.HTTP_201_CREATED)
        return Response(item.errors, status=status.HTTP_400_BAD_REQUEST)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except CarritoCompras.DoesNotExist:
        return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def remove_from_cart(request):
    try:
        user = request.data['user_id']
        ticket = request.data['id_tiquete']
        cart = CarritoCompras.objects.get(user_id=user, activo=True)
        item = ItemCarrito.objects.get(id_tiquete=ticket, id_carrito=cart.id_carrito)
        item.soft_delete()
        return Response({"message": "Tiquete eliminado del carrito correctamente."}, status=status.HTTP_200_OK)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except CarritoCompras.DoesNotExist:
        return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def delete_cart(request):
    try:
        user = request.data['user_id']
        cart = CarritoCompras.objects.get(user_id=user, activo=True)
        ItemCarrito.objects.filter(id_carrito=cart.id_carrito).update(activo=False)
        cart.soft_delete()
        return Response({"message": "Carrito eliminado correctamente."}, status=status.HTTP_200_OK)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except CarritoCompras.DoesNotExist:
        return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def make_payment(request):
    try:
        stripe_key = settings.STRIPE_SECRET_KEY
        user_id = request.data['user_id']
        card = Tarjetas.objects.get(id_tarjeta=request.data['id_tarjeta'], activo=True)  
        cart = CarritoCompras.objects.get(user_id=user_id, activo=True)
        items = ItemCarrito.objects.filter(id_carrito=cart.id_carrito, activo=True)
        tickets = Tiquete.objects.filter(id_tiquete__in=[item.id_tiquete.id_tiquete for item in items], activo=True)
        price = sum([item.id_tiquete.precio for item in items])
        validate_card(card.saldo, price, card.fecha_expiracion)
        # payment_intent = stripe.PaymentIntent.create(
        #     amount=price,
        #     currency='cop',
        #     payment_method=['card'],
        #     description=f'Compra de tiquetes realizada por {user_id}',
        #     # confirmation_method='manual',
        #     # confirm=True,
        # ) 
        print("pagando")    
        card.saldo -= price
        card.save() 
        confirm_payment(cart, items)
        # return Response({'client_secret': payment_intent['client_secret']}, status=status.HTTP_200_OK)
        return Response({"message": "Pago realizado correctamente."}, status=status.HTTP_200_OK)
    except CarritoCompras.DoesNotExist:
        return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except NormalUser.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Tarjetas.DoesNotExist:
        return Response({"error": "Tarjeta no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    except Tiquete.DoesNotExist:
        return Response({"error": "Tiquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except stripe.error.StripeError as stripe_error:
        print(stripe_error)
        return Response({"error": stripe_error}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as error:
        print(error)
        return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def confirm_payment(request):
#     try:
#         print("ya pagó")
#         user_id = request.data['user_id']
#         cart = CarritoCompras.objects.get(user_id=user_id, activo=True)
#         items = ItemCarrito.objects.filter(id_carrito=cart.id_carrito, activo=True)
#         for item in items:
#             ticket = Tiquete.objects.get(id_tiquete=item.id_tiquete.id_tiquete)
#             ticket.soft_delete()
#             item.soft_delete()
#         cart.soft_delete()
#         return Response({"message": "Pago realizado correctamente."}, status=status.HTTP_200_OK)
#     except CarritoCompras.DoesNotExist:
#         return Response({"error": "Carrito no encontrado"}, status=status.HTTP_404_NOT_FOUND)
#     except NormalUser.DoesNotExist:
#         return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as error:
#         return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@authentication_classes([ClientAuthentication])
@permission_classes([IsAuthenticated])
def update_seat(request):
    try:    
        seat_id = request.data['id_silla']
        state = request.data['estado']
        seat = Sillas.objects.get(id_silla=seat_id)
        seat.estado = state
        seat.save
        return Response({"message": "Silla actualizada correctamente."}, status=status.HTTP_200_OK)
    except Sillas.DoesNotExist:
        return Response({"error": "Silla no encontrada"}, status=status.HTTP_404_NOT_FOUND)

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

@receiver(post_save, sender=Administrador)
def notify_admin_creation(sender, instance, created, **kwargs):
    if created:
        print("deberia enviar correo")
        context = {
            'current_user': instance.user_id,
            'email': instance.user_id.email,
        }

        html_message = render_to_string("pruebaplantilla.html", context)
        email_plaintext_message = "El Administrador en WingCol Airlines a sido creado con éxito. Tu contraseña es 'admin1234', por favor cambialo lo más pronto posible en la opción 'Editar Perfil'."

        msg = EmailMultiAlternatives(
            "Creación de cuenta - {title}".format(title="WingCol"),
            email_plaintext_message,
            "wingcolairlines@gmail.com",
            [instance.user_id.email]
        )

        msg.attach_alternative(html_message, "text/html")
        msg.send()


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

    