from django.utils import timezone
from .models import *
import random
# from datetime import datetime

def select_seat(flight, seat_class):
	try:
		available_seats = Sillas.objects.filter(id_vuelo=flight, estado='L')
		if seat_class == 'E':
			seats = available_seats.filter(clase='E')
		if seat_class == 'P':
			seats = available_seats.filter(clase='P')
		random_seat = random.choice(seats)
		return random_seat.id_silla

	except Sillas.DoesNotExist:
		raise ValueError("No hay sillas disponibles para este vuelo")


def validate_card(charge, total_price, expiration_date):
	if charge < total_price:
		raise ValueError("El valor de la tarjeta es insuficiente")
	if expiration_date < timezone.now().date():
		raise ValueError("La tarjeta ha expirado")

def validate_tickets_per_flight(tickets_count):
	if tickets_count >= 5:
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