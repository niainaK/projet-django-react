from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from .models import (
    TypeConge,
    JourFerie,
    SoldeConge,
    DemandeConge,
)

from .serializers import (
    TypeCongeSerializer,
    JourFerieSerializer,
    SoldeCongeSerializer,
    DemandeCongeSerializer,
)


class TypeCongeViewSet(viewsets.ModelViewSet):
    queryset = TypeConge.objects.all()
    serializer_class = TypeCongeSerializer


class JourFerieViewSet(viewsets.ModelViewSet):
    queryset = JourFerie.objects.all()
    serializer_class = JourFerieSerializer


class SoldeCongeViewSet(viewsets.ModelViewSet):
    queryset = SoldeConge.objects.all()
    serializer_class = SoldeCongeSerializer


class DemandeCongeViewSet(viewsets.ModelViewSet):
    queryset = DemandeConge.objects.all()
    serializer_class = DemandeCongeSerializer

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def approuver(self, request, pk=None):

        demande = self.get_object()

        # Vérifier que la demande est encore en attente
        if demande.statut != 'en_attente':
            return Response(
                {
                    'erreur': (
                        'Cette demande a déjà été traitée.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        annee = demande.date_debut.year

        # Récupérer le solde de l'employé
        solde = SoldeConge.objects.select_for_update().filter(
            employe=demande.employe,
            annee=annee
        ).first()

        # Créer le solde s'il n'existe pas
        if solde is None:
            solde = SoldeConge.objects.create(
                employe=demande.employe,
                annee=annee,
                jours_acquis=30,
                jours_pris=0
            )

        # Vérifier le solde
        if solde.jours_restants < demande.nombre_jours:
            return Response(
                {
                    'erreur': (
                        f'Solde insuffisant. '
                        f'Il reste {solde.jours_restants} jour(s).'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Retirer les jours du solde
        solde.jours_pris += demande.nombre_jours
        solde.save()

        # Modifier le statut
        demande.statut = 'approuve'
        demande.save()

        return Response(
            {
                'message': 'Demande approuvée avec succès.',
                'demande_id': demande.id,
                'jours_deduits': demande.nombre_jours,
                'jours_restants': solde.jours_restants,
                'statut': demande.statut
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def refuser(self, request, pk=None):

        demande = self.get_object()

        # Vérifier que la demande est encore en attente
        if demande.statut != 'en_attente':
            return Response(
                {
                    'erreur': (
                        'Cette demande a déjà été traitée.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Refuser la demande
        demande.statut = 'refuse'
        demande.save()

        return Response(
            {
                'message': 'Demande refusée.',
                'demande_id': demande.id,
                'jours_deduits': 0,
                'statut': demande.statut
            },
            status=status.HTTP_200_OK
        )