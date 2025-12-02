'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FixedFooter from '@/components/ui/FixedFooter'

// Types
interface PlanData {
  id: string
  name: string
  originalPrice: number
  currentPrice: number
  period: string
  features: string[]
  isPopular?: boolean
  access?: string
  backup?: boolean
  edits?: string
  sharing?: boolean
  support?: string
}

export default function PlansPage() {
  const router = useRouter()
  const [recipientName, setRecipientName] = useState('Victoria')
  const [selectedPlan, setSelectedPlan] = useState('forever')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  // Load recipient name and selected plan from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('onboardingData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        if (data.data?.partnerName) {
          setRecipientName(data.data.partnerName)
        }
        if (data.selectedPlan?.id) {
          setSelectedPlan(data.selectedPlan.id)
        }
      } catch (error) {
        console.error('Error loading stored data:', error)
      }
    }
  }, [])

  const plans: PlanData[] = [
    {
      id: 'forever',
      name: 'Para Sempre',
      originalPrice: 60.00,
      currentPrice: 29.90,
      period: 'Pagamento único',
      isPopular: true,
      access: 'Acesso Para Sempre',
      backup: true,
      edits: 'Edições ilimitadas',
      sharing: true,
      support: 'Suporte Prioritário',
      features: [
        'Acesso Para Sempre',
        'Edições ilimitadas',
        'Backup Seguro na Nuvem',
        'Compartilhamento ilimitado',
        'Suporte Prioritário'
      ]
    },
    {
      id: 'oneday',
      name: '1 Dia',
      originalPrice: 30.00,
      currentPrice: 19.90,
      period: 'Pagamento único',
      access: 'Acesso por 24 horas',
      backup: false,
      edits: 'Edições limitadas',
      sharing: false,
      support: 'Suporte básico',
      features: [
        'Acesso por 24 horas',
        'Backup na Nuvem',
        'Edições limitadas'
      ]
    }
  ]

  const faqs = [
    {
      question: 'Posso atualizar o presente com novas memórias no futuro?',
      answer: 'Sim! Com o plano Para Sempre, você pode adicionar novas fotos, alterar músicas e atualizar informações sempre que quiser. É perfeito para manter a retrospectiva sempre atual com novas memórias do casal.'
    },
    {
      question: 'Como entrego o presente para a pessoa amada?',
      answer: 'Após criar sua retrospectiva, você recebe um link único e um QR Code personalizado. Pode enviar por WhatsApp, imprimir o QR Code em um cartão especial, ou até mesmo criar uma surpresa presencial mostrando no seu celular!'
    },
    {
      question: 'Minhas fotos e informações pessoais estão seguras?',
      answer: 'Absolutamente! Utilizamos criptografia de ponta e servidores seguros. Suas fotos ficam protegidas e apenas pessoas com o link específico conseguem acessar. Nunca compartilhamos ou utilizamos suas informações pessoais.'
    },
    {
      question: 'Como vou poder configurar o wrapped e as outras páginas?',
      answer: 'Após escolher seu plano, você terá acesso ao nosso editor intuitivo onde pode personalizar cada seção: adicionar fotos na galeria, escolher estatísticas para exibir, escrever mensagens especiais e organizar a ordem das páginas do jeito que preferir.'
    },
    {
      question: 'Quais formas de pagamento são aceitas?',
      answer: 'Aceitamos cartão de crédito, débito, PIX e Boleto. O pagamento é processado de forma segura e você recebe acesso imediato após a confirmação.'
    },
    {
      question: 'A página tem prazo de validade?',
      answer: 'Depende do plano escolhido. O plano "Para Sempre" nunca expira e fica disponível eternamente. Já o plano "1 Dia" oferece acesso por 24 horas, ideal para uma surpresa pontual.'
    }
  ]

  const updateSelectedPlan = (planId: string) => {
    setSelectedPlan(planId)
    
    // Store selected plan immediately in localStorage
    const storedData = localStorage.getItem('onboardingData')
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        const updatedData = {
          ...data,
          selectedPlan: plans.find(p => p.id === planId)
        }
        localStorage.setItem('onboardingData', JSON.stringify(updatedData))
      } catch (error) {
        console.error('Error updating stored data:', error)
      }
    }
  }

  const handleContinue = () => {
    // Navigate to wrapped add-on page
    router.push('/wrapped')
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pb-24 md:pb-20">
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
              <div className="w-8 h-1 bg-purple-300 rounded"></div>
              <span className="text-sm text-gray-500 ml-2">Passo 2 de 4</span>

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
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">
              Ficou incrível! Você acabou de criar um presente único. Agora, vamos dar vida a essa surpresa e preparar tudo para o momento em que <span className="font-semibold text-purple-600">{recipientName}</span> se emocionar.<br></br> Escolha o plano que mais combina com a história de vocês.
            </p>
          </div>
        </div>

        {/* Plans Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Forever Plan */}
          <div 
          onClick={() => updateSelectedPlan('forever')}
          className={`relative bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 ${selectedPlan === 'forever' ? 'ring-4 ring-purple-500 transform scale-105' : 'hover:shadow-2xl'}`}>
            {plans[0].isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                  ⭐ Mais Escolhido
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans[0].name}</h3>
              <div className="text-purple-600 text-sm font-medium mb-4">🎁 Edições ilimitadas</div>
              
              <div className="mb-4">
                <div className="text-gray-500 line-through text-lg">
                  de R$ {plans[0].originalPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  R$ <span className="text-5xl">{Math.floor(plans[0].currentPrice)}</span>
                  <span className="text-2xl">,{(plans[0].currentPrice % 1).toFixed(2).slice(2)}</span>
                </div>
                <div className="text-gray-600 mt-1">{plans[0].period}</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {plans[0].features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => updateSelectedPlan('forever')}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedPlan === 'forever' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {selectedPlan === 'forever' ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>

          {/* One Day Plan */}
          <div 
          onClick={() => updateSelectedPlan('oneday')}
          className={`bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 ${selectedPlan === 'oneday' ? 'ring-4 ring-purple-500 transform scale-105' : 'hover:shadow-xl'}`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans[1].name}</h3>
              <div className="text-gray-500 text-sm mb-4">⏰ Acesso por 24 horas</div>
              
              <div className="mb-4">
                <div className="text-gray-500 line-through text-lg">
                  de R$ {plans[1].originalPrice.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  R$ <span className="text-5xl">{Math.floor(plans[1].currentPrice)}</span>
                  <span className="text-2xl">,{(plans[1].currentPrice % 1).toFixed(2).slice(2)}</span>
                </div>
                <div className="text-gray-600 mt-1">{plans[1].period}</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-700">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Acesso por 24 horas</span>
              </div>
              <div className="flex items-center text-gray-400">
                <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Backup na Nuvem</span>
              </div>
              <div className="flex items-center text-gray-400">
                <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Edições limitadas</span>
              </div>
            </div>

            <button 
              onClick={() => updateSelectedPlan('oneday')}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                selectedPlan === 'oneday' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {selectedPlan === 'oneday' ? 'Selecionado' : 'Selecionar Plano'}
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
              💜 DÚVIDAS FREQUENTES
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dúvidas Frequentes</h2>
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
        helperText="💳 Pagamento seguro • Satisfação garantida"
      />
    </div>
  )
}