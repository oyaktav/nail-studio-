import { MapPin, Phone } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo / Nome */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Mila<span className="text-pink-500">Silva</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">Nail Studio</p>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="flex gap-3">
          <a href="#localizacao" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition">
            <MapPin size={20} />
          </a>
          <a href="https://wa.me/559999999999" target="_blank" rel="noreferrer" className="p-2 bg-pink-50 rounded-full text-pink-500 hover:bg-pink-100 transition">
            <Phone size={20} />
          </a>
        </div>

      </div>
    </header>
  );
}