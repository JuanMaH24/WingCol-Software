from django.utils import timezone
# from datetime import datetime


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