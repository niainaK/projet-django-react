from rest_framework.routers import DefaultRouter

from .views import (
    TypeCongeViewSet,
    JourFerieViewSet,
    SoldeCongeViewSet,
    DemandeCongeViewSet,
)


router = DefaultRouter()

router.register('types-conges', TypeCongeViewSet)
router.register('jours-feries', JourFerieViewSet)
router.register('soldes', SoldeCongeViewSet)
router.register('demandes', DemandeCongeViewSet)

urlpatterns = router.urls