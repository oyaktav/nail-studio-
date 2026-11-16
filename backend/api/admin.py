from django.contrib import admin
from .models import Categoria, Portfolio, HorarioDisponivel, Agendamento

admin.site.register(Categoria)
admin.site.register(Portfolio)

@admin.register(HorarioDisponivel)
class HorarioDisponivelAdmin(admin.ModelAdmin):
    list_display = ('data', 'hora', 'disponivel')
    list_filter = ('data', 'disponivel')

@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    list_display = ('cliente_nome', 'horario', 'status', 'criado_em')
    list_filter = ('status', 'horario__data')