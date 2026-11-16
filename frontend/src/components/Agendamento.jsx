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
  const [passoPagamento, setPassoPagamento] = useState(false);

  useEffect(() => {
    // Carrega categorias para o seletor manual
    api.get('categorias/').then(res => setCategorias(res.data));

    const handleSelecao = (e) => {
      setServico(e.detail.servico);
      setTagFoto(e.detail.tag);
    };
    window.addEventListener('selecionarServico', handleSelecao);

    const dataFormatada = dataSelecionada.toISOString().split('T')[0];
    api.get('horarios/').then(res => {
      setHorariosDisponiveis(res.data.filter(h => h.data === dataFormatada && h.disponivel === true));
    });
    return () => window.removeEventListener('selecionarServico', handleSelecao);
  }, [dataSelecionada]);

  const concluirNoWhatsApp = async () => {
    try {
      await api.post('agendamentos/', { cliente_nome: nome, horario: horarioEscolhido.id });

      // Lógica solicitada: se não tiver tag, coloca "Optou por decidir na hora"
      const referenciaTexto = tagFoto.trim() !== '' ? tagFoto : "Optou por decidir na hora";

      const msg = `Olá, agendei meu horario pelo site! %0A` +
                  `Nome: ${nome}%0A` +
                  `Serviço: ${servico}%0A` +
                  `Referência: ${referenciaTexto}%0A` +
                  `Data: ${dataSelecionada.toLocaleDateString()}%0A` +
                  `Horário: ${horarioEscolhido.hora.substring(0,5)}%0A` +
                  `Pode me passar o PIX para o pagamento da taxa de reserva?`;

      window.open(`https://wa.me/5562984450637?text=${msg}`, '_blank');
      window.location.reload();
    } catch (err) { alert('Erro ao agendar.'); }
  };

  return (
    <section id="agendamento-section" className="mt-8 mb-12 px-4 max-w-md mx-auto">
      <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">Agendamento</h2>
      
      {!passoPagamento ? (
        <div className="animate-in fade-in duration-500">
          <div className="bg-white p-4 rounded-3xl shadow-sm border mb-6">
            <Calendar onChange={setDataSelecionada} value={dataSelecionada} minDate={new Date()} className="border-none w-full" />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {horariosDisponiveis.map(h => (
              <button key={h.id} onClick={() => setHorarioEscolhido(h)}
                className={`p-3 rounded-2xl text-sm font-bold transition-all ${horarioEscolhido?.id === h.id ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-pink-600 border border-pink-100'}`}>
                {h.hora.substring(0, 5)}
              </button>
            ))}
          </div>

          {horarioEscolhido && (
            <form onSubmit={(e) => { e.preventDefault(); setPassoPagamento(true); }} className="bg-white p-6 rounded-[2.5rem] border border-pink-100 shadow-xl space-y-4">
              <input type="text" placeholder="Seu Nome Completo" required className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pink-300" value={nome} onChange={e => setNome(e.target.value)} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-pink-500 uppercase ml-2">Selecione o Serviço:</label>
                <select 
                  required 
                  className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
                  value={servico}
                  onChange={(e) => {
                    setServico(e.target.value);
                    if (tagFoto) setTagFoto(''); // Limpa a tag se ela trocar o serviço manualmente
                  }}
                >
                  <option value="">Escolha aqui...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              {tagFoto && (
                <div className="p-3 bg-pink-50 rounded-xl border border-pink-100 flex justify-between items-center">
                  <p className="text-[10px] text-pink-600 font-bold italic">Ref: {tagFoto}</p>
                  <button type="button" onClick={() => setTagFoto('')} className="text-[10px] text-red-400 font-bold underline">Remover</button>
                </div>
              )}

              <button type="submit" className="w-full bg-pink-600 text-white font-bold py-5 rounded-2xl shadow-lg">RESERVAR HORÁRIO</button>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-pink-200 shadow-2xl text-center">
          <h3 className="text-2xl font-black text-gray-800 mb-2">Taxa de Reserva</h3>
          <p className="text-sm text-gray-600 mb-8">Para garantir sua vaga, solicitamos o pagamento da taxa via WhatsApp.</p>
          <button onClick={concluirNoWhatsApp} className="w-full bg-green-500 text-white font-black py-5 rounded-2xl shadow-lg">SOLICITAR PIX NO WHATSAPP</button>
          <button onClick={() => setPassoPagamento(false)} className="mt-4 text-xs text-gray-400 font-bold">← Voltar</button>
        </div>
      )}
    </section>
  );
}