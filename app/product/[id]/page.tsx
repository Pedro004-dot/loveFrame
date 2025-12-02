'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// Dados de exemplo (depois virá do banco/API)
const mockUserData = {
  leonardo: {
    creatorName: "Leonardo",
    partnerName: "Yasmin",
    relationshipStart: "2022-01-15",
    coupleName: "Leonardo e Yasmin",
    song: {
      title: "Still Loving You",
      artist: "Scorpions",
      duration: "4:48"
    },
    photos: {
      main: "https://via.placeholder.com/400x600/ff69b4/ffffff?text=Casal",
      dates: [
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Date+1",
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Date+2",
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Date+3"
      ],
      random: [
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Random+1",
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Random+2", 
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Random+3"
      ],
      travel: [
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Viagem+1",
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Viagem+2",
        "https://via.placeholder.com/300x200/ff69b4/ffffff?text=Viagem+3"
      ]
    },
    specialMessage: "E pensar que tudo começou do nada... ✨ Olha só pra gente agora: escrevendo nossa própria história, que-"
  }
};

export default function ProductPage() {
  const params = useParams();
  const [showGift, setShowGift] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [timeStats, setTimeStats] = useState({ years: 0, months: 0, days: 0 });

  useEffect(() => {
    // Buscar dados do usuário (mock por enquanto)
    const id = params.id as string;
    const data = mockUserData[id as keyof typeof mockUserData] || mockUserData.leonardo;
    setUserData(data);

    // Calcular tempo de relacionamento
    if (data) {
      const startDate = new Date(data.relationshipStart);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - startDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      const days = diffDays % 30;
      
      setTimeStats({ years, months, days });
    }
  }, [params.id]);

  if (!userData) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>;
  }

  if (showGift) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <button className="text-white text-xl">×</button>
          <div className="bg-green-500 px-4 py-1 rounded-full text-black font-semibold">
            Wrapped
          </div>
          <div className="text-white">•••</div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {userData.creatorName} separou um{' '}
            <span className="text-green-400">presente</span> especial!
          </h1>
          
          <p className="text-gray-300 mb-12 max-w-md">
            Um momento único feito com carinho para celebrar a jornada de vocês
          </p>
          
          <button 
            onClick={() => setShowGift(false)}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Ver Presente
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around py-6 border-t border-gray-800">
          <div className="text-center">
            <div className="text-2xl mb-1">🏠</div>
            <div className="text-xs text-gray-400">Início</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔍</div>
            <div className="text-xs text-gray-400">Pesquisar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-xs text-gray-400">Sua biblioteca</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Header com música */}
      <div className="bg-gradient-to-b from-blue-800 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button className="text-white">←</button>
          <h1 className="font-bold">Juntos para sempre ❤️</h1>
          <button className="text-white">•••</button>
        </div>
        
        {/* Player de música */}
        <div className="bg-blue-800/50 rounded-xl p-4 mb-4">
          <img 
            src={userData.photos.main} 
            alt="Foto do casal" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">{userData.song.title}</h2>
              <p className="text-blue-200">{userData.song.artist}</p>
            </div>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-800 text-xl">▶️</span>
            </button>
          </div>
          
          <div className="flex items-center mt-3">
            <span className="text-sm text-blue-200">0:00</span>
            <div className="flex-1 mx-3">
              <div className="w-full bg-blue-600 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-0"></div>
              </div>
            </div>
            <span className="text-sm text-blue-200">-{userData.song.duration}</span>
          </div>
          
          <div className="flex justify-center items-center mt-4 space-x-6">
            <button className="text-white text-xl">🔀</button>
            <button className="text-white text-2xl">⏮️</button>
            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-800 text-xl">⏸️</span>
            </button>
            <button className="text-white text-2xl">⏭️</button>
            <button className="text-white text-xl">🔁</button>
          </div>
        </div>
      </div>

      {/* Sobre o casal */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sobre o casal</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{userData.coupleName}</h3>
          <p className="text-gray-700 mb-4">Juntos desde 2022</p>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">{timeStats.years}</div>
              <div className="text-sm text-gray-600">Anos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{timeStats.months}</div>
              <div className="text-sm text-gray-600">Meses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{timeStats.days}</div>
              <div className="text-sm text-gray-600">Dias</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">11</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">3</div>
            </div>
          </div>
        </div>

        {/* Mensagem especial */}
        <div className="bg-blue-600 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-2">Mensagem especial</h3>
          <p className="text-white mb-4">{userData.specialMessage}</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            Mostrar Mensagem
          </button>
        </div>

        {/* Conheça o casal */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4">
          <h3 className="text-white font-bold mb-4">Conheça {userData.coupleName}</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <img 
                src={userData.photos.dates[0]} 
                alt="Nossos Dates" 
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <p className="text-white text-xs">Nossos Dates</p>
            </div>
            <div className="text-center">
              <img 
                src={userData.photos.random[0]} 
                alt="Fotos aleatórias" 
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <p className="text-white text-xs">Fotos aleatórias</p>
            </div>
            <div className="text-center">
              <img 
                src={userData.photos.travel[0]} 
                alt="Primeira viagem" 
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <p className="text-white text-xs">Primeira viagem</p>
            </div>
          </div>
        </div>

        {/* Seu Relacionamento Wrapped */}
        <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-6 text-white text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">💕</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Seu Relacionamento Wrapped</h2>
          <p className="text-pink-100 mb-4">Explore o seu tempo em casal</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            Vamos lá
          </button>
        </div>
      </div>
    </div>
  );
}