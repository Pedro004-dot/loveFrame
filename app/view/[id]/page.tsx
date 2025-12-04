'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Share, Download, Heart } from 'lucide-react'

// Services
import { RetrospectiveService } from '@/lib/retrospectiveService'
import type { Retrospective } from '@/lib/supabase'
import type { OnboardingData } from '@/types/onboarding'
import { getPublicUrl } from '@/lib/supabase'
import PreviewCard from '@/components/onboarding/PreviewCard'
import { useTimeCalculator } from '@/hooks/useTimeCalculator'
import ShareMenu from '@/components/view/ShareMenu'
import { exportAsImage } from '@/utils/exportUtils'
import { getShareableUrl } from '@/utils/shareUtils'
import OnboardingStorageService from '@/lib/onboardingStorage'
import { WrappedService } from '@/lib/wrappedService'
import StoriesViewer from '@/components/wrapped/StoriesViewer'
import type { WrappedConfig } from '@/types/wrapped'

export default function ViewerPage() {
  const params = useParams()
  const router = useRouter()
  const retrospectiveId = params.id as string

  const [retrospective, setRetrospective] = useState<Retrospective | null>(null)
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [showWrappedStories, setShowWrappedStories] = useState(false)
  const [wrappedStories, setWrappedStories] = useState<WrappedConfig[]>([])

  const loadWrappedTemplates = async (retrospectiveId: string) => {
    try {
      const templates = await WrappedService.getWrappedTemplates(retrospectiveId)
      setWrappedStories(templates)
      console.log('[View Page] Loaded wrapped templates:', templates.length)
    } catch (error) {
      console.error('Error loading wrapped templates:', error)
      setWrappedStories([])
      }
    }

  useEffect(() => {
    loadRetrospective()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrospectiveId])

  // Load wrapped templates when retrospective is loaded
  useEffect(() => {
    if (retrospective?.id) {
      loadWrappedTemplates(retrospective.id)
    }
  }, [retrospective?.id])

  // Listen for share menu event from PreviewCard
  useEffect(() => {
    const handleOpenShareMenu = () => {
      setShowShareMenu(true)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('openShareMenu', handleOpenShareMenu)
      return () => {
        window.removeEventListener('openShareMenu', handleOpenShareMenu)
      }
    }
  }, [])

  const loadRetrospective = async () => {
    try {
      // PRIMEIRO: Tentar buscar do localStorage (mais rápido e confiável)
      if (OnboardingStorageService.hasData()) {
        const storedData = OnboardingStorageService.getData()
        const onboardingDataFromStorage = OnboardingStorageService.toOnboardingData(storedData)
        
        // Debug: verificar se as URLs estão presentes
        console.log('[View Page] Loaded from localStorage:', {
          hasMusicCover: !!onboardingDataFromStorage.musicCoverPhotoUrl,
          hasTimeCounter: !!onboardingDataFromStorage.timeCounterPhotoUrl,
          hasGallery: onboardingDataFromStorage.coupleGalleryPhotoUrls?.length || 0,
          musicCoverUrl: onboardingDataFromStorage.musicCoverPhotoUrl?.substring(0, 50) + '...',
          rawGalleryUrls: storedData.coupleGalleryPhotoUrls,
          rawGalleryUrlsLength: storedData.coupleGalleryPhotoUrls?.length || 0,
          processedGalleryUrls: onboardingDataFromStorage.coupleGalleryPhotoUrls,
          processedGalleryUrlsLength: onboardingDataFromStorage.coupleGalleryPhotoUrls?.length || 0,
          galleryUrlsSample: onboardingDataFromStorage.coupleGalleryPhotoUrls?.slice(0, 2).map((url: string) => url?.substring(0, 50) + '...') || []
        })
        
        // Verificar se temos dados completos no localStorage
        if (onboardingDataFromStorage.userName && onboardingDataFromStorage.partnerName) {
          // Verificar se o uniqueId corresponde
          const storedOnboardingData = localStorage.getItem('onboardingData')
          let storedUniqueId: string | null = null
          
          if (storedOnboardingData) {
            try {
              const parsedData = JSON.parse(storedOnboardingData)
              storedUniqueId = parsedData.uniqueId || parsedData.retrospectiveId || null
            } catch (e) {
              console.error('Error parsing stored onboarding data:', e)
            }
          }
          
          // Se corresponde ou se não temos ID na URL, usar dados do localStorage
          if (!storedUniqueId || storedUniqueId === retrospectiveId || !retrospectiveId) {
            console.log('[View Page] Setting onboardingData from localStorage with gallery:', {
              galleryCount: onboardingDataFromStorage.coupleGalleryPhotoUrls?.length || 0
            })
            
            // Garantir que temos um objeto OnboardingData completo
            const completeOnboardingData: OnboardingData = {
              userName: onboardingDataFromStorage.userName || '',
              partnerName: onboardingDataFromStorage.partnerName || '',
              relationshipStart: onboardingDataFromStorage.relationshipStart || '',
              relationshipTime: onboardingDataFromStorage.relationshipTime || '',
              giftTitle: onboardingDataFromStorage.giftTitle || '',
              selectedTrack: onboardingDataFromStorage.selectedTrack || null,
              coverPhoto: null,
              coverPhotoUrl: onboardingDataFromStorage.coverPhotoUrl || '',
              musicCoverPhoto: null,
              musicCoverPhotoUrl: onboardingDataFromStorage.musicCoverPhotoUrl || '',
              timeCounterPhoto: null,
              timeCounterPhotoUrl: onboardingDataFromStorage.timeCounterPhotoUrl || '',
              specialMessage: onboardingDataFromStorage.specialMessage || '',
              coupleGalleryPhotos: [],
              coupleGalleryPhotoUrls: onboardingDataFromStorage.coupleGalleryPhotoUrls || []
            }
            
            setOnboardingData(completeOnboardingData)
            setIsLoading(false)
            
            // Tentar buscar do banco em background apenas para incrementar view count
            // NÃO atualizar os dados do onboarding para preservar as fotos do localStorage
            if (storedUniqueId) {
              try {
                const { data } = await RetrospectiveService.getByUniqueId(storedUniqueId)
                if (data) {
                  setRetrospective(data)
                  // Apenas incrementar view count, não atualizar dados do onboarding
                  // Isso preserva as fotos do localStorage que são base64 e funcionam melhor
                  await RetrospectiveService.incrementViewCount(data.id)
                  // Wrapped templates will be loaded by useEffect when retrospective.id is set
                }
              } catch (e) {
                // Ignorar erro - já temos dados do localStorage
                console.debug('Could not load from database, using localStorage data')
              }
            }
            return
          }
        }
      }

      // SEGUNDO: Tentar buscar do banco de dados
      console.log('[View Page] Loading from database for ID:', retrospectiveId)
      const { data, error } = await RetrospectiveService.getByUniqueId(retrospectiveId)
      
      if (data) {
        setRetrospective(data)
        const dbData = convertRetrospectiveToOnboardingData(data)
        console.log('[View Page] Loaded from database, gallery count:', dbData.coupleGalleryPhotoUrls?.length || 0)
        setOnboardingData(dbData)
        // Increment view count
        await RetrospectiveService.incrementViewCount(data.id)
        // Wrapped templates will be loaded by useEffect when retrospective.id is set
        setIsLoading(false)
        return
      }

      // Se não encontrou nem no banco nem no localStorage, mostrar erro
      console.warn('Retrospective not found in database or localStorage')
    } catch (error) {
      console.error('Error loading retrospective:', error)
      
      // Em caso de erro, tentar buscar do localStorage como último recurso
      if (OnboardingStorageService.hasData()) {
        const storedData = OnboardingStorageService.getData()
        const onboardingDataFromStorage = OnboardingStorageService.toOnboardingData(storedData)
        
        if (onboardingDataFromStorage.userName && onboardingDataFromStorage.partnerName) {
          console.log('[View Page] Fallback: Using localStorage data after error')
          const completeOnboardingData: OnboardingData = {
            userName: onboardingDataFromStorage.userName || '',
            partnerName: onboardingDataFromStorage.partnerName || '',
            relationshipStart: onboardingDataFromStorage.relationshipStart || '',
            relationshipTime: onboardingDataFromStorage.relationshipTime || '',
            giftTitle: onboardingDataFromStorage.giftTitle || '',
            selectedTrack: onboardingDataFromStorage.selectedTrack || null,
            coverPhoto: null,
            coverPhotoUrl: onboardingDataFromStorage.coverPhotoUrl || '',
            musicCoverPhoto: null,
            musicCoverPhotoUrl: onboardingDataFromStorage.musicCoverPhotoUrl || '',
            timeCounterPhoto: null,
            timeCounterPhotoUrl: onboardingDataFromStorage.timeCounterPhotoUrl || '',
            specialMessage: onboardingDataFromStorage.specialMessage || '',
            coupleGalleryPhotos: [],
            coupleGalleryPhotoUrls: onboardingDataFromStorage.coupleGalleryPhotoUrls || []
          }
          setOnboardingData(completeOnboardingData)
          setIsLoading(false)
          return
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const convertRetrospectiveToOnboardingData = (retro: Retrospective): OnboardingData => {
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
        galleryPhotoUrls = retro.gallery_photos
          .filter((path: string) => path && path.trim() !== '') // Filtrar paths vazios
          .map((path: string) => {
            if (path.startsWith('http')) return path
            if (path) return getPublicUrl('retrospectives', path)
            return ''
          })
          .filter((url: string) => url !== '') // Filtrar URLs vazias
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
      coverPhotoUrl: (retro.cover_photo_path && retro.cover_photo_path.trim()) 
        ? getPublicUrl('retrospectives', retro.cover_photo_path) 
        : '',
      musicCoverPhoto: null,
      musicCoverPhotoUrl: (retro.music_cover_photo_path && retro.music_cover_photo_path.trim())
        ? getPublicUrl('retrospectives', retro.music_cover_photo_path)
        : '',
      timeCounterPhoto: null,
      timeCounterPhotoUrl: (retro.time_counter_photo_path && retro.time_counter_photo_path.trim())
        ? getPublicUrl('retrospectives', retro.time_counter_photo_path)
        : '',
      specialMessage: retro.special_message || '',
      coupleGalleryPhotos: [],
      coupleGalleryPhotoUrls: galleryPhotoUrls
    }

    return onboarding
  }

  // Calculate time data - sempre chamar o hook (regra dos Hooks do React)
  const timeData = useTimeCalculator(
    onboardingData?.relationshipStart || '', 
    onboardingData?.relationshipTime || ''
  )

  // Debug: monitorar mudanças em onboardingData
  useEffect(() => {
    if (onboardingData) {
      console.log('[View Page] onboardingData updated:', {
        hasGallery: onboardingData.coupleGalleryPhotoUrls?.length || 0,
        galleryUrls: onboardingData.coupleGalleryPhotoUrls?.map((url: string) => url?.substring(0, 50) + '...') || [],
        userName: onboardingData.userName,
        partnerName: onboardingData.partnerName
      })
    } else {
      console.log('[View Page] onboardingData is null')
    }
  }, [onboardingData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600 mt-4">Carregando sua história...</p>
        </div>
      </div>
    )
  }

  // Mostrar preview se temos onboardingData, mesmo sem retrospective do banco
  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">Retrospectiva não encontrada. Por favor, volte e crie uma nova.</p>
          <button 
            onClick={() => router.push('/create')} 
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Criar a sua história
          </button>
        </div>
      </div>
    )
  }

  // Usar unique_id do retrospective ou do parâmetro da URL
  const uniqueId = retrospective?.unique_id || retrospectiveId
  const shareUrl = typeof window !== 'undefined' ? getShareableUrl(uniqueId) : ''
  
  const handleDownload = async () => {
    const uniqueId = retrospective?.unique_id || retrospectiveId
    const success = await exportAsImage('retrospective-content', `retrospectiva-${uniqueId || 'loveframe'}.png`)
    if (!success) {
      alert('Erro ao exportar imagem. Tente novamente.')
    }
  }
    
    return (
    <div className="min-h-screen bg-gray-900">
      {/* Header removido - agora está no PreviewCard */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 pb-8">
        <div className="max-w-sm mx-auto space-y-4">
          {showWrappedStories && wrappedStories.length > 0 ? (
            /* Stories Viewer Inline */
            <div className="opacity-0 animate-fade-in-up" style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}>
              <StoriesViewer
                stories={wrappedStories}
                onClose={() => setShowWrappedStories(false)}
                startIndex={0}
              />
            </div>
          ) : (
            /* Preview Card */
            <div 
              id="retrospective-content" 
              className="opacity-0 animate-fade-in-up space-y-4"
              style={{
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <PreviewCard 
                data={onboardingData} 
                timeData={timeData}
                onWrappedClick={() => {
                  if (wrappedStories.length > 0) {
                    setShowWrappedStories(true)
                  }
                }}
                hasWrapped={wrappedStories.length > 0}
              />
            </div>
              )}
            </div>
      </main>

      {/* Footer de Compartilhamento - Hidden during stories - Estilo Spotify */}
      {!showWrappedStories && (
        <footer className="bg-gray-900 border-t border-gray-800 shadow-lg transition-all duration-300">
        <div className="container mx-auto px-1 py-1">
          <div className="flex items-center justify-center space-x-4">
                <button 
              onClick={() => setShowShareMenu(true)}
              className="flex flex-col items-center space-y-1 px-4 py-2 text-white hover:text-gray-300 hover:bg-gray-800 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                >
              <Share className="w-5 h-5 transition-transform hover:rotate-12" />
              <span className="text-xs font-medium">Compartilhar</span>
                </button>

              </div>
              
          <div className="text-center mt-3">
                <button
                  onClick={() => router.push('/')}
              className="text-sm text-pink-400 hover:text-pink-300 underline transition-colors duration-300 hover:scale-105"
                >
                  Criar a minha retrospectiva
                </button>
              </div>
            </div>
      </footer>
      )}

      {/* Share Menu */}
      <ShareMenu
        isOpen={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        url={shareUrl}
        title={onboardingData?.giftTitle || retrospective?.gift_title || 'Nossa História de Amor'}
        text="Veja nossa retrospectiva de relacionamento!"
      />
    </div>
  )
}
