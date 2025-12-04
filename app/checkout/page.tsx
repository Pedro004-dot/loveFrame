'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ChevronDown, Copy, Check, Lock, Users, Heart } from 'lucide-react'
import QRCode from 'react-qr-code'

// Services
import { RetrospectiveService } from '@/lib/retrospectiveService'
import { WrappedService } from '@/lib/wrappedService'
import type { Retrospective } from '@/lib/supabase'
import type { OnboardingData } from '@/types/onboarding'
import { useTimeCalculator } from '@/hooks/useTimeCalculator'
import { getPublicUrl } from '@/lib/supabase'
import OnboardingStorageService from '@/lib/onboardingStorage'
import type { PixPaymentResponse } from '@/lib/payment/types'
import { usePaymentStatus } from '@/hooks/usePaymentStatus'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const retrospectiveIdFromUrl = searchParams.get('id')

  const [retrospective, setRetrospective] = useState<Retrospective | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  
  // Calculate time data
  const timeData = useTimeCalculator(
    onboardingData?.relationshipStart || '', 
    onboardingData?.relationshipTime || ''
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPix, setIsGeneratingPix] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [wrappedAddon, setWrappedAddon] = useState(false)
  const [pixPayment, setPixPayment] = useState<PixPaymentResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const [showCoupon, setShowCoupon] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  // Default plan if none selected
  const defaultPlan = {
    id: 'forever',
    name: 'Para Sempre',
    originalPrice: 60.00,
    currentPrice: 29.90,
    period: 'Pagamento único'
  }

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    email: '',
    phone: ''
  })

  // Use payment status hook for polling
  const { status } = usePaymentStatus({
    paymentId: pixPayment?.id || null,
    method: 'pix',
    interval: 5000,
    onComplete: async (data) => {
      if (data.status === 'completed') {
        await handlePaymentComplete(data.id)
      }
    }
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
      if (OnboardingStorageService.hasData()) {
        const storedData = OnboardingStorageService.getData()
        const onboardingDataFromStorage = OnboardingStorageService.toOnboardingData(storedData)
        
        if (onboardingDataFromStorage && onboardingDataFromStorage.userName && onboardingDataFromStorage.partnerName) {
          const storedOnboardingData = localStorage.getItem('onboardingData')
          let retrospectiveId: string | null = null
          let uniqueId: string | null = null
          
          if (storedOnboardingData) {
            try {
              const data = JSON.parse(storedOnboardingData)
              setSelectedPlan(data.selectedPlan || defaultPlan)
              setWrappedAddon(data.wrappedAddon || false)
              retrospectiveId = data.retrospectiveId
              uniqueId = data.uniqueId
            } catch (e) {
              console.error('Error parsing stored onboarding data:', e)
              setSelectedPlan(defaultPlan)
              setWrappedAddon(false)
            }
          } else {
            setSelectedPlan(defaultPlan)
            setWrappedAddon(false)
          }

          setOnboardingData(onboardingDataFromStorage as OnboardingData)
        }
      }

      // Try to load retrospective from URL or localStorage
      if (retrospectiveIdFromUrl) {
        const { data: retrospectiveData } = await RetrospectiveService.getByUniqueId(retrospectiveIdFromUrl)
        if (retrospectiveData) {
          setRetrospective(retrospectiveData)
        }
      } else {
        const storedOnboardingData = localStorage.getItem('onboardingData')
        if (storedOnboardingData) {
          try {
            const data = JSON.parse(storedOnboardingData)
            const uniqueId = data.uniqueId || data.retrospectiveId
            if (uniqueId) {
              const { data: retrospectiveData } = await RetrospectiveService.getByUniqueId(uniqueId)
              if (retrospectiveData) {
                setRetrospective(retrospectiveData)
              }
            }
          } catch (e) {
            console.error('Error loading retrospective:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePix = async () => {
    if (!isFormValid) {
      alert('Por favor, preencha um email válido.')
      return
    }

    setIsGeneratingPix(true)

    try {
      // Calculate total amount
      const planPrice = (selectedPlan || defaultPlan).currentPrice
      const wrappedPrice = wrappedAddon ? 4.90 : 0
      const subtotal = planPrice + wrappedPrice
      const totalAmount = Math.max(0, subtotal - couponDiscount)

      // Se o valor total for 0 (cupom de 100%), considerar pagamento como concluído automaticamente
      if (totalAmount === 0) {
        console.log('✅ Valor zerado por cupom - considerando pagamento como concluído')
        // Pequeno delay para feedback visual
        await new Promise(resolve => setTimeout(resolve, 500))
        await handlePaymentComplete('free-coupon')
        return
      }

      // Create PIX payment
      const response = await fetch('/api/payment/pix/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
          amount: totalAmount,
          description: `Retrospectiva LoveFrame - ${(selectedPlan || defaultPlan).name}${wrappedAddon ? ' + Wrapped' : ''}${couponCode ? ` (Cupom: ${couponCode})` : ''}`,
          metadata: {
            email: paymentData.email,
            phone: paymentData.phone,
            retrospectiveId: retrospective?.id || null,
            planId: (selectedPlan || defaultPlan).id,
            wrappedAddon: wrappedAddon,
            couponCode: couponCode || undefined,
            couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
            originalAmount: planPrice + wrappedPrice,
            discountAmount: couponDiscount
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao gerar pagamento PIX')
      }

      const pixPaymentData: PixPaymentResponse = await response.json()
      console.log('✅ PIX Payment Created:', {
        id: pixPaymentData.id,
        amount: pixPaymentData.amount,
        status: pixPaymentData.status,
        copyPasteCode: pixPaymentData.copyPasteCode.substring(0, 50) + '...'
      })
      console.log('📋 Payment ID para simulação:', pixPaymentData.id)
      setPixPayment(pixPaymentData)
      setShowQrCode(true)
    } catch (error) {
      console.error('Error creating PIX payment:', error)
      alert(error instanceof Error ? error.message : 'Erro ao gerar pagamento. Tente novamente.')
    } finally {
      setIsGeneratingPix(false)
    }
  }

  const handlePaymentComplete = async (paymentId: string) => {
    let retrospectiveToUse = retrospective
    let uniqueIdToUse: string | null = null
    
    if (!retrospectiveToUse) {
      const storedOnboardingData = localStorage.getItem('onboardingData')
      if (storedOnboardingData) {
        try {
          const data = JSON.parse(storedOnboardingData)
          uniqueIdToUse = data.uniqueId || data.retrospectiveId || null
          
          if (uniqueIdToUse) {
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

    try {
      if (retrospectiveToUse) {
        try {
          await RetrospectiveService.updatePaymentStatus(retrospectiveToUse.id, 'completed')

          if (paymentData.email) {
            try {
              await RetrospectiveService.updateCreatorEmail(
                retrospectiveToUse.id,
                paymentData.email,
                paymentData.phone
              )
              
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
                localStorage.setItem('onboardingData', JSON.stringify({
                  creatorEmail: paymentData.email,
                  creatorPhone: paymentData.phone
                }))
              }
            } catch (e) {
              console.error('Error updating creator email:', e)
            }
          }
          
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
          console.warn('Could not update payment status:', error)
        }
      }

      router.push('/dashboard')
      
    } catch (error) {
      console.error('Error updating payment status:', error)
      router.push('/dashboard')
    }
  }

  const handleCopyCode = async () => {
    if (!pixPayment?.copyPasteCode) return
    
    try {
      await navigator.clipboard.writeText(pixPayment.copyPasteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Erro ao copiar código. Tente novamente.')
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor, insira um código de cupom')
      return
    }

    setIsValidatingCoupon(true)
    setCouponError('')

    try {
      // Validar cupom via API
      const response = await fetch('/api/payment/coupon/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.toUpperCase()
        })
      })

      const data = await response.json()

      if (data.valid && response.ok) {
        const planPrice = (selectedPlan || defaultPlan).currentPrice
        const wrappedPrice = wrappedAddon ? 4.90 : 0
        const subtotal = planPrice + wrappedPrice
        
        // Calcular desconto baseado no tipo (percentage ou fixed)
        let discount = 0
        if (data.discountType === 'percentage') {
          discount = subtotal * data.discount
        } else if (data.discountType === 'fixed') {
          discount = data.discount
        } else {
          // Fallback para percentage
          discount = subtotal * (data.discount || 0)
        }
        
        setCouponDiscount(discount)
        setCouponError('')
        console.log('✅ Cupom aplicado:', {
          code: couponCode.toUpperCase(),
          discount: discount,
          discountType: data.discountType
        })
      } else {
        setCouponError(data.error || 'Cupom inválido ou expirado')
        setCouponDiscount(0)
      }
    } catch (error) {
      console.error('Error validating coupon:', error)
      setCouponError('Erro ao validar cupom. Tente novamente.')
      setCouponDiscount(0)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setCouponError('')
  }

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const isFormValid = paymentData.email.trim().length > 0 && paymentData.email.includes('@')
  const planPrice = (selectedPlan || defaultPlan).currentPrice
  const wrappedPrice = wrappedAddon ? 4.90 : 0
  const subtotal = planPrice + wrappedPrice
  const totalAmount = Math.max(0, subtotal - couponDiscount)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!onboardingData && !retrospective) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Dados não encontrados.</p>
          <button 
            onClick={() => router.push('/create')} 
            className="mt-4 text-pink-600 hover:text-pink-700"
          >
            Criar Retrospectiva
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-4 h-4" />
          <p className="text-sm font-medium">
            <span className="font-bold">Somente hoje 04/12</span> - todos os planos com 50% de desconto, <span className="font-bold">Não Perca!</span>
          </p>
          <Heart className="w-4 h-4" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="w-full h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro Section with Panda */}
        <div className="flex items-start gap-4 mb-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🐼</span>
            </div>
          </div>
          <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-700 leading-relaxed">
              Tudo pronto para o grande momento! Estou ansioso para ver a reação dela(e). Preencha os detalhes do pagamento abaixo e prepare-se para surpreender.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do pedido</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Plano: {(selectedPlan || defaultPlan).name}</span>
              <span className="font-semibold text-gray-900">R$ {(selectedPlan || defaultPlan).currentPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            
            {wrappedAddon && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Retrospectiva Wrapped</span>
                <span className="font-semibold text-gray-900">R$ 4,90</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
            {couponDiscount > 0 && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-700">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="text-green-600 font-semibold">- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-pink-600">R$ {totalAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Expandable Options */}
          <div className="space-y-2">
            <button
              onClick={() => setShowCoupon(!showCoupon)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-600">Possui um cupom de desconto?</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showCoupon ? 'rotate-180' : ''}`} />
            </button>
            
            {showCoupon && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {couponDiscount > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Cupom aplicado:</span>
                      <span className="text-sm font-semibold text-green-600">{couponCode.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Desconto:</span>
                      <span className="text-sm font-semibold text-green-600">- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remover cupom
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Digite o código do cupom"
                        className="flex-1 px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyCoupon()
                          }
                        }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isValidatingCoupon ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Aplicar'
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                paymentMethod === 'pix'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">💎</span>
              <span>PIX</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                paymentMethod === 'card'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">💳</span>
              <span>Cartão</span>
            </button>
          </div>

          {paymentMethod === 'pix' && (
            <>
              {/* PIX Data Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    Usaremos eles para você conseguir editar seu presente.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Telefone (com DDD)
                    </label>
                    <input
                      type="tel"
                      value={paymentData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Generate PIX Button or QR Code */}
              {!pixPayment ? (
                <button
                  onClick={handleGeneratePix}
                  disabled={!isFormValid || isGeneratingPix}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPix ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{totalAmount === 0 ? 'Processando...' : 'Gerando PIX...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">💎</span>
                      <span>{totalAmount === 0 ? 'Finalizar Gratuitamente' : 'Gerar PIX'}</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  {/* QR Code */}
                  <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
                    {pixPayment.qrCode ? (
                      <img 
                        src={pixPayment.qrCode} 
                        alt="QR Code PIX" 
                        className="w-full max-w-xs"
                      />
                    ) : (
                      <QRCode
                        value={pixPayment.copyPasteCode}
                        size={256}
                        level="H"
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    )}
                  </div>

                  {/* Copy Paste Code */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Código PIX (Copiar e Colar)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pixPayment.copyPasteCode}
                        readOnly
                        className="flex-1 px-4 py-3 border text-black border-gray-300 rounded-xl bg-gray-50 text-sm font-mono"
                      />
                      <button
                        onClick={handleCopyCode}
                        className="p-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors"
                        title="Copiar código"
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Payment Status */}
                  {(status || pixPayment.status) === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-yellow-800">
                        Aguardando pagamento...
                      </p>
                    </div>
                  )}
                  
                  {(status || pixPayment.status) === 'completed' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-green-800 font-medium">
                        Pagamento confirmado! Redirecionando...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Security Text */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Pagamento 100% seguro processado por Efi.</span>
              </div>
            </>
          )}

          {paymentMethod === 'card' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Pagamento com cartão em breve</p>
            </div>
          )}
        </div>

        {/* Social Proof */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-pink-500" />
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <p className="text-sm text-gray-600 font-medium">
            + de 12.000 casais felizes!
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600 mt-4">Carregando checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
