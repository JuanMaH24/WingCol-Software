from django.db import models
from .manager import UsersManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import MinValueValidator, MaxValueValidator


class NormalUser(AbstractBaseUser, PermissionsMixin):
	ROLES = (
		(1, "Cliente"),
		(2, "Administrador"),
		(3, "Root")
	) 
	user_id = models.PositiveBigIntegerField(primary_key=True, unique=True)
	email = models.EmailField(
		verbose_name="direccion de correo electrónico",
		max_length=100,
		unique=True
	)
	roles = models.PositiveSmallIntegerField(choices=ROLES)
	activo = models.BooleanField(default=True)
	# password_reset_token = models.CharField(max_length=255, null=True, blank=True)
	objects = UsersManager()

	USERNAME_FIELD = 'user_id'
	REQUIRED_FIELDS = ['email', 'roles']

	def set_password(self, raw_password):
		self.password = make_password(raw_password)

	def check_password(self, raw_password):
		return check_password(raw_password, self.password)
	
	def soft_delete(self):
		self.activo = False
		self.save()


class Administrador(models.Model):
	class Genero(models.TextChoices):
		MASCULINO = 'M', 'Masculino'
		FEMENINO = 'F', 'Femenino'
		OTRO = 'O', 'Otro'

	user_id = models.OneToOneField(NormalUser, on_delete=models.CASCADE)
	nombre = models.CharField(max_length=50)
	segundo_nombre = models.CharField(max_length=50, blank=True)
	apellido = models.CharField(max_length=50)
	segundo_apellido = models.CharField(max_length=50)
	genero = models.CharField(max_length=1, choices=Genero.choices)
	telefono = models.CharField(max_length=20)
	admin_pic = models.ImageField(upload_to='img/user/', blank=True)
	activo = models.BooleanField(default=True)

	def soft_delete(self):
		self.activo = False
		self.save()

class Cliente(models.Model):
	class Genero(models.TextChoices):
		MASCULINO = 'M', 'Masculino'
		FEMENINO = 'F', 'Femenino'
		OTRO = 'O', 'Otro'

	class TipoDocumento(models.TextChoices):
		CC = 'CC', 'Cédula de Ciudadanía'
		TI = 'TI', 'Tarjeta de Identidad'
		CE = 'CE', 'Cédula de Extranjería'
		PA = 'PA', 'Pasaporte'

	user_id = models.OneToOneField(NormalUser, on_delete=models.CASCADE)
	nombre = models.CharField(max_length=50)
	segundo_nombre = models.CharField(max_length=50, blank=True)
	apellido = models.CharField(max_length=50)
	segundo_apellido = models.CharField(max_length=50)
	tipo_documento = models.CharField(max_length=2, choices=TipoDocumento.choices)
	fecha_nacimiento = models.DateField()
	genero = models.CharField(max_length=1, choices=Genero.choices)	
	telefono = models.CharField(max_length=20)
	direccion = models.CharField(max_length=50)
	pais = models.CharField(max_length=20)
	departamento = models.CharField(max_length=20)
	municipio = models.CharField(max_length=20)
	direccion_facturacion = models.CharField(max_length=50)
	user_pic = models.ImageField(upload_to='img/user/', blank=True)
	activo = models.BooleanField(default=True)

	def soft_delete(self):
		self.activo = False
		self.save()
	

class Root(models.Model):
	user_id = models.OneToOneField(NormalUser, on_delete=models.CASCADE)
	activo = models.BooleanField(default=True)

class Tarjetas(models.Model):
	class TipoTarjeta(models.TextChoices):
		DEBITO = 'D', 'Débito'
		CREDITO = 'C', 'Crédito'
	id_tarjeta = models.BigIntegerField(primary_key=True) 
	user_id = models.ForeignKey(NormalUser, on_delete=models.CASCADE)
	tipo_tarjeta = models.CharField(max_length=20, choices=TipoTarjeta.choices)
	vvc = models.PositiveIntegerField(
		validators=[MinValueValidator(100), MaxValueValidator(9999)]
	)
	nombre = models.CharField(max_length=50)
	fecha_expiracion = models.DateField()
	saldo = models.IntegerField(blank=True, null=True)
	activo = models.BooleanField(default=True)

	def soft_delete(self):
		self.activo = False
		self.save() 

class Vuelos(models.Model):
	class EstadoVuelo(models.TextChoices):
		PROGRAMADO = 'P', 'Programado'
		REALIZADO = 'R', 'Realizado'

	class TipoVuelo(models.TextChoices):
		NACIONAL = 'N', 'Nacional'
		INTERNACIONAL = 'I', 'Internacional'

	id_vuelo = models.AutoField(primary_key=True)
	referencia = models.CharField(max_length=20)
	ciudad_origen = models.CharField(max_length=25)
	ciudad_destino = models.CharField(max_length=25)
	precio = models.PositiveIntegerField()
	fecha_salida = models.DateTimeField()
	fecha_llegada = models.DateTimeField(blank=True, null=True)
	duracion = models.FloatField(blank=True, null=True)
	tipo = models.CharField(max_length=20, choices=TipoVuelo.choices)
	estado = models.CharField(max_length=20, choices=EstadoVuelo.choices)
	vuelos_pic = models.ImageField(upload_to='img/flight/', blank=True)
	activo = models.BooleanField(default=True)

	def soft_delete(self):
		self.activo = False
		self.save()

	def create_reference(self):
		self.referencia = f"{self.ciudad_origen[:3].upper()}-{self.ciudad_destino[:3].upper()}{self.fecha_salida.strftime('%d%m%y')}{self.id_vuelo}"

	# def calculate_duration(self):
	# 	duracion = round((self.fecha_llegada - self.fecha_salida).seconds / 3600, 2)
	# 	self.duracion = duracion

class Sillas(models.Model):
	class ClaseAsiento(models.TextChoices):
		ECONOMICA = 'E', 'Clase económica'
		PRIMERA_CLASE = 'P', 'Primera clase'

	class EstadoAsiento(models.TextChoices):
		LIBRE = 'L', 'Libre'
		RESERVADO = 'R', 'Reservado'
		OCUPADO = 'O', 'Ocupado'

	id_silla = models.AutoField(primary_key=True)
	id_vuelo = models.ForeignKey(Vuelos, on_delete=models.CASCADE)
	ubicacion = models.CharField(max_length=5)
	clase = models.CharField(max_length=20, choices=ClaseAsiento.choices)
	estado = models.CharField(max_length=20, choices=EstadoAsiento.choices)
	activo = models.BooleanField(default=True)

	def soft_delete(self):
		self.activo = False
		self.save()


class ComprasReservas(models.Model):
	class Estado(models.TextChoices):
		COMPRADO = 'COM', 'Comprado'
		RESERVADO = 'RES', 'Reservado'
		CANCELADO = 'CAN', 'Cancelado'
	user_id = models.ForeignKey(Cliente, on_delete=models.CASCADE)
	id_vuelo = models.ForeignKey(Vuelos, on_delete=models.CASCADE)
	id_cr = models.AutoField(primary_key=True)
	estado = models.CharField(max_length=20, choices=Estado.choices)
	valor = models.PositiveIntegerField()
	activo = models.BooleanField(default=True)

class Tiquete(models.Model):
	class ClaseVuelo(models.TextChoices):
		ECONOMICA = 'E', 'Clase económica'
		PRIMERA_CLASE = 'P', 'Primera clase'
	class TipoEquipaje(models.TextChoices):
		PERSONAL = 'EP', 'Equipaje personal'
		MANO = 'EM', 'Equipaje de mano'
		MALETA = 'MB', 'Maleta de bodega'

	id_tiquete = models.AutoField(primary_key=True)
	user_id = models.ForeignKey(Cliente, on_delete=models.CASCADE)
	id_silla = models.ForeignKey(Sillas, on_delete=models.CASCADE)
	clase = models.CharField(max_length=20, choices=ClaseVuelo.choices)
	tipo_equipaje = models.CharField(max_length=20, choices=TipoEquipaje.choices)
	verificacion = models.CharField(unique=True, max_length=50)
	activo = models.BooleanField(default=True)

class Busquedas(models.Model):
	user_id = models.ForeignKey(Cliente, on_delete=models.CASCADE)
	ciudad_origen = models.CharField(max_length=25, blank=True)
	ciudad_destino = models.CharField(max_length=25, blank=True)
	fecha = models.DateTimeField(auto_now_add=True, blank=True)
