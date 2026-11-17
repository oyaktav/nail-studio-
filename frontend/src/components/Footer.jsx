import { MapPin, Phone, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="localizacao" className="mt-12 bg-white border-t border-pink-100 p-8 text-center shadow-inner rounded-t-3xl max-w-md mx-auto">
      <h3 className="font-bold text-gray-800 text-xl mb-6 tracking-tight">
        Nail<span className="text-pink-500">Studio</span>
      </h3>
      
      <div className="flex flex-col gap-4 text-sm text-gray-600 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-pink-50 rounded-full">
            <MapPin size={20} className="text-pink-500" />
          </div>
          <p className="text-left leading-tight">
            <strong>Onde estamos:</strong><br/>
            Rua da Beleza, 123<br/>
            Centro - Sua Cidade
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="p-2 bg-pink-50 rounded-full">
            <Phone size={20} className="text-pink-500" />
          </div>
          <p className="text-left leading-tight">
            <strong>Telemóvel / WhatsApp:</strong><br/>
            +55 62 993660595
          </p>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="flex justify-center gap-4 mb-6">
        <a href="#" className="p-3 bg-pink-500 rounded-full text-white hover:bg-pink-600 transition shadow-md transform hover:scale-105">
          <Instagram size={24} />
        </a>
        <a href="https://wa.me/5562993660595" target="_blank" rel="noreferrer" className="p-3 bg-green-500 rounded-full text-white hover:bg-green-600 transition shadow-md transform hover:scale-105">
          <Phone size={24} />
        </a>
      </div>
      
      <p className="text-xs text-gray-400 font-medium">© 2026 NailStudio. Todos os direitos reservados.</p>
    </footer>
  );
}