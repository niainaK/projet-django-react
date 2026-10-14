from rest_framework.routers import DefaultRouter

from .views import (
    RoleViewSet,
    ServiceViewSet,
    EmployeViewSet,
)


router = DefaultRouter()

router.register('roles', RoleViewSet)
router.register('services', ServiceViewSet)
router.register('employes', EmployeViewSet)

urlpatterns = router.urls