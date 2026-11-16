from rest_framework import viewsets
from .models import Categoria, Portfolio, HorarioDisponivel, Agendamento
from .serializers import CategoriaSerializer, PortfolioSerializer, HorarioDisponivelSerializer, AgendamentoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer

class HorarioDisponivelViewSet(viewsets.ModelViewSet):
    # O React só vai ver os horários que ainda estão com disponivel=True
    queryset = HorarioDisponivel.objects.filter(disponivel=True)
    serializer_class = HorarioDisponivelSerializer

class AgendamentoViewSet(viewsets.ModelViewSet):
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer

    def perform_create(self, serializer):
        # Salva o agendamento
        agendamento = serializer.save()
        
        # Pega o horário que foi escolhido
        horario = agendamento.horario
        
        # Marca como indisponível e salva no banco
        horario.disponivel = False
        horario.save()