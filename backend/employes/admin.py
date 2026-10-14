from django.contrib import admin
from .models import Role, Service, Employe

# Register your models here.

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom')
    search_fields = ('nom',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'nom')
    search_fields = ('nom',)


@admin.register(Employe)
class EmployeAdmin(admin.ModelAdmin):
    list_display = (
        'matricule',
        'nom',
        'prenom',
        'email',
        'telephone',
        'service',
        'role',
        'date_embauche',
    )

    list_filter = ('service', 'role')
    search_fields = (
        'matricule',
        'nom',
        'prenom',
        'email',
    )

