
from rest_framework import serializers
from .models import Categoria, Portfolio, HorarioDisponivel, Agendamento


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class PortfolioSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.ReadOnlyField(source='categoria.nome')

    class Meta:
        model = Portfolio
        fields = '__all__'


class HorarioDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioDisponivel
        fields = '__all__'


class AgendamentoSerializer(serializers.ModelSerializer):
    referencia_cliente_url = serializers.SerializerMethodField()

    class Meta:
        model = Agendamento
        fields = '__all__'
        read_only_fields = ['status', 'criado_em']

    def get_referencia_cliente_url(self, obj):
        if not obj.referencia_cliente:
            return None

        url = obj.referencia_cliente.url
        request = self.context.get('request')

        if request:
            return request.build_absolute_uri(url)

        return url

    def validate_referencia_cliente(self, imagem):
        if imagem:
            if imagem.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    'A imagem deve ter no máximo 5 MB.'
                )

            if imagem.content_type not in [
                'image/jpeg',
                'image/png',
                'image/webp'
            ]:
                raise serializers.ValidationError(
                    'Envie uma imagem JPG, PNG ou WEBP.'
                )

        return imagem
