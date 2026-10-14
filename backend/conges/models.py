from django.db import models
from employes.models import Employe

# Create your models here.
class TypeConge(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    nombre_jours_max = models.PositiveIntegerField(default=10)
    actif = models.BooleanField(default=True)

    def __str__(self):
        return self.nom

class JourFerie(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    date = models.DateField(unique=True)

    def __str__(self):
        return f"{self.nom} - {self.date}"

class SoldeConge(models.Model):
    employe = models.ForeignKey(
        Employe,
        on_delete=models.CASCADE,
        related_name='soldes'
    )
    annee = models.PositiveIntegerField()
    jours_acquis = models.PositiveIntegerField(default=30)
    jours_pris = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['employe', 'annee'],
                name='unique_solde_employe_annee'
            )
        ]

    @property
    def jours_restants(self):
        return self.jours_acquis - self.jours_pris

    def __str__(self):
        return f"{self.employe} - {self.annee}"


class DemandeConge(models.Model):

    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('approuve', 'Approuvé'),
        ('refuse', 'Refusé'),
    ]

    employe = models.ForeignKey(
        Employe,
        on_delete=models.CASCADE,
        related_name='demandes_conges'
    )

    type_conge = models.ForeignKey(
        TypeConge,
        on_delete=models.PROTECT,
        related_name='demandes'
    )

    date_debut = models.DateField()
    date_fin = models.DateField()

    nombre_jours = models.PositiveIntegerField()

    motif = models.TextField(blank=True)

    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente'
    )

    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.employe} - "
            f"{self.date_debut} au {self.date_fin}"
        )







