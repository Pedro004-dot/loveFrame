'use client'

import type { OnboardingData, TimeData, YouTubeVideo } from '@/types/onboarding'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface PreviewCardProps {
  data: OnboardingData
  timeData: TimeData
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function PreviewCard({ data, timeData }: PreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const playerRef = useRef<any>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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
    <div className="w-full max-w-sm mx-auto space-y-0 max-h-[85vh] overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-3xl shadow-2xl overflow-hidden">
      
      {/* Header Fixo - Delicado e Romântico */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <button className="text-pink-400 hover:text-pink-600 transition-colors">
          {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg> */}
        </button>
        <h1 className="text-pink-600 font-semibold text-base text-center flex-1">
          {data.giftTitle || 'Juntos para sempre'} ❤️
        </h1>
        <button className="text-pink-400 hover:text-pink-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Hero Card - Foto da Música com Player Sobreposto (Estilo Spotify/LovePanda) */}
      {data.selectedTrack && (
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {/* Foto de Fundo - Usa foto customizada ou thumbnail da música */}
          {data.musicCoverPhotoUrl ? (
            <img 
              src={data.musicCoverPhotoUrl} 
              alt="Music cover" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Se a imagem falhar, usar thumbnail como fallback
                const target = e.target as HTMLImageElement
                if (data.selectedTrack?.thumbnail) {
                  target.src = data.selectedTrack.thumbnail
                }
              }}
            />
          ) : (
            <img 
              src={data.selectedTrack.thumbnail} 
              alt="Music thumbnail" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Se o thumbnail também falhar, usar placeholder
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          )}
          
          {/* Overlay Gradiente Delicado */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Player Sobreposto na Parte Inferior - Estilo LovePanda */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-1 leading-tight">{displayTitle}</h3>
              <p className="text-white/90 text-sm">{displayArtist}</p>
              <div className="flex items-center mt-2">
                <span className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded-full">
                  ✓
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/70 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? `-${formatTime(duration - currentTime)}` : '--:--'}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-1000" 
                  style={{ 
                    width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>

            {/* Controls - Estilo LovePanda */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={handleRestart}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <SkipBack className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handlePlayPause}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-pink-600" />
                ) : (
                  <Play className="w-6 h-6 text-pink-600 ml-1" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <SkipForward className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sobre o Casal - Layout Delicado e Romântico */}
      <div className="px-6 py-6 bg-white/60 backdrop-blur-sm">
        <h2 className="text-gray-800 font-semibold text-lg mb-5">Sobre o casal</h2>
        
        {/* Foto Opcional Acima do Contador */}
        {data.timeCounterPhotoUrl && (
          <div className="mb-5 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={data.timeCounterPhotoUrl} 
              alt="Couple photo" 
              className="w-full h-56 object-cover"
              onError={(e) => {
                // Se a imagem falhar, esconder o elemento
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>
        )}


        {/* Contador de Tempo - Cards Delicados */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-4 text-center shadow-sm border border-pink-200/50">
            <div className="text-3xl font-bold text-pink-700 mb-1">{timeData.years}</div>
            <div className="text-xs text-pink-600 font-medium">Anos</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center shadow-sm border border-purple-200/50">
            <div className="text-3xl font-bold text-purple-700 mb-1">{timeData.months}</div>
            <div className="text-xs text-purple-600 font-medium">Meses</div>
          </div>
          <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-4 text-center shadow-sm border border-rose-200/50">
            <div className="text-3xl font-bold text-rose-700 mb-1">{timeData.days}</div>
            <div className="text-xs text-rose-600 font-medium">Dias</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-3 text-center shadow-sm border border-pink-100">
            <div className="text-xl font-bold text-pink-600 mb-1">{timeData.hours}</div>
            <div className="text-xs text-pink-500">Horas</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center shadow-sm border border-purple-100">
            <div className="text-xl font-bold text-purple-600 mb-1">{timeData.minutes}</div>
            <div className="text-xs text-purple-500">Minutos</div>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-3 text-center shadow-sm border border-rose-100">
            <div className="text-xl font-bold text-rose-600 mb-1">{timeData.seconds}</div>
            <div className="text-xs text-rose-500">Segundos</div>
          </div>
        </div>
      </div>

      {/* Mensagem Especial - Card Delicado */}
      {data.specialMessage && (
        <div className="px-6 py-5 mx-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
          <h3 className="text-white font-bold text-lg mb-3">Mensagem especial</h3>
          <p className="text-white/95 text-sm leading-relaxed line-clamp-3">
            {data.specialMessage}
          </p>
          {data.specialMessage.length > 100 && (
            <button className="mt-3 text-white/90 text-sm font-medium hover:text-white transition-colors bg-white/20 px-4 py-2 rounded-full">
              Mostrar Mensagem
            </button>
          )}
        </div>
      )}

      {/* Galeria de Fotos do Casal - Layout Horizontal Delicado */}
      {data.coupleGalleryPhotoUrls && Array.isArray(data.coupleGalleryPhotoUrls) && data.coupleGalleryPhotoUrls.length > 0 && (
        <div className="px-6 py-5 bg-white/60 backdrop-blur-sm">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">
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
                      className="w-28 h-28 object-cover rounded-2xl shadow-md border-2 border-pink-100"
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

      {/* CTA - Seu Relacionamento Wrapped - Delicado */}
      <div className="px-6 py-8 bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500 text-center rounded-b-3xl">
        <h2 className="text-white text-2xl font-bold mb-2 leading-tight">
          Seu Relacionamento<br />Wrapped
        </h2>
        <p className="text-white/90 text-sm mb-6">
          {data.userName ? `Explore o seu tempo em casal, ${data.userName}` : 'Explore o seu tempo em casal'}
        </p>
        <button className="bg-white hover:bg-pink-50 text-pink-600 px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
          Vamos lá
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
