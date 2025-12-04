'use client'

import type { OnboardingData, TimeData, YouTubeVideo } from '@/types/onboarding'
import { Play, Pause, SkipBack, SkipForward, Share } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface PreviewCardProps {
  data: OnboardingData
  timeData: TimeData
  onWrappedClick?: () => void
  hasWrapped?: boolean
  showMusicPreview?: boolean // Controla se deve mostrar preview da música
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function PreviewCard({ data, timeData, onWrappedClick, hasWrapped = false, showMusicPreview = true }: PreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef<any>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showFullMessage, setShowFullMessage] = useState(false)

  // Debug: verificar dados recebidos
  useEffect(() => {
    console.log('[PreviewCard] Data received:', {
      hasGalleryUrls: !!data.coupleGalleryPhotoUrls,
      galleryUrlsType: Array.isArray(data.coupleGalleryPhotoUrls) ? 'array' : typeof data.coupleGalleryPhotoUrls,
      galleryUrlsLength: Array.isArray(data.coupleGalleryPhotoUrls) ? data.coupleGalleryPhotoUrls.length : 0,
      galleryUrls: data.coupleGalleryPhotoUrls?.slice(0, 3).map((url: string) => url?.substring(0, 50) + '...') || []
    })
  }, [data.coupleGalleryPhotoUrls])

  useEffect(() => {
    // Load YouTube API only once
    if (!window.YT && data.selectedTrack) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(script)

      window.onYouTubeIframeAPIReady = () => {
        setIsPlayerReady(true)
      }
    } else if (window.YT && data.selectedTrack) {
      setIsPlayerReady(true)
    }
  }, [data.selectedTrack])

  useEffect(() => {
    // Limpar player anterior se a música mudou
    if (playerRef.current) {
      try {
        playerRef.current.destroy()
        playerRef.current = null
        setIsPlaying(false)
        setCurrentTime(0)
        setDuration(0)
        stopTimeTracking()
      } catch (error) {
        console.log('Error destroying previous player:', error)
      }
    }

    if (isPlayerReady && data.selectedTrack && !playerRef.current) {
      // Create invisible player
      try {
      playerRef.current = new window.YT.Player('youtube-player-hidden', {
        height: '0',
        width: '0',
        videoId: data.selectedTrack.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
            rel: 0,
            enablejsapi: 1
        },
        events: {
            onReady: (event: any) => {
            console.log('YouTube player ready for background playback')
              // Aguardar um pouco mais e verificar se o método está disponível
            setTimeout(() => {
                if (playerRef.current && typeof playerRef.current.getDuration === 'function') {
                  try {
                    const videoDuration = playerRef.current.getDuration()
                    if (videoDuration && videoDuration > 0) {
                      setDuration(videoDuration)
                    }
                  } catch (error) {
                    console.log('Error getting duration:', error)
                  }
              }
              }, 1500)
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
              startTimeTracking()
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false)
              stopTimeTracking()
              }
            },
            onError: (event: any) => {
              console.log('YouTube player error:', event.data)
            }
          }
        })
      } catch (error) {
        console.error('Error creating YouTube player:', error)
        }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
          playerRef.current = null
        } catch (error) {
          console.log('Error destroying player:', error)
        }
      }
    }
  }, [isPlayerReady, data.selectedTrack?.videoId])

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime()
          setCurrentTime(time || 0)
        } catch (error) {
          console.log('Error getting current time:', error)
        }
      }
    }, 1000)
  }

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!playerRef.current) return

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch (error) {
      console.error('Error controlling playback:', error)
    }
  }

  const handleRestart = () => {
    if (!playerRef.current) return

    try {
      playerRef.current.seekTo(0)
      setCurrentTime(0)
      if (!isPlaying) {
        playerRef.current.playVideo()
      }
    } catch (error) {
      console.error('Error restarting video:', error)
    }
  }

  const handleNext = () => {
    if (!playerRef.current) return

    try {
      playerRef.current.pauseVideo()
    } catch (error) {
      console.error('Error pausing video:', error)
    }
  }

  useEffect(() => {
    return () => {
      stopTimeTracking()
    }
  }, [])

  const displayTitle = data.selectedTrack ? (data.selectedTrack.customTitle || data.selectedTrack.title) : ''
  const displayArtist = data.selectedTrack ? (data.selectedTrack.customArtist || data.selectedTrack.artist) : ''

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      
      {/* Header - Estilo Spotify: SETA - TÍTULO - EMOJI - COMPARTILHAR */}
      <div className="bg-gray-900 px-4 py-3 flex items-center justify-between rounded-t-2xl">
        <button className="text-white hover:text-gray-300 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white font-semibold text-base text-center flex-1">
          {data.giftTitle || 'Juntos para sempre'} ❤️
        </h1>
        <button 
          onClick={() => {
            // Trigger share - this will be handled by parent component
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('openShareMenu'))
            }
          }}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Compartilhar"
        >
          <Share className="w-6 h-6" />
        </button>
      </div>

      {/* Hero Card - Foto da Música com Player Sobreposto (Estilo Spotify) */}
      {data.selectedTrack && showMusicPreview && (
        <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden rounded-2xl mb-4">
          {/* Foto de Fundo com Blur - Estilo Spotify */}
          {data.musicCoverPhotoUrl ? (
            <div className="absolute inset-0">
              <img 
                src={data.musicCoverPhotoUrl} 
                alt="Music cover" 
                className="w-full h-full object-cover scale-110"
                style={{ filter: 'blur(0.5px)' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (data.selectedTrack?.thumbnail) {
                    target.src = data.selectedTrack.thumbnail
                  }
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0">
              <img 
                src={data.selectedTrack.thumbnail} 
                alt="Music thumbnail" 
                className="w-full h-full object-cover scale-110"
                style={{ filter: 'blur(20px)' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
          )}
          
          {/* Overlay Escuro Sutil - Garantir que não vaze para outras seções */}
          <div className="absolute inset-0 bg-black/40 rounded-2xl" />

          {/* Conteúdo Sobreposto - Estilo Spotify */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16 text-white rounded-2xl">
            {/* Controles do Player - Primeiro */}
            <div className="space-y-4 mb-6">
              {/* Progress Bar - Estilo Spotify */}
              <div>
                <div className="flex justify-between text-sm text-white/80 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{duration > 0 ? `-${formatTime(duration - currentTime)}` : '--:--'}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
              </div>

              {/* Controls - Estilo Spotify */}
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={handleRestart}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <SkipBack className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-pink-600" />
                  ) : (
                    <Play className="w-8 h-8 text-pink-600 ml-1" />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <SkipForward className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Informações da Música - Abaixo dos Controles */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold leading-tight">{displayTitle}</h3>
                
              </div>
              <p className="text-lg text-white/90">{displayArtist}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sobre o Casal - Estilo Spotify (Fundo Escuro) */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden">
        {/* Foto com Título Sobreposto */}
        {data.timeCounterPhotoUrl ? (
          <div className="relative">
            <img 
              src={data.timeCounterPhotoUrl} 
              alt="Couple photo" 
              className="w-full h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            {/* Título sobreposto na foto */}
            <div className="absolute top-4 left-4">
              <h2 className="text-white font-bold text-xl drop-shadow-lg">Sobre o casal</h2>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4">
            <h2 className="text-white font-bold text-xl mb-6">Sobre o casal</h2>
          </div>
        )}

        {/* Conteúdo abaixo da foto */}
        <div className="px-6 py-6">
          {/* Nomes e Data */}
          {data.userName && data.partnerName && (
            <div className="mb-6">
              <h3 className="text-white text-2xl font-bold mb-1">
                {data.userName} e {data.partnerName}
              </h3>
              {data.relationshipStart && (
                <p className="text-gray-400 text-sm">
                  Juntos desde {new Date(data.relationshipStart).getFullYear()}
                </p>
              )}
            </div>
          )}

        {/* Contador de Tempo - Grid Estilo Spotify */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-pink-500/20 border border-pink-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-1">{timeData.years}</div>
            <div className="text-xs text-pink-300 font-medium">Anos</div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{timeData.months}</div>
            <div className="text-xs text-purple-300 font-medium">Meses</div>
          </div>
          <div className="bg-pink-500/20 border border-pink-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-1">{timeData.days}</div>
            <div className="text-xs text-pink-300 font-medium">Dias</div>
          </div>
        </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-purple-400 mb-1">{timeData.hours}</div>
              <div className="text-xs text-purple-300">Horas</div>
            </div>
            <div className="bg-pink-500/20 border border-pink-500/30 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-pink-400 mb-1">{timeData.minutes}</div>
              <div className="text-xs text-pink-300">Minutos</div>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-purple-400 mb-1">{timeData.seconds}</div>
              <div className="text-xs text-purple-300">Segundos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem Especial - Card Estilo Spotify */}
      {data.specialMessage && (
        <div className="px-6 py-5 bg-blue-500 rounded-2xl shadow-lg">
          <h3 className="text-white font-bold text-lg mb-3">Mensagem especial</h3>
          <p className={`text-white text-sm leading-relaxed ${!showFullMessage && data.specialMessage.length > 100 ? 'line-clamp-3' : ''}`}>
            {data.specialMessage}
          </p>
          {data.specialMessage.length > 100 && (
            <button 
              onClick={() => setShowFullMessage(!showFullMessage)}
              className="mt-3 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              {showFullMessage ? 'Ocultar Mensagem' : 'Mostrar Mensagem'}
            </button>
          )}
        </div>
      )}

      {/* Galeria de Fotos do Casal - Estilo Spotify (Fundo Escuro) */}
      {data.coupleGalleryPhotoUrls && Array.isArray(data.coupleGalleryPhotoUrls) && data.coupleGalleryPhotoUrls.length > 0 && (
        <div className="px-6 py-5 bg-gray-800 rounded-2xl">
          <h3 className="text-white font-semibold text-lg mb-4">
            Conheça {data.userName && data.partnerName ? `${data.userName} e ${data.partnerName}` : 'o casal'}
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {data.coupleGalleryPhotoUrls
              .filter((url) => url && typeof url === 'string' && url.trim() !== '') // Filtrar URLs vazias e garantir que são strings
              .map((url, index) => {
                // Debug log para verificar URLs
                if (index === 0) {
                  console.log('[PreviewCard] Rendering gallery photos:', {
                    totalUrls: data.coupleGalleryPhotoUrls.length,
                    validUrls: data.coupleGalleryPhotoUrls.filter((u: string) => u && typeof u === 'string' && u.trim() !== '').length,
                    firstUrl: url?.substring(0, 50) + '...'
                  })
                }
                return (
                  <div key={index} className="flex-shrink-0">
                    <img 
                      src={url} 
                      alt={`Gallery photo ${index + 1}`}
                      className="w-28 h-28 object-cover rounded-xl shadow-lg border-2 border-gray-700"
                      onError={(e) => {
                        // Se a imagem falhar, logar o erro mas não esconder imediatamente
                        const target = e.target as HTMLImageElement
                        console.warn('[PreviewCard] Failed to load gallery image:', {
                          index,
                          url: url?.substring(0, 50) + '...',
                          error: 'Image load failed'
                        })
                        // Esconder apenas após confirmar que realmente falhou
                        setTimeout(() => {
                          if (target.naturalWidth === 0) {
                            target.style.display = 'none'
                          }
                        }, 1000)
                      }}
                      onLoad={() => {
                        console.log('[PreviewCard] Successfully loaded gallery image:', index)
                      }}
            />
          </div>
                )
              })}
          </div>
        </div>
      )}

      {/* CTA - Seu Relacionamento Wrapped - Estilo Spotify */}
      <div className="px-6 py-8 bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500 text-center rounded-b-2xl">
        <h2 className="text-white text-2xl font-bold mb-2 leading-tight">
          Seu Relacionamento<br />Wrapped
        </h2>
        <p className="text-white/90 text-sm mb-6">
          {data.userName ? `Explore o seu tempo em casal, ${data.userName}` : 'Explore o seu tempo em casal'}
        </p>
        <button 
          onClick={hasWrapped && onWrappedClick ? onWrappedClick : undefined}
          disabled={!hasWrapped || !onWrappedClick}
          className={`bg-white hover:bg-pink-50 text-pink-600 px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
            !hasWrapped || !onWrappedClick ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {hasWrapped ? 'Vamos lá' : 'Em breve'}
          </button>
      </div>

      {/* Hidden YouTube Player - Sempre presente no DOM */}
      <div 
        id="youtube-player-hidden" 
        style={{ 
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      ></div>
    </div>
  )
}
