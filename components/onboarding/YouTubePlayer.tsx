'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface YouTubePlayerProps {
  videoId: string | null
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onReady?: () => void
}

export default function YouTubePlayer({ 
  videoId, 
  isPlaying, 
  onPlay, 
  onPause, 
  onReady 
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(script)

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer()
      }
    } else {
      initializePlayer()
    }

    function initializePlayer() {
      if (containerRef.current && videoId) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          width: '100%',
          height: '200',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready')
              onReady?.()
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                onPlay()
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                onPause()
              }
            }
          }
        })
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [videoId])

  useEffect(() => {
    if (!playerRef.current) return

    try {
      if (isPlaying) {
        playerRef.current.playVideo()
      } else {
        playerRef.current.pauseVideo()
      }
    } catch (error) {
      console.error('Error controlling YouTube player:', error)
    }
  }, [isPlaying])

  if (!videoId) {
    return (
      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Selecione uma música para reproduzir</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />
    </div>
  )
}