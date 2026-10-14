from rest_framework import serializers
from .models import Role, Service, Employe


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class EmployeSerializer(serializers.ModelSerializer):

    service_nom = serializers.CharField(
        source='service.nom',
        read_only=True
    )

    role_nom = serializers.CharField(
        source='role.nom',
        read_only=True
    )

    class Meta:
        model = Employe

        fields = [
            'id',
            'matricule',
            'nom',
            'prenom',
            'email',
            'telephone',
            'service',
            'service_nom',
            'role',
            'role_nom',
            'date_embauche',
        ]