'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FixedFooter from '@/components/ui/FixedFooter'

// Types
interface WrappedFeature {
  id: string
  name: string
  icon: string
  description: string
  longDescription: string
}

export default function WrappedPage() {
  const router = useRouter()
  const [currentFeature, setCurrentFeature] = useState(0)
  const [wantsWrapped, setWantsWrapped] = useState(true)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const wrappedFeatures: WrappedFeature[] = [
    {
      id: 'gallery',
      name: 'Galeria de Imagens',
      icon: '📸',
      description: 'Transforme suas fotos favoritas em uma galeria de arte digital.',
      longDescription: 'Conte a história de seus momentos de uma forma visualmente deslumbrante.'
    },
    {
      id: 'starmap',
      name: 'Mapa de Estrelas',
      icon: '⭐',
      description: 'O céu exato de quando vocês se conheceram.',
      longDescription: 'Captura as estrelas da noite mais importante de suas vidas.'
    },
    {
      id: 'timeline',
      name: 'Timeline do Casal',
      icon: '⏰',
      description: 'A linha do tempo interativa do relacionamento.',
      longDescription: 'Reviva cada marco importante da jornada de vocês juntos.'
    },
    {
      id: 'roulette',
      name: 'Roleta Surpresa',
      icon: '🎰',
      description: 'Desafios e memórias aleatórias para descobrir.',
      longDescription: 'Uma experiência interativa que surpreende a cada giro.'
    },
    {
      id: 'timewrapped',
      name: 'Tempo Wrapped',
      icon: '💕',
      description: 'Estatísticas fofas do tempo que passaram juntos.',
      longDescription: 'Dados únicos e emocionantes sobre o relacionamento de vocês.'
    },
    {
      id: 'spacewrapped',
      name: 'Espaço Wrapped',
      icon: '🚀',
      description: 'Jornada cósmica da história de vocês.',
      longDescription: 'Uma experiência visual única através do universo do amor.'
    },
    {
      id: 'wordle',
      name: 'Jogo Wordle',
      icon: '🎮',
      description: 'Jogo personalizado com palavras especiais do casal.',
      longDescription: 'Diversão interativa com palavras que só vocês entendem.'
    },
    {
      id: 'worldmap',
      name: 'Mapa Mundi',
      icon: '🌍',
      description: 'Lugares especiais marcados no mapa do mundo.',
      longDescription: 'Visuarize todos os locais importantes da história de vocês.'
    }
  ]

  const faqs = [
    {
      question: 'Pagando R$ 4,90, eu levo todas as 8+ seções?',
      answer: 'Sim! Com o pacote Wrapped você tem acesso a todas as 8 seções exclusivas: Galeria de Imagens, Mapa de Estrelas, Timeline, Roleta Surpresa, Tempo Wrapped, Espaço Wrapped, Jogo Wordle e Mapa Mundi. É um upgrade completo por um preço simbólico!'
    },
    {
      question: 'Como eu vou configurar essas novas seções? É complicado?',
      answer: 'É muito simples! Após a compra, você terá acesso ao painel de edição exclusivo onde pode personalizar cada seção de forma intuitiva. Adicione fotos na galeria, escolha datas importantes para a timeline, escreva palavras especiais para o Wordle, tudo com cliques simples.'
    },
    {
      question: 'Eu preciso decidir agora? Posso adicionar o Wrapped depois?',
      answer: 'Recomendamos fortemente que adicione agora! O preço promocional de R$ 4,90 é válido apenas durante a criação. Depois o Wrapped custa R$ 14,90. Além disso, configurar tudo junto garante uma experiência mais completa e organizada.'
    },
    {
      question: 'Vale a pena? Qual a diferença real?',
      answer: 'Absolutamente! 9 em 10 dos nossos clientes mais satisfeitos relatam que o Wrapped foi a parte que mais emocionou. São 8 experiências interativas adicionais que transformam um presente bonito em algo verdadeiramente inesquecível e único.'
    },
    {
      question: 'Funciona em qualquer celular?',
      answer: 'Sim! O Wrapped é 100% responsivo e funciona perfeitamente em qualquer smartphone, tablet ou computador. A experiência é otimizada especialmente para mobile, garantindo navegação suave e visual impecável.'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % wrappedFeatures.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleContinue = () => {
    // Store wrapped choice in localStorage
    const storedData = localStorage.getItem('onboardingData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        const updatedData = {
          ...data,
          wrappedAddon: wantsWrapped
        }
        localStorage.setItem('onboardingData', JSON.stringify(updatedData))
      } catch (error) {
        console.error('Error updating stored data:', error)
      }
    }

    // Navigate to checkout
    router.push('/checkout')
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % wrappedFeatures.length)
  }

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + wrappedFeatures.length) % wrappedFeatures.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pb-24 md:pb-20">
      {/* Promo Header */}
      <div className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2">
        <p className="text-sm font-medium">
          🔥 <span className="font-bold">Somente hoje 02/12</span> - todos os planos com 50% de desconto, <span className="font-bold">Não Perca!</span> 🔥
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💕</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                LoveFrame
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-purple-500 rounded"></div>
              <div className="w-8 h-1 bg-purple-500 rounded"></div>
              <div className="w-8 h-1 bg-purple-500 rounded"></div>
              <div className="w-8 h-1 bg-purple-300 rounded"></div>
              <span className="text-sm text-gray-500 ml-2">Passo 3 de 4</span>
            </div>
            <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
              Ajuda
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header with Panda */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-4xl">🐼</span>
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Quase pronto! Seu presente está lindo, mas a <span className="font-semibold text-purple-600">verdadeira mágica</span> está na 
              <span className="font-bold text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Retrospectiva Wrapped</span> e nas 
              <span className="font-semibold text-purple-600"> 8+ seções extras</span>. Não deixe a melhor parte de fora!
            </p>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 max-w-5xl mx-auto">
          {/* Mock Phone */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-[2.3rem] relative overflow-hidden">
                  {/* Phone Content */}
                  <div className="absolute inset-0 flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 border border-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Feature Content */}
                    <div className="flex-1 px-6 py-4">
                      <div className="text-center mb-6">
                        <div className="text-6xl mb-3">
                          {wrappedFeatures[currentFeature].icon}
                        </div>
                        <h3 className="text-white text-lg font-bold mb-2">
                          {wrappedFeatures[currentFeature].name}
                        </h3>
                        <p className="text-purple-200 text-sm">
                          {wrappedFeatures[currentFeature].description}
                        </p>
                      </div>
                      
                      {/* Visual Content */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
                        <div className="space-y-3">
                          <div className="h-3 bg-white/30 rounded animate-pulse"></div>
                          <div className="h-3 bg-white/20 rounded w-3/4 animate-pulse"></div>
                          <div className="h-3 bg-white/25 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Description */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                  {wrappedFeatures[currentFeature].icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {wrappedFeatures[currentFeature].name}
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {wrappedFeatures[currentFeature].description}
              </p>
              <p className="text-gray-500">
                {wrappedFeatures[currentFeature].longDescription}
              </p>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex items-center justify-between">
              <button 
                onClick={prevFeature}
                className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex space-x-2">
                {wrappedFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentFeature ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button 
                onClick={nextFeature}
                className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <button
              onClick={() => setWantsWrapped(true)}
              className={`w-full max-w-lg mx-auto block px-8 py-6 rounded-2xl font-bold text-lg transition-all duration-300 relative ${
                wantsWrapped 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-2xl transform scale-105' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                  ⭐ Mais escolhido
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <span>Quero a experiência completa (+R$ 4,90)</span>
                <span className="text-2xl">📱</span>
              </div>
              <div className="text-sm opacity-90 mt-1">
                8+ seções interativas • Valor promocional
              </div>
            </button>
            
            <button
              onClick={() => setWantsWrapped(false)}
              className={`block mx-auto px-6 py-3 rounded-xl font-medium transition-colors ${
                !wantsWrapped 
                  ? 'bg-gray-200 text-gray-800' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Não, quero o presente básico
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
              💜 DÚVIDAS FREQUENTES
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas sobre o Pacote Wrapped</h2>
            <p className="text-gray-600">Tudo o que você precisa saber antes de finalizar</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedFAQ === index ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Fixed Footer */}
      <FixedFooter
        singleButton={true}
        singleButtonLabel="Continuar"
        singleButtonOnClick={handleContinue}
        helperText={`${wantsWrapped ? '📱 Experiência completa selecionada' : '📦 Presente básico selecionado'} • Pagamento seguro`}
      />
    </div>
  )
}
