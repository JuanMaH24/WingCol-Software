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