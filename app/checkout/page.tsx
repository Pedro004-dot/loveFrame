'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Shield, Download, Link, QrCode, CreditCard } from 'lucide-react'

// Services
import { RetrospectiveService } from '@/lib/retrospectiveService'
import { WrappedService } from '@/lib/wrappedService'
import type { Retrospective } from '@/lib/supabase'
import type { OnboardingData } from '@/types/onboarding'
import PreviewCard from '@/components/onboarding/PreviewCard'
import FixedFooter from '@/components/ui/FixedFooter'
import { useTimeCalculator } from '@/hooks/useTimeCalculator'
import { getPublicUrl } from '@/lib/supabase'
import OnboardingStorageService from '@/lib/onboardingStorage'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const retrospectiveIdFromUrl = searchParams.get('id')

  const [retrospective, setRetrospective] = useState<Retrospective | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  
  // Calculate time data - hooks must always be called, so use empty strings as defaults
  const timeData = useTimeCalculator(
    onboardingData?.relationshipStart || '', 
    onboardingData?.relationshipTime || ''
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [wrappedAddon, setWrappedAddon] = useState(false)

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    loadDataAndRetrospective()
    // Load saved email and phone from localStorage
    const savedEmail = localStorage.getItem('userEmail')
    const savedPhone = localStorage.getItem('userPhone')
    if (savedEmail || savedPhone) {
      setPaymentData(prev => ({
        ...prev,
        email: savedEmail || '',
        phone: savedPhone || ''
      }))
    }
  }, [])


  const loadDataAndRetrospective = async () => {
    try {
      // Primeiro, tentar carregar dados do localStorage (mais rápido)
      if (OnboardingStorageService.hasData()) {
        const storedData = OnboardingStorageService.getData()
        const onboardingDataFromStorage = OnboardingStorageService.toOnboardingData(storedData)
        
        // Se temos dados completos no localStorage, usar diretamente
        if (onboardingDataFromStorage.userName && onboardingDataFromStorage.partnerName) {
          // Carregar planos do localStorage
          const storedOnboardingData = localStorage.getItem('onboardingData')
          let retrospectiveId: string | null = null
          let uniqueId: string | null = null
          
          if (storedOnboardingData) {
            try {
              const data = JSON.parse(storedOnboardingData)
              setSelectedPlan(data.selectedPlan)
              setWrappedAddon(data.wrappedAddon || false)
              retrospectiveId = data.retrospectiveId
              uniqueId = data.uniqueId
            } catch (e) {
              console.error('Error parsing stored onboarding data:', e)
            }
          }
          
          // Usar dados do localStorage para o preview (IMPORTANTE: mostrar preview mesmo sem retrospective)
          setOnboardingData(onboardingDataFromStorage as OnboardingData)
          
          // Tentar buscar retrospective do banco em background (não bloqueia o preview)
          if (retrospectiveId || uniqueId) {
            try {
              const { data: retrospectiveData } = await RetrospectiveService.getByUniqueId(retrospectiveId || uniqueId || '')
              if (retrospectiveData) {
                setRetrospective(retrospectiveData)
              }
            } catch (e) {
              console.warn('Could not load retrospective from database, but showing preview from localStorage:', e)
            }
          }
          setIsLoading(false)
          return
        }
      }
      
      // Fallback: buscar do banco de dados
      const storedOnboardingData = localStorage.getItem('onboardingData')
      if (storedOnboardingData) {
        try {
          const data = JSON.parse(storedOnboardingData)
          setSelectedPlan(data.selectedPlan)
          setWrappedAddon(data.wrappedAddon || false)
          
          // Try to load retrospective from localStorage first
          if (data.retrospectiveId) {
            const { data: retrospectiveData, error } = await RetrospectiveService.getByUniqueId(data.retrospectiveId)
            if (retrospectiveData) {
              setRetrospective(retrospectiveData)
              convertRetrospectiveToOnboardingData(retrospectiveData)
              setIsLoading(false)
              return
            }
          }
          
          // Fallback to unique_id
          if (data.uniqueId) {
            const { data: retrospectiveData, error } = await RetrospectiveService.getByUniqueId(data.uniqueId)
            if (retrospectiveData) {
              setRetrospective(retrospectiveData)
              convertRetrospectiveToOnboardingData(retrospectiveData)
              setIsLoading(false)
              return
            }
          }
        } catch (e) {
          console.error('Error parsing stored onboarding data:', e)
        }
      }
      
      // Fallback to URL parameter if localStorage fails
      if (retrospectiveIdFromUrl) {
        const { data, error } = await RetrospectiveService.getByUniqueId(retrospectiveIdFromUrl)
        if (data) {
          setRetrospective(data)
          convertRetrospectiveToOnboardingData(data)
          setIsLoading(false)
          return
        }
      }
      
      // Se chegou aqui, não encontrou dados nem retrospective
      // Mas não redireciona imediatamente - deixa o componente decidir
      console.warn('No retrospective or onboarding data found')
      
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const convertRetrospectiveToOnboardingData = (retro: Retrospective): void => {
    // Converter selected_song para YouTubeVideo format
    const selectedSong = retro.selected_song as any
    const selectedTrack = selectedSong ? {
      id: selectedSong.id || '',
      title: selectedSong.customTitle || selectedSong.title || '',
      artist: selectedSong.customArtist || selectedSong.artist || '',
      thumbnail: selectedSong.thumbnail || '',
      videoId: selectedSong.videoId || selectedSong.video_id || '',
      customTitle: selectedSong.customTitle,
      customArtist: selectedSong.customArtist
    } : null

    // Converter gallery_photos (JSONB array) para array de URLs
    let galleryPhotoUrls: string[] = []
    if (retro.gallery_photos) {
      if (Array.isArray(retro.gallery_photos)) {
        galleryPhotoUrls = retro.gallery_photos.map((path: string) => {
          if (path.startsWith('http')) return path
          return getPublicUrl('retrospectives', path)
        })
      }
    }

    const onboarding: OnboardingData = {
      userName: retro.user_name || '',
      partnerName: retro.partner_name || '',
      relationshipStart: retro.relationship_start_date || retro.start_date || '',
      relationshipTime: retro.relationship_time || '',
      giftTitle: retro.gift_title || '',
      selectedTrack: selectedTrack,
      coverPhoto: null,
      coverPhotoUrl: retro.cover_photo_path ? getPublicUrl('retrospectives', retro.cover_photo_path) : '',
      musicCoverPhoto: null,
      musicCoverPhotoUrl: retro.music_cover_photo_path ? getPublicUrl('retrospectives', retro.music_cover_photo_path) : '',
      timeCounterPhoto: null,
      timeCounterPhotoUrl: retro.time_counter_photo_path ? getPublicUrl('retrospectives', retro.time_counter_photo_path) : '',
      specialMessage: retro.special_message || '',
      coupleGalleryPhotos: [],
      coupleGalleryPhotoUrls: galleryPhotoUrls
    }

    setOnboardingData(onboarding)
  }


  const handlePayment = async () => {
    // Se não temos retrospective, precisamos buscar uma primeiro
    let retrospectiveToUse = retrospective
    let uniqueIdToUse: string | null = null
    
    if (!retrospectiveToUse) {
      // Tentar buscar do localStorage
      const storedOnboardingData = localStorage.getItem('onboardingData')
      if (storedOnboardingData) {
        try {
          const data = JSON.parse(storedOnboardingData)
          uniqueIdToUse = data.uniqueId || data.retrospectiveId || null
          
          if (uniqueIdToUse) {
            // Tentar buscar do banco
            const { data: retrospectiveData } = await RetrospectiveService.getByUniqueId(uniqueIdToUse)
            if (retrospectiveData) {
              retrospectiveToUse = retrospectiveData
              setRetrospective(retrospectiveData)
            }
          }
        } catch (e) {
          console.error('Error parsing stored data:', e)
        }
      }
    } else {
      uniqueIdToUse = retrospectiveToUse.unique_id
    }

    // Se ainda não temos uniqueId, tentar usar o da URL ou do localStorage
    if (!uniqueIdToUse) {
      const storedOnboardingData = localStorage.getItem('onboardingData')
      if (storedOnboardingData) {
        try {
          const data = JSON.parse(storedOnboardingData)
          uniqueIdToUse = data.uniqueId || data.retrospectiveId || null
        } catch (e) {
          console.error('Error parsing stored data:', e)
        }
      }
    }

    // Se não temos uniqueId, mostrar erro
    if (!uniqueIdToUse) {
      alert('Retrospectiva não encontrada. Por favor, volte e crie uma nova.')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update payment status to completed (se temos retrospective)
      if (retrospectiveToUse) {
        try {
          await RetrospectiveService.updatePaymentStatus(retrospectiveToUse.id, 'completed')
          
          // Update creator email if provided
          if (paymentData.email) {
            try {
              await RetrospectiveService.updateCreatorEmail(
                retrospectiveToUse.id,
                paymentData.email,
                paymentData.phone
              )
              
              // Save email and phone to localStorage for future identification
              localStorage.setItem('userEmail', paymentData.email)
              if (paymentData.phone) {
                localStorage.setItem('userPhone', paymentData.phone)
              }
              
              const storedData = localStorage.getItem('onboardingData')
              if (storedData) {
                try {
                  const data = JSON.parse(storedData)
                  data.creatorEmail = paymentData.email
                  data.creatorPhone = paymentData.phone
                  localStorage.setItem('onboardingData', JSON.stringify(data))
                } catch (e) {
                  console.error('Error saving email to localStorage:', e)
                }
              } else {
                // Create new entry with email
                localStorage.setItem('onboardingData', JSON.stringify({
                  creatorEmail: paymentData.email,
                  creatorPhone: paymentData.phone
                }))
              }
            } catch (e) {
              console.error('Error updating creator email:', e)
            }
          }
          
          // Update has_wrapped if user purchased wrapped addon
          const storedData = localStorage.getItem('onboardingData')
          if (storedData) {
            try {
              const data = JSON.parse(storedData)
              if (data.wrappedAddon) {
                await WrappedService.updateRetrospectiveWrappedStatus(
                  retrospectiveToUse.id,
                  true,
                  true
                )
              }
            } catch (e) {
              console.error('Error updating wrapped status:', e)
            }
          }
        } catch (error) {
          // Não bloquear se falhar - pode ser que a retrospectiva ainda não esteja no banco
          console.warn('Could not update payment status:', error)
        }
      }

      // Redirect to dashboard after payment
      router.push('/dashboard')
      
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Erro no processamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = paymentData.email.trim().length > 0 && paymentData.email.includes('@')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 mt-4">Carregando sua retrospectiva...</p>
        </div>
      </div>
    )
  }

  // Se não temos dados nem retrospective, redirecionar
  if (!onboardingData && !retrospective) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Dados não encontrados.</p>
          <button 
            onClick={() => router.push('/create')} 
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            Criar Retrospectiva
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pb-24 md:pb-20">
      
      {/* Header with Urgency */}
      <div className="bg-white border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                Finalizar Pedido 💳
              </h1>
              <p className="text-purple-600 mt-1">
                Passo 4 de 4 •
              </p>
            </div>
            
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* Left Side - Live Preview */}
          <div className="w-full lg:w-1/2">
            
            {/* Preview Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Preview do Seu Produto
              </h2>
            </div>

            {/* Preview Card */}
            {onboardingData ? (
              <PreviewCard 
                data={onboardingData} 
                timeData={timeData} 
              />
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <p className="text-gray-500">Carregando preview...</p>
              </div>
            )}

           
          </div>

          {/* Right Side - Payment */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-8">
              
              {/* Pricing */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
                
                <div className="space-y-3 mb-4">
                  {selectedPlan && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{selectedPlan.name}</span>
                      <span className="font-semibold">R$ {selectedPlan.currentPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  {wrappedAddon && (
                    <div className="flex justify-between items-center">
                      <span className="text-black">Pacote Wrapped</span>
                      <span className="font-semibold">R$ 4,90</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between items-center text-lg font-bold text-black">
                    <span>Total</span>
                    <span className="text-purple-600">
                      R$ {((selectedPlan?.currentPrice || 29.90) + (wrappedAddon ? 4.90 : 0)).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-700 text-sm font-medium">
                    💰 Economia de {wrappedAddon ? 'R$ 40,00' : 'R$ 30,00'} com a oferta de lançamento!
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Informações de Contato</h4>
                <p className="text-xs text-gray-600 mb-4">
                  Preencha seus dados para identificarmos sua retrospectiva
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone (opcional)
                    </label>
                    <input
                      type="tel"
                      value={paymentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 border  text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Test Mode Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600 font-semibold">🧪 Modo de Teste</span>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  Clique em "Finalizar" para simular o pagamento e continuar
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter
        singleButton={true}
        singleButtonLabel={isProcessing ? 'Processando...' : 'Finalizar e Continuar'}
        singleButtonOnClick={handlePayment}
        singleButtonDisabled={!isFormValid || isProcessing}
        helperText={
          !isFormValid ? (
            'Por favor, preencha seu email para continuar'
          ) : (
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Modo de teste ativo</span>
              </div>
              <div className="text-xs text-gray-500">
                Nenhum pagamento real será processado
              </div>
            </div>
          )
        }
      />
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 mt-4">Carregando checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}