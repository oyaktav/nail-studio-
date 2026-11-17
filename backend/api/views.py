
from django.db import transaction
from rest_framework import viewsets, serializers
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from .models import Categoria, Portfolio, HorarioDisponivel, Agendamento
from .serializers import (
    CategoriaSerializer,
    PortfolioSerializer,
    HorarioDisponivelSerializer,
    AgendamentoSerializer
)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer


class HorarioDisponivelViewSet(viewsets.ModelViewSet):
    queryset = HorarioDisponivel.objects.filter(disponivel=True)
    serializer_class = HorarioDisponivelSerializer


class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser
    ]

    def perform_create(self, serializer):
        with transaction.atomic():
            horario_id = serializer.validated_data['horario'].id

            horario = HorarioDisponivel.objects.select_for_update().get(
                id=horario_id
            )

            if not horario.disponivel:
                raise serializers.ValidationError({
                    'horario': 'Este horário já foi reservado. Escolha outro.'
                })

            serializer.save(horario=horario)

            horario.disponivel = False
            horario.save(update_fields=['disponivel'])
