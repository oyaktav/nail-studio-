from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, PortfolioViewSet, HorarioDisponivelViewSet, AgendamentoViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'portfolio', PortfolioViewSet)
router.register(r'horarios', HorarioDisponivelViewSet)
router.register(r'agendamentos', AgendamentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]