
from django.db import models


class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class Portfolio(models.Model):
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name='fotos'
    )
    imagem = models.ImageField(upload_to='portfolio/')
    descricao = models.CharField(
        max_length=100,
        help_text="Nome da arte (ex: Francesinha Rosa) que servirá como Tag"
    )

    def __str__(self):
        return f"{self.descricao} ({self.categoria.nome})"


class HorarioDisponivel(models.Model):
    data = models.DateField()
    hora = models.TimeField()
    disponivel = models.BooleanField(default=True)

    def __str__(self):
        status = 'Livre' if self.disponivel else 'Ocupado'
        return f"{self.data} às {self.hora} - {status}"


class Agendamento(models.Model):
    STATUS_CHOICES = (
        ('pendente', 'Pendente'),
        ('confirmado', 'Confirmado'),
        ('cancelado', 'Cancelado'),
    )

    cliente_nome = models.CharField(max_length=150)

    horario = models.ForeignKey(
        HorarioDisponivel,
        on_delete=models.CASCADE
    )

    foto_inspiracao_portfolio = models.ForeignKey(
        Portfolio,
        on_delete=models.SET_NULL,
        blank=True,
        null=True
    )

    referencia_cliente = models.ImageField(
        upload_to='referencias_clientes/',
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente'
    )

    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cliente_nome} - {self.horario}"
