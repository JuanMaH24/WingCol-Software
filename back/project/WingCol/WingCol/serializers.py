from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model =  NormalUser
        fields = ['user_id', 'email', 'roles', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.instance:
            self.fields['password'].required = False

    def create(self, validated_data):
        user = NormalUser(
            user_id=validated_data['user_id'],
            email=validated_data['email'],
            roles=validated_data['roles']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.roles = validated_data.get('roles', instance.roles)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance



class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['user_id', 'nombre', 'segundo_nombre','apellido', 'segundo_apellido', 
                  'tipo_documento', 'fecha_nacimiento', 'pais',
                  'genero', 'telefono', 'direccion', 'direccion_facturacion']
        
class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = [
            'user_id', 'nombre', 'segundo_nombre', 'apellido', 
            'segundo_apellido', 'genero', 'telefono']

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vuelos
        fields = ['ciudad_origen', 'ciudad_destino', 'fecha_salida', 'fecha_llegada', 'precio', 'tipo', 'estado']

    def create(self, validated_data):
        flight = Vuelos(
            ciudad_origen=validated_data['ciudad_origen'],
            ciudad_destino=validated_data['ciudad_destino'],
            fecha_salida=validated_data['fecha_salida'],
            fecha_llegada=validated_data['fecha_llegada'],
            precio=validated_data['precio'],
            tipo=validated_data['tipo'],
            estado=validated_data['estado']
        )
        flight.save()
        return flight
    
    def update(self, instance, validated_data):
        instance.ciudad_origen = validated_data.get('ciudad_origen', instance.ciudad_origen)
        instance.ciudad_destino = validated_data.get('ciudad_destino', instance.ciudad_destino)
        instance.fecha_salida = validated_data.get('fecha_salida', instance.fecha_salida)
        instance.fecha_llegada = validated_data.get('fecha_llegada', instance.fecha_llegada)
        instance.precio = validated_data.get('precio', instance.precio)
        instance.tipo = validated_data.get('tipo', instance.tipo)
        instance.estado = validated_data.get('estado', instance.estado)
        instance.save()
        return instance

# class SeatSerializer(serializers.ModelSerializers):
#     class Meta:
#         model = Sillas
#         fields = ['id_silla', 'vuelo_id', 'numero', 'clase', 'precio', 'disponible']
        
