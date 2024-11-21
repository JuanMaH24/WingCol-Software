import random
import string



def create_verification_code():
	verification_code = ""
	for i in range(3):
		verification_code += random.choice(string.ascii_letters)
	for i in range(3):
		verification_code += str(random.randint(0, 9))
	print(verification_code)
	return verification_code
import random
import string
from math import radians, sin, cos, sqrt, atan2

def generate_password():
    length = random.randint(8, 20)
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(random.choice(characters) for i in range(length))
    return password


def calculate_distance_btw_cities(lat1, lon1, lat2, lon2):
    R = 6371 
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

def duration_aprox_flight(distance_km):
    average_vel_km_hrs = 800
    margin_time_min = 30
    duration_aprox_min = distance_km/average_vel_km_hrs * 60
    return duration_aprox_min + margin_time_min
