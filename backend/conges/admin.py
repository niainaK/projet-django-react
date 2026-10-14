from django.contrib import admin

# Register your models here.
from .models import (
    TypeConge,
    JourFerie,
    SoldeConge,
    DemandeConge,
)


@admin.register(TypeConge)
class TypeCongeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nom',
        'nombre_jours_max',
        'actif',
    )

    list_filter = ('actif',)
    search_fields = ('nom',)


@admin.register(JourFerie)
class JourFerieAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'nom',
        'date',
    )

    list_filter = ('date',)
    search_fields = ('nom',)


@admin.register(SoldeConge)
class SoldeCongeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'employe',
        'annee',
        'jours_acquis',
        'jours_pris',
        'jours_restants',
    )

    list_filter = ('annee',)
    search_fields = (
        'employe__nom',
        'employe__prenom',
        'employe__matricule',
    )


@admin.register(DemandeConge)
class DemandeCongeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'employe',
        'type_conge',
        'date_debut',
        'date_fin',
        'nombre_jours',
        'statut',
        'date_creation',
    )

    list_filter = (
        'statut',
        'type_conge',
    )

    search_fields = (
        'employe__nom',
        'employe__prenom',
        'employe__matricule',
        'motif',
    )

    readonly_fields = ('date_creation',)