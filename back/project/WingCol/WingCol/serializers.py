from rest_framework import serializers
from django.utils import timezone
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
                  'genero', 'telefono', 'direccion', 'direccion_facturacion', 'user_pic']
        extra_kwargs = {'user_pic': {'required': False}}
        
class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = [
            'user_id', 'nombre', 'segundo_nombre', 'apellido', 
            'segundo_apellido', 'genero', 'telefono', 'admin_pic']
        extra_kwargs = {'admin_pic': {'required': False}}

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vuelos
        fields = ['id_vuelo', 'referencia', 'ciudad_origen', 'ciudad_destino', 'fecha_salida', 'duracion', 'fecha_llegada', 'precio', 'tipo', 'estado', 'vuelos_pic']
        extra_kwargs = {'vuelos_pic': {'required': False}, 'id_vuelo': {'read_only': True}, 'referencia': {'read_only': True}}

    def validate(self, data):
        # if data['fecha_salida'] >= data['fecha_llegada']:
        #     raise serializers.ValidationError('La fecha de salida debe ser menor a la fecha de llegada')
        if data['fecha_salida'] < timezone.now():
            raise serializers.ValidationError('La fecha de salida debe ser mayor a la fecha actual')
        return data 
    
class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vuelos
        fields = ['ciudad_origen', 'ciudad_destino', 'fecha_salida', 'fecha_llegada', 'nombre', 'precio', 'tipo', 'estado', 'vuelos_pic']
        extra_kwargs = {'vuelos_pic': {'required': False}}

    def validate(self, data):
        # if data['fecha_salida'] >= data['fecha_llegada']:
        #     raise serializers.ValidationError('La fecha de salida debe ser menor a la fecha de llegada')
        if data['fecha_salida'] < timezone.now():
            raise serializers.ValidationError('La fecha de salida debe ser mayor a la fecha actual')
        return data 
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir atributos personalizados al token
        token['roles'] = user.roles

        return token

     
class CardSerializer(serializers.ModelSerializer):
    # user_id = serializers.PrimaryKeyRelatedField(queryset=NormalUser.objects.all())
    class Meta:
        model = Tarjetas
        fields = ['id_tarjeta', 'user_id', 'tipo_tarjeta', 'vvc', 'fecha_expiracion', 'saldo']

    def validate(self, data):
        if data['id_tarjeta'] < 0:
            raise serializers.ValidationError('El id de la tarjeta no puede ser negativo')
        if len(str(data['id_tarjeta'])) != 16:
            raise serializers.ValidationError('La longitud del id no es valida')
        return data
    
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tiquete
        fields = ['id_silla', 'id_cliente', 'clase', 'tipo_equipaje', 'id_silla', 'verificacion', 'activo']

    def validate(self, data):
        if data['fecha_compra'] > data['fecha_vuelo']:
            raise serializers.ValidationError('La fecha de compra debe ser menor a la fecha de vuelo')
        return data

class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComprasReservas
        fields = ['id_vuelo', 'id_cliente', 'estado', 'valor']
        extra_kwargs = {'carro_pic': {'required': False}}