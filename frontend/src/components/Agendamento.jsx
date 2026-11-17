
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api';

export default function Agendamento() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horarioEscolhido, setHorarioEscolhido] = useState(null);
  const [categorias, setCategorias] = useState([]);

  const [nome, setNome] = useState('');
  const [servico, setServico] = useState('');
  const [tagFoto, setTagFoto] = useState('');

  const [fotoCliente, setFotoCliente] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  const [passoPagamento, setPassoPagamento] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    api.get('categorias/')
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Erro ao carregar categorias:', err));

    const handleSelecao = (e) => {
      setServico(e.detail.servico);
      setTagFoto(e.detail.tag);
    };

    window.addEventListener('selecionarServico', handleSelecao);

    return () => {
      window.removeEventListener('selecionarServico', handleSelecao);
    };
  }, []);

  useEffect(() => {
    const ano = dataSelecionada.getFullYear();
    const mes = String(dataSelecionada.getMonth() + 1).padStart(2, '0');
    const dia = String(dataSelecionada.getDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;

    setHorarioEscolhido(null);

    api.get('horarios/')
      .then(res => {
        setHorariosDisponiveis(
          res.data.filter(
            h => h.data === dataFormatada && h.disponivel === true
          )
        );
      })
      .catch(err => console.error('Erro ao carregar horários:', err));
  }, [dataSelecionada]);

  const selecionarFoto = (e) => {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    const formatosPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!formatosPermitidos.includes(arquivo.type)) {
      alert('Selecione uma imagem JPG, PNG ou WEBP.');
      e.target.value = '';
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5 MB.');
      e.target.value = '';
      return;
    }

    setFotoCliente(arquivo);
    setTagFoto('');

    if (previewFoto) {
      URL.revokeObjectURL(previewFoto);
    }

    setPreviewFoto(URL.createObjectURL(arquivo));
  };

  const removerFoto = () => {
    setFotoCliente(null);

    if (previewFoto) {
      URL.revokeObjectURL(previewFoto);
    }

    setPreviewFoto(null);
  };

  useEffect(() => {
    return () => {
      if (previewFoto) {
        URL.revokeObjectURL(previewFoto);
      }
    };
  }, [previewFoto]);

  const concluirNoWhatsApp = async () => {
    if (enviando) return;

    if (!nome.trim() || !servico || !horarioEscolhido) {
      alert('Preencha os dados do agendamento.');
      return;
    }

    // Abrir a aba durante o clique evita bloqueio de pop-ups.
    const abaWhatsApp = window.open('', '_blank');

    setEnviando(true);

    try {
      const dados = new FormData();

      dados.append('cliente_nome', nome.trim());
      dados.append('horario', horarioEscolhido.id);

      if (fotoCliente) {
        dados.append('referencia_cliente', fotoCliente);
      }

      const resposta = await api.post('agendamentos/', dados);

      const agendamento = resposta.data;

      const referenciaTexto = fotoCliente
        ? 'Foto enviada pela cliente'
        : tagFoto.trim() !== ''
          ? tagFoto
          : 'Optou por decidir na hora';

      const linhas = [
        'Olá, agendei meu horário pelo site!',
        '',
        `Nome: ${nome.trim()}`,
        `Serviço: ${servico}`,
        `Referência: ${referenciaTexto}`,
        `Data: ${dataSelecionada.toLocaleDateString('pt-BR')}`,
        `Horário: ${horarioEscolhido.hora.substring(0, 5)}`
      ];

      if (fotoCliente) {
        if (!agendamento.referencia_cliente_url) {
          throw new Error('A imagem não retornou um link.');
        }

        linhas.push(
          `Imagem da referência: ${agendamento.referencia_cliente_url}`
        );
      }

      linhas.push(
        '',
        'Pode me passar o PIX para o pagamento da taxa de reserva?'
      );

      const mensagem = encodeURIComponent(linhas.join('\n'));

      const urlWhatsApp =
        `https://wa.me/5562984450637?text=${mensagem}`;

      if (abaWhatsApp) {
        abaWhatsApp.location.href = urlWhatsApp;
      } else {
        window.location.href = urlWhatsApp;
      }

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (err) {
      if (abaWhatsApp && !abaWhatsApp.closed) {
        abaWhatsApp.close();
      }

      console.error('Erro ao agendar:', err);

      const mensagemErro =
        err.response?.data?.horario ||
        err.response?.data?.referencia_cliente?.[0] ||
        'Não foi possível concluir o agendamento. Tente novamente.';

      alert(mensagemErro);

    } finally {
      setEnviando(false);
    }
  };

  return (
    <section
      id="agendamento-section"
      className="mt-8 mb-12 px-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">
        Agendamento
      </h2>

      {!passoPagamento ? (
        <div className="animate-in fade-in duration-500">

          <div className="bg-white p-4 rounded-3xl shadow-sm border mb-6">
            <Calendar
              onChange={setDataSelecionada}
              value={dataSelecionada}
              minDate={new Date()}
              className="border-none w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {horariosDisponiveis.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHorarioEscolhido(h)}
                className={`p-3 rounded-2xl text-sm font-bold transition-all ${
                  horarioEscolhido?.id === h.id
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-white text-pink-600 border border-pink-100'
                }`}
              >
                {h.hora.substring(0, 5)}
              </button>
            ))}
          </div>

          {horarioEscolhido && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPassoPagamento(true);
              }}
              className="bg-white p-6 rounded-[2.5rem] border border-pink-100 shadow-xl space-y-4"
            >
              <input
                type="text"
                placeholder="Seu Nome Completo"
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pink-300"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-pink-500 uppercase ml-2">
                  Selecione o Serviço:
                </label>

                <select
                  required
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
                  value={servico}
                  onChange={(e) => {
                    setServico(e.target.value);
                    setTagFoto('');
                  }}
                >
                  <option value="">Escolha aqui...</option>

                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.nome}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              {tagFoto && (
                <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 flex justify-between items-center">
                  <p className="text-[10px] text-pink-600 font-bold italic">
                    Ref: {tagFoto}
                  </p>

                  <button
                    type="button"
                    onClick={() => setTagFoto('')}
                    className="text-[10px] text-red-400 font-bold underline"
                  >
                    Remover
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700">
                  Tem uma inspiração para suas unhas?
                </label>

                <p className="text-xs text-gray-500">
                  Envie uma foto da sua galeria ou escolha uma referência
                  do nosso portfólio. É opcional!
                </p>

                {!fotoCliente ? (
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 cursor-pointer hover:bg-pink-100 transition-all">
                    <span className="text-2xl">📷</span>

                    <span className="text-sm font-bold text-pink-600">
                      Adicionar minha referência
                    </span>

                    <span className="text-[10px] text-gray-500">
                      JPG, PNG ou WEBP — até 5 MB
                    </span>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={selecionarFoto}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="rounded-2xl border border-pink-100 bg-pink-50 p-3">
                    <img
                      src={previewFoto}
                      alt="Prévia da sua referência"
                      className="w-full max-h-64 object-contain rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={removerFoto}
                      className="mt-3 text-xs text-red-500 font-bold underline"
                    >
                      Remover imagem
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white font-bold py-5 rounded-2xl shadow-lg"
              >
                RESERVAR HORÁRIO
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-pink-200 shadow-2xl text-center">
          <h3 className="text-2xl font-black text-gray-800 mb-2">
            Taxa de Reserva
          </h3>

          <p className="text-sm text-gray-600 mb-8">
            Para garantir sua vaga, solicitamos o pagamento da taxa via WhatsApp.
          </p>

          <button
            type="button"
            onClick={concluirNoWhatsApp}
            disabled={enviando}
            className="w-full bg-green-500 text-white font-black py-5 rounded-2xl shadow-lg disabled:opacity-50"
          >
            {enviando
              ? 'ENVIANDO AGENDAMENTO...'
              : 'SOLICITAR PIX NO WHATSAPP'}
          </button>

          <button
            type="button"
            onClick={() => setPassoPagamento(false)}
            disabled={enviando}
            className="mt-4 text-xs text-gray-400 font-bold"
          >
            ← Voltar
          </button>
        </div>
      )}
    </section>
  );
}
