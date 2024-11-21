from django.utils import timezone
from .models import *
import random
# from datetime import datetime

def select_seat(flight, seat_class):
	available_seats = Sillas.objects.filter(id_vuelo=flight, estado='L')
	if available_seats.count() == 0:
		raise ValueError("No hay sillas disponibles")
	if seat_class == 'E':
		seats = available_seats.filter(clase='E')
	if seat_class == 'P':
		seats = available_seats.filter(clase='P')
	random_seat = random.choice(seats)
	return random_seat.id_silla

def validate_card(charge, total_price, expiration_date):
	if charge < total_price:
		raise ValueError("El valor de la tarjeta es insuficiente")
	if expiration_date < timezone.now().date():
		raise ValueError("La tarjeta ha expirado")

def validate_tickets_per_flight(tickets_count):
	if tickets_count >= 5:
		raise ValueError("No se pueden comprar más de 5 tiquetes por vuelo")

def validate_cart_items_per_flight(cart, flight):
	count_items_per_flight = ItemCarrito.objects.filter(id_carrito=cart, id_vuelo=flight).count()
	if count_items_per_flight >= 5:
		raise ValueError("No se pueden comprar más de 5 tiquetes por vuelo")

def confirm_payment(cart, items):
	for item in items:
		item.soft_delete()
		item.save()
	cart.soft_delete()

def validate_unique_passenger(passenger_id):
	ticket_duplicated = Tiquete.objects.filter(id_viajero=passenger_id, activo=True)
	item_duplicated = ItemCarrito.objects.filter(id_viajero=passenger_id, activo=True)
	if ticket_duplicated or item_duplicated:
		raise ValueError("El pasajero ya esta registrado en el vuelo")
	
def check_active_carts():
	active_cart = CarritoCompras.objects.filter(activo=True)
	if active_cart:
		raise ValueError("Ya hay un carrito activo")