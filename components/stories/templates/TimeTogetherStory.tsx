'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import type { StoryComponentProps, TimeTogetherConfig } from '@/types/stories'

export default function TimeTogetherStory({ 
  config, 
  isPreview = false, 
  onComplete,
  className = '' 
}: StoryComponentProps<TimeTogetherConfig>) {
  const [currentCount, setCurrentCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'counting' | 'highlight' | 'complete'>('counting')

  // Calculate time data
  const calculateTimeData = () => {
    const startDate = new Date(config.startDate)
    const now = new Date()
    const diffMs = now.getTime() - startDate.getTime()
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor(diffMs / (1000 * 60))
    
    return { days, hours, minutes }
  }

  const timeData = calculateTimeData()

  useEffect(() => {
    if (!isPreview) return

    setIsAnimating(true)
    let startTime = Date.now()
    let currentPhase = 'counting'
    setAnimationPhase('counting')

    const animate = () => {
      const elapsed = Date.now() - startTime
      const duration = 30000 // 30 segundos

      if (currentPhase === 'counting' && elapsed < 20000) {
        // 20 segundos de contagem
        const progress = elapsed / 20000
        const easeOut = 1 - Math.pow(1 - progress, 3) // Easing
        setCurrentCount(Math.floor(timeData.days * easeOut))
        requestAnimationFrame(animate)
      } else if (currentPhase === 'counting') {
        // Transição para highlight
        currentPhase = 'highlight'
        setAnimationPhase('highlight')
        setCurrentCount(timeData.days)
        startTime = Date.now()
        setTimeout(animate, 100)
      } else if (currentPhase === 'highlight' && elapsed < 8000) {
        // 8 segundos de highlight
        requestAnimationFrame(animate)
      } else if (currentPhase === 'highlight') {
        // Finalização
        currentPhase = 'complete'
        setAnimationPhase('complete')
        setIsAnimating(false)
        setTimeout(() => {
          onComplete?.()
        }, 2000)
      }
    }

    animate()

    return () => {
      setIsAnimating(false)
      setCurrentCount(0)
      setAnimationPhase('counting')
    }
  }, [isPreview, timeData.days, onComplete])

  // Animação styles baseado na configuração
  const getAnimationStyle = () => {
    switch (config.animationStyle) {
      case 'heartbeat':
        return animationPhase === 'highlight' ? 'animate-pulse' : ''
      case 'pulse':
        return animationPhase === 'highlight' ? 'animate-ping' : ''
      default:
        return ''
    }
  }

  // Background gradient baseado na cor configurada
  const backgroundStyle = {
    background: `linear-gradient(135deg, ${config.backgroundColor}15, ${config.backgroundColor}40)`
  }

  if (isPreview) {
    return (
      <div 
        className={`h-full flex items-center justify-center text-white relative overflow-hidden ${className}`}
        style={{ backgroundColor: config.backgroundColor }}
      >
        {/* Background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white animate-pulse" />
          <div className="absolute bottom-20 right-20 w-16 h-16 rounded-full bg-white animate-pulse delay-1000" />
          <div className="absolute top-1/3 right-10 w-12 h-12 rounded-full bg-white animate-pulse delay-500" />
        </div>

        <div className="text-center max-w-md px-8">
          {animationPhase === 'counting' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-8" style={{ color: config.textColor }}>
                Tempo Juntos
              </h2>
              
              <div className={`space-y-4 ${getAnimationStyle()}`}>
                <div 
                  className="text-8xl font-bold transition-all duration-300"
                  style={{ color: config.textColor }}
                >
                  {currentCount.toLocaleString()}
                </div>
                <div className="text-2xl font-semibold" style={{ color: config.textColor }}>
                  dias de amor
                </div>
              </div>

              {config.customMessage && (
                <p className="text-lg opacity-75 mt-6" style={{ color: config.textColor }}>
                  {config.customMessage}
                </p>
              )}
            </div>
          )}

          {animationPhase === 'highlight' && (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <Heart className={`w-16 h-16 ${getAnimationStyle()}`} style={{ color: config.textColor }} />
              </div>
              
              <div className="text-9xl font-bold mb-4" style={{ color: config.textColor }}>
                {timeData.days.toLocaleString()}
              </div>
              <div className="text-3xl font-bold mb-6" style={{ color: config.textColor }}>
                dias juntos
              </div>

              {(config.showHours || config.showMinutes) && (
                <div className="grid grid-cols-2 gap-6 text-lg">
                  {config.showHours && (
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: config.textColor }}>
                        {timeData.hours.toLocaleString()}
                      </div>
                      <div className="opacity-75" style={{ color: config.textColor }}>horas</div>
                    </div>
                  )}
                  {config.showMinutes && (
                    <div className="text-center">
                      <div className="text-3xl font-bold" style={{ color: config.textColor }}>
                        {timeData.minutes.toLocaleString()}
                      </div>
                      <div className="opacity-75" style={{ color: config.textColor }}>minutos</div>
                    </div>
                  )}
                </div>
              )}

              {config.customMessage && (
                <p className="text-xl font-medium mt-8" style={{ color: config.textColor }}>
                  {config.customMessage}
                </p>
              )}
            </div>
          )}

          {animationPhase === 'complete' && (
            <div className="space-y-6 opacity-90">
              <div className="text-6xl">💕</div>
              <div className="text-2xl font-bold" style={{ color: config.textColor }}>
                Uma história linda!
              </div>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-out"
              style={{ 
                width: animationPhase === 'counting' ? '70%' : 
                       animationPhase === 'highlight' ? '90%' : '100%' 
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Static preview (for configuration)
  return (
    <div 
      className={`h-full flex items-center justify-center text-white ${className}`}
      style={backgroundStyle}
    >
      <div className="text-center max-w-md px-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: config.textColor }}>
          Tempo Juntos
        </h2>
        
        <div className="text-6xl font-bold mb-4" style={{ color: config.textColor }}>
          {timeData.days.toLocaleString()}
        </div>
        <div className="text-xl font-semibold mb-4" style={{ color: config.textColor }}>
          dias de amor
        </div>

        {config.customMessage && (
          <p className="text-sm opacity-75" style={{ color: config.textColor }}>
            {config.customMessage}
          </p>
        )}
      </div>
    </div>
  )
}