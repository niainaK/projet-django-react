from django.db import models


class Role(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom


class Service(models.Model):
    nom = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.nom


class Employe(models.Model):
    matricule = models.CharField(max_length=50, unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    telephone = models.CharField(max_length=30, blank=True)

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name='employes'
    )

    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name='employes'
    )

    date_embauche = models.DateField()

    def __str__(self):
        return f"{self.nom} {self.prenom}"