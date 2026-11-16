import Header from './components/Header';
import Portfolio from './components/Portfolio';
import Agendamento from './components/Agendamento';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      
      <main className="max-w-md mx-auto p-2 pb-10">
        {/* Mensagem de Boas-vindas */}
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-6 shadow-sm border border-pink-100 text-center mx-2 mt-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bem-vinda! 💅</h2>
          <p className="text-sm text-gray-600 font-medium">
            Selecione um serviço abaixo ou agende o seu horário.
          </p>
        </div>

        {/* Portfólio puxando do Django */}
        <Portfolio />

        {/* Sistema de Calendário e Agendamento */}
        <Agendamento />
      </main>

      {/* Rodapé com Contactos */}
      <Footer />
    </div>
  );
}

export default App;