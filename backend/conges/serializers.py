from datetime import timedelta

from rest_framework import serializers

from .models import (
    TypeConge,
    JourFerie,
    SoldeConge,
    DemandeConge,
)


class TypeCongeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeConge
        fields = '__all__'


class JourFerieSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourFerie
        fields = '__all__'


class SoldeCongeSerializer(serializers.ModelSerializer):
    jours_restants = serializers.ReadOnlyField()

    class Meta:
        model = SoldeConge
        fields = '__all__'


class DemandeCongeSerializer(serializers.ModelSerializer):

    employe_nom = serializers.SerializerMethodField()

    type_conge_nom = serializers.CharField(
        source='type_conge.nom',
        read_only=True
    )

    class Meta:
        model = DemandeConge

        fields = [
            'id',
            'employe',
            'employe_nom',
            'type_conge',
            'type_conge_nom',
            'date_debut',
            'date_fin',
            'nombre_jours',
            'motif',
            'statut',
            'date_creation',
        ]

        read_only_fields = [
            'nombre_jours',
            'statut',
            'date_creation',
        ]

    def get_employe_nom(self, obj):

        return f"{obj.employe.nom} {obj.employe.prenom}"

    def validate(self, data):

        date_debut = data.get('date_debut')
        date_fin = data.get('date_fin')
        employe = data.get('employe')
        type_conge = data.get('type_conge')

        if date_fin < date_debut:

            raise serializers.ValidationError({
                'date_fin':
                    'La date de fin doit être après la date de début.'
            })

        jours_feries = set(
            JourFerie.objects.filter(
                date__range=[date_debut, date_fin]
            ).values_list('date', flat=True)
        )

        nombre_jours = 0

        date_actuelle = date_debut

        while date_actuelle <= date_fin:

            if (
                date_actuelle.weekday() < 5
                and date_actuelle not in jours_feries
            ):
                nombre_jours += 1

            date_actuelle += timedelta(days=1)

        if nombre_jours == 0:

            raise serializers.ValidationError({
                'date_debut':
                    'La période sélectionnée ne contient aucun jour ouvrable.'
            })

        if nombre_jours > type_conge.nombre_jours_max:

            raise serializers.ValidationError({
                'date_fin':
                    f'Cette demande dépasse la limite de '
                    f'{type_conge.nombre_jours_max} jours.'
            })

        annee = date_debut.year

        solde = SoldeConge.objects.filter(
            employe=employe,
            annee=annee
        ).first()

        if solde is None:

            solde = SoldeConge.objects.create(
                employe=employe,
                annee=annee,
                jours_acquis=30,
                jours_pris=0
            )

        if solde.jours_restants < nombre_jours:

            raise serializers.ValidationError({
                'employe':
                    f'Solde insuffisant. '
                    f'Il reste seulement '
                    f'{solde.jours_restants} jour(s).'
            })

        data['nombre_jours'] = nombre_jours

        return data