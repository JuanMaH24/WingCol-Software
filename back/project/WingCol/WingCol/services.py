from django.utils import timezone


def validate_card(charge, total_price, expiration_date, input_vvc, card_vvc):
	if charge < total_price:
		raise ValueError("El valor de la tarjeta es insuficiente")
	if expiration_date < timezone.now():
		raise ValueError("La tarjeta ha expirado")
	if input_vvc != card_vvc:
		raise ValueError("El VVC no coincide")

def validate_tickets_per_flight(tickets_lenght):
	if tickets_lenght > 5:
		raise ValueError("No se pueden comprar más de 5 tiquetes por vuelo")
	
def confirm_payment(cart, items):
	for item in items:
		item.soft_delete()
		item.save()
	cart.soft_delete()