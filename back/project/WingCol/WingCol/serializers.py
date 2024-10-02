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
        
