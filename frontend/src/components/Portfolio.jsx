import { useState, useEffect } from 'react';
import api from '../api';
import { X, CheckCircle } from 'lucide-react';

export default function Portfolio() {
  const [categorias, setCategorias] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('');
  const [fotoZoom, setFotoZoom] = useState(null);

  useEffect(() => {
    api.get('categorias/').then((res) => {
      setCategorias(res.data);
      if (res.data.length > 0) setAbaAtiva(res.data[0].id);
    });
    api.get('portfolio/').then((res) => setPortfolio(res.data));
  }, []);

  const selecionarEstilo = (foto) => {
    const nomeCategoria = categorias.find(c => c.id === foto.categoria)?.nome;
    const evento = new CustomEvent('selecionarServico', { 
      detail: { servico: nomeCategoria, tag: foto.descricao } 
    });
    window.dispatchEvent(evento);
    setFotoZoom(null);
    document.getElementById('agendamento-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mt-8 px-2">
      <h2 className="text-xl font-bold text-gray-800 mb-4 px-2 tracking-tight">Nosso Trabalho</h2>
      
      <div className="flex overflow-x-auto gap-2 pb-2 px-2 scrollbar-hide">
        {categorias.map((cat) => (
          <button key={cat.id} onClick={() => setAbaAtiva(cat.id)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
              abaAtiva === cat.id ? 'bg-pink-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            {cat.nome}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 px-2">
        {portfolio.filter(f => f.categoria === abaAtiva).map((foto) => (
          <div key={foto.id} className="rounded-2xl overflow-hidden shadow-sm bg-white" onClick={() => setFotoZoom(foto)}>
           <img 
  src={foto.imagem.startsWith('http') ? foto.imagem : `http://127.0.0.1:8000${foto.imagem}`} 
  alt={foto.descricao} 
/>
          </div>
        ))}
      </div>

      {fotoZoom && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setFotoZoom(null)} className="absolute top-6 right-6 p-2 text-white"><X size={35} /></button>
          <div className="flex flex-col items-center w-full max-w-sm">
            <img src={fotoZoom.imagem} className="w-full rounded-3xl shadow-2xl border-2 border-white/20" alt="Zoom" />
            <p className="text-white mt-4 text-xl font-bold">{fotoZoom.descricao}</p>
            <button onClick={() => selecionarEstilo(fotoZoom)} className="mt-6 w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition">
              <CheckCircle size={20} className="inline mr-2" /> QUERO ESTE ESTILO
            </button>
          </div>
        </div>
      )}
    </section>
  );
}