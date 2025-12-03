'use client'

import { useState, useEffect } from 'react'
import type { StarMapConfig, StoryComponentProps } from '@/types/wrapped'

export default function StarMapStory({ config, onComplete }: StoryComponentProps<StarMapConfig>) {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    // Reveal after 2 seconds
    const timer = setTimeout(() => {
      setIsRevealed(true)
    }, 2000)

    // Auto-complete after 10 seconds
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 10000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const date = new Date(config.specialDate)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 relative overflow-hidden" style={{ color: '#000000' }}>
      {/* Starry background effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <div className={`text-6xl mb-6 transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          ⭐
        </div>
        <h2 className={`text-3xl font-bold mb-4 transition-all duration-1000 delay-300 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ color: '#000000' }}>
          {config.customTitle || 'O Céu do Nosso Encontro'}
        </h2>
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-1000 delay-500 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>{formattedDate}</div>
          {config.customMessage && (
            <p className="mt-4" style={{ color: '#374151' }}>{config.customMessage}</p>
          )}
          <div className="mt-6 text-sm" style={{ color: '#4B5563' }}>
            {config.location && (
              <p>📍 {config.location.lat.toFixed(4)}, {config.location.lng.toFixed(4)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

