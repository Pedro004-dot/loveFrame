'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Types
import type { OnboardingData, YouTubeVideo } from '@/types/onboarding'
import type { YouTubeSongData } from '@/lib/supabase'

// Services
import { RetrospectiveService } from '@/lib/retrospectiveService'
import { supabase } from '@/lib/supabase'

// Hooks
import { useTimeCalculator } from '@/hooks/useTimeCalculator'

// Components
import ProgressIndicator from '@/components/onboarding/ProgressIndicator'
import PreviewCard from '@/components/onboarding/PreviewCard'
import ProgressBar from '@/components/ui/ProgressBar'
import PromoHeader from '@/components/ui/PromoHeader'
import FixedFooter from '@/components/ui/FixedFooter'
import Step1Name from '@/components/onboarding/steps/Step1Name'
import Step2Relationship from '@/components/onboarding/steps/Step2Relationship'
import Step3Title from '@/components/onboarding/steps/Step3Title'
import Step4Music from '@/components/onboarding/steps/Step4Music'
import Step5MusicPhoto from '@/components/onboarding/steps/Step5MusicPhoto'
import Step6TimePhoto from '@/components/onboarding/steps/Step6TimePhoto'
import Step7SpecialMessage from '@/components/onboarding/steps/Step7SpecialMessage'
import Step8CoupleGallery from '@/components/onboarding/steps/Step8CoupleGallery'

// Utils
import { createFileUrl, validateImageFile, validateAudioFile } from '@/utils/fileUpload'
import OnboardingStorageService from '@/lib/onboardingStorage'

const TOTAL_STEPS = 8

export default function CreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    userName: '',
    partnerName: '',
    relationshipStart: '',
    relationshipTime: '',
    giftTitle: '',
    selectedTrack: null,
    coverPhoto: null,
    coverPhotoUrl: '',
    musicCoverPhoto: null,
    musicCoverPhotoUrl: '',
    timeCounterPhoto: null,
    timeCounterPhotoUrl: '',
    specialMessage: '',
    coupleGalleryPhotos: [],
    coupleGalleryPhotoUrls: []
  })

  const timeData = useTimeCalculator(data.relationshipStart, data.relationshipTime)

  // Carregar dados do localStorage quando a página carrega
  useEffect(() => {
    if (OnboardingStorageService.hasData()) {
      const storedData = OnboardingStorageService.getData()
      const onboardingData = OnboardingStorageService.toOnboardingData(storedData)
      
      // Garantir que coupleGalleryPhotoUrls seja sempre um array
      const mergedData = {
        ...onboardingData,
        coupleGalleryPhotoUrls: Array.isArray(onboardingData.coupleGalleryPhotoUrls) 
          ? onboardingData.coupleGalleryPhotoUrls 
          : []
      }
      
      console.log('[Create Page] Loading from localStorage:', {
        hasGalleryUrls: !!mergedData.coupleGalleryPhotoUrls,
        galleryUrlsLength: mergedData.coupleGalleryPhotoUrls?.length || 0,
        galleryUrls: mergedData.coupleGalleryPhotoUrls?.slice(0, 2).map((url: string) => url?.substring(0, 50) + '...') || []
      })
      
      setData(prev => ({ 
        ...prev, 
        ...mergedData,
        // Garantir que coupleGalleryPhotoUrls seja preservado se já existir
        coupleGalleryPhotoUrls: mergedData.coupleGalleryPhotoUrls && mergedData.coupleGalleryPhotoUrls.length > 0
          ? mergedData.coupleGalleryPhotoUrls
          : (prev.coupleGalleryPhotoUrls || [])
      }))
    }
  }, [])

  const updateData = <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    
    // Salvar no localStorage
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData))
  }

  const handleFileUpload = (file: File) => {
    if (!validateImageFile(file)) {
      alert('Arquivo de imagem inválido')
      return
    }

    const url = createFileUrl(file)
    const newData = { ...data, coverPhoto: file, coverPhotoUrl: url }
    setData(newData)
    
    // Salvar no localStorage incluindo o arquivo
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData, file))
  }

  const handleMusicCoverUpload = (file: File) => {
    if (!validateImageFile(file)) {
      alert('Arquivo de imagem inválido')
      return
    }

    const url = createFileUrl(file)
    const newData = { ...data, musicCoverPhoto: file, musicCoverPhotoUrl: url }
    setData(newData)
    
    // Salvar no localStorage
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData, undefined, file))
  }

  const handleTimeCounterPhotoUpload = (file: File) => {
    if (!validateImageFile(file)) {
      alert('Arquivo de imagem inválido')
      return
    }

    const url = createFileUrl(file)
    const newData = { ...data, timeCounterPhoto: file, timeCounterPhotoUrl: url }
    setData(newData)
    
    // Salvar no localStorage
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData, undefined, undefined, file))
  }

  const handleTimeCounterPhotoSkip = () => {
    const newData = { ...data, timeCounterPhoto: null, timeCounterPhotoUrl: '' }
    setData(newData)
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData))
  }

  const handleGalleryPhotosUpload = (files: File[]) => {
    const validFiles = files.filter(file => validateImageFile(file))
    if (validFiles.length === 0) {
      alert('Nenhum arquivo de imagem válido')
      return
    }

    // Criar URLs temporárias para preview (blob URLs)
    const urls = validFiles.map(file => createFileUrl(file))
    
    // Combinar com fotos existentes
    const existingPhotos = data.coupleGalleryPhotos || []
    const existingUrls = data.coupleGalleryPhotoUrls || []
    
    // Separar URLs base64 existentes de URLs blob temporárias
    const existingBase64Urls = existingUrls.filter((url: string) => url && url.startsWith('data:image'))
    const newPhotos = [...existingPhotos, ...validFiles]
    const newUrls = [...existingBase64Urls, ...urls] // Preservar base64, adicionar blob temporárias
    
    const newData = { 
      ...data, 
      coupleGalleryPhotos: newPhotos, 
      coupleGalleryPhotoUrls: newUrls 
    }
    setData(newData)
    
    // Salvar no localStorage - isso vai converter os Files para base64
    // Passar apenas os novos arquivos para converter (não os que já foram convertidos)
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData, undefined, undefined, undefined, validFiles))
  }

  const handleGalleryPhotoRemove = (index: number) => {
    const newPhotos = [...data.coupleGalleryPhotos]
    const newUrls = [...data.coupleGalleryPhotoUrls]
    newPhotos.splice(index, 1)
    newUrls.splice(index, 1)
    
    const newData = {
      ...data,
      coupleGalleryPhotos: newPhotos,
      coupleGalleryPhotoUrls: newUrls
    }
    setData(newData)
    
    // Salvar no localStorage - preservar URLs base64 existentes
    OnboardingStorageService.saveData(OnboardingStorageService.fromOnboardingData(newData, undefined, undefined, undefined, newPhotos))
  }

  const handleSpecialMessageUpdate = (value: string) => {
    updateData('specialMessage', value)
  }

  const handleTrackSelect = (track: YouTubeVideo) => {
    updateData('selectedTrack', track)
  }

  const validateCurrentStep = (): { isValid: boolean; message: string } => {
    switch (currentStep) {
      case 1:
        if (data.userName.trim() === '') {
          return { isValid: false, message: 'Por favor, digite seu nome.' }
        }
        if (data.partnerName.trim() === '') {
          return { isValid: false, message: 'Por favor, digite o nome do seu parceiro(a).' }
        }
        return { isValid: true, message: '' }
      case 2:
        if (data.relationshipStart === '') {
          return { isValid: false, message: 'Por favor, selecione quando começaram a namorar.' }
        }
        return { isValid: true, message: '' }
      case 3:
        if (data.giftTitle.trim() === '') {
          return { isValid: false, message: 'Por favor, digite um título para a retrospectiva.' }
        }
        return { isValid: true, message: '' }
      case 4:
        if (data.selectedTrack === null) {
          return { isValid: true, message: 'Por favor, escolha uma música que representa vocês.' }
        }
        return { isValid: true, message: '' }
      case 5:
        if (data.musicCoverPhoto === null) {
          return { isValid: true, message: 'Por favor, adicione uma foto para a capa da música.' }
        }
        return { isValid: true, message: '' }
      case 6:
        // Opcional - sempre válido
        return { isValid: true, message: '' }
      case 7:
        if (data.specialMessage.trim() === '') {
          return { isValid: true, message: 'Por favor, escreva uma mensagem especial.' }
        }
        return { isValid: true, message: '' }
      case 8:
        if (data.coupleGalleryPhotos.length < 3) {
          return { isValid: true, message: 'Por favor, adicione pelo menos 3 fotos para a galeria.' }
        }
        return { isValid: true, message: '' }
      default:
        return { isValid: true, message: '' }
    }
  }

  const handleNext = async () => {
    // Validate current step before proceeding
    const validation = validateCurrentStep()
    if (!validation.isValid) {
      setSubmitError(validation.message)
      return
    }

    setSubmitError(null)
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleSubmitOnboarding()
    }
  }

  const handleSubmitOnboarding = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Convert OnboardingData to format expected by RetrospectiveService
      const formData = {
        userName: data.userName,
        partnerName: data.partnerName,
        relationshipStartDate: data.relationshipStart,
        relationshipTime: data.relationshipTime,
        giftTitle: data.giftTitle,
        selectedSong: data.selectedTrack ? {
          id: data.selectedTrack.id,
          title: data.selectedTrack.customTitle || data.selectedTrack.title,
          artist: data.selectedTrack.customArtist || data.selectedTrack.artist,
          thumbnail: data.selectedTrack.thumbnail,
          videoId: data.selectedTrack.videoId,
          selected_at: new Date().toISOString(),
          customTitle: data.selectedTrack.customTitle,
          customArtist: data.selectedTrack.customArtist
        } as YouTubeSongData : null,
        coverPhoto: data.coverPhoto,
        musicCoverPhoto: data.musicCoverPhoto,
        timeCounterPhoto: data.timeCounterPhoto,
        specialMessage: data.specialMessage,
        coupleGalleryPhotos: data.coupleGalleryPhotos
      }

      // Save to database
      const { data: retrospective, error } = await RetrospectiveService.createFromOnboarding(formData)

      if (error || !retrospective) {
        console.error('Database error:', error)
        
        // Handle specific error types
        if (error?.code === 'PGRST116') {
          throw new Error('Erro de conexão com o banco de dados. Tente novamente.')
        } else if (error?.code === '23505') {
          throw new Error('Já existe uma retrospectiva com esses dados. Tente alterar algo.')
        } else {
          throw new Error('Erro ao salvar dados. Verifique sua conexão e tente novamente.')
        }
      }

      // Store retrospective ID in localStorage for checkout
      localStorage.setItem('onboardingData', JSON.stringify({
        retrospectiveId: retrospective.id,
        uniqueId: retrospective.unique_id,
        data: formData
      }))

      // Small delay to show success state
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Redirect to plans page
      router.push('/plans')
      
    } catch (error) {
      console.error('Error submitting onboarding:', error)
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.')
      } else {
        setSubmitError(error instanceof Error ? error.message : 'Erro inesperado. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Name 
            userName={data.userName}
            partnerName={data.partnerName}
            onUpdateUser={(value) => updateData('userName', value)}
            onUpdatePartner={(value) => updateData('partnerName', value)}
          />
        )
      case 2:
        return (
          <Step2Relationship
            userName={data.userName}
            relationshipStart={data.relationshipStart}
            relationshipTime={data.relationshipTime}
            timeData={timeData}
            onUpdateDate={(value) => updateData('relationshipStart', value)}
            onUpdateTime={(value) => updateData('relationshipTime', value)}
          />
        )
      case 3:
        return (
          <Step3Title
            userName={data.userName}
            giftTitle={data.giftTitle}
            onUpdate={(value) => updateData('giftTitle', value)}
          />
        )
      case 4:
        return (
          <Step4Music
            selectedTrack={data.selectedTrack}
            couplePhoto={data.musicCoverPhotoUrl}
            onTrackSelect={handleTrackSelect}
          />
        )
      case 5:
        return (
          <Step5MusicPhoto
            musicCoverPhoto={data.musicCoverPhoto}
            musicCoverPhotoUrl={data.musicCoverPhotoUrl}
            onFileUpload={handleMusicCoverUpload}
          />
        )
      case 6:
        return (
          <Step6TimePhoto
            timeCounterPhoto={data.timeCounterPhoto}
            timeCounterPhotoUrl={data.timeCounterPhotoUrl}
            onFileUpload={handleTimeCounterPhotoUpload}
            onSkip={handleTimeCounterPhotoSkip}
          />
        )
      case 7:
        return (
          <Step7SpecialMessage
            specialMessage={data.specialMessage}
            onUpdate={(value) => updateData('specialMessage', value)}
            userName={data.userName}
            partnerName={data.partnerName}
          />
        )
      case 8:
        return (
          <Step8CoupleGallery
            coupleGalleryPhotos={data.coupleGalleryPhotos}
            coupleGalleryPhotoUrls={data.coupleGalleryPhotoUrls}
            onPhotosUpload={handleGalleryPhotosUpload}
            onPhotoRemove={handleGalleryPhotoRemove}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pb-24 md:pb-20">
      {/* Promo Header */}
      <PromoHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className={`flex flex-col gap-8 max-w-7xl mx-auto ${currentStep >= 3 ? 'lg:flex-row' : ''}`}>
          
          {/* Left Side - Form */}
          <div className={`space-y-8 ${currentStep >= 3 ? 'w-full lg:w-1/2' : 'w-full max-w-3xl mx-auto'}`}>
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={TOTAL_STEPS} 
            />
            
            <ProgressIndicator 
              currentStep={currentStep} 
              totalSteps={TOTAL_STEPS} 
            />

            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg min-h-[500px] flex flex-col justify-center">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Right Side - Live Preview (only from Step 3 onwards) - Desktop */}
          {currentStep >= 3 && (
            <div className="hidden lg:flex w-full lg:w-1/2 items-start justify-center lg:sticky lg:top-8">
            <PreviewCard 
              data={data} 
              timeData={timeData} 
              showMusicPreview={currentStep !== 4} // Não mostrar preview durante busca no step 4
            />
          </div>
          )}
          
        </div>
      </div>

      {/* Mobile Preview Button (only visible on mobile and from Step 3 onwards) */}
      {currentStep >= 3 && (
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="lg:hidden fixed bottom-24 right-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 z-40 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Pré-visualizar</span>
        </button>
      )}

      {/* Fixed Footer with Navigation */}
      <FixedFooter
        showBack={currentStep > 1}
        showNext={true}
        onBack={handleBack}
        onNext={handleNext}
        nextLabel={currentStep === TOTAL_STEPS ? 'Finalizar' : 'Próximo Passo'}
        isLoading={isSubmitting}
        error={submitError}
      />

      {/* Mobile Preview Modal */}
      {isPreviewOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="bg-transparent w-full max-w-sm relative transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-10 right-0 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2.5 shadow-xl transition-all z-10 flex items-center justify-center"
              aria-label="Fechar preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Preview Card */}
            <div className="max-h-[85vh] overflow-y-auto">
              <PreviewCard 
                data={data} 
                timeData={timeData} 
                showMusicPreview={currentStep !== 4} // Não mostrar preview durante busca no step 4
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}