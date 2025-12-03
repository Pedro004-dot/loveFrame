'use client'

import { useState, useEffect } from 'react'
import type { RouletteConfig, StoryComponentProps } from '@/types/wrapped'

export default function RouletteStory({ config, onComplete }: StoryComponentProps<RouletteConfig>) {
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    // Auto-select a random challenge after 1 second
    const timer = setTimeout(() => {
      if (config.challenges.length > 0) {
        setIsSpinning(true)
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * config.challenges.length)
          setSelectedChallenge(randomIndex)
          setIsSpinning(false)
        }, 2000)
      }
    }, 1000)

    // Auto-complete after showing challenge
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 8000)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [config.challenges.length, onComplete])

  const challenge = selectedChallenge !== null ? config.challenges[selectedChallenge] : null

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-8" style={{ color: '#000000' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎰</div>
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>
          {config.customTitle || 'Roleta Surpresa'}
        </h2>

        {isSpinning ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
            <div className="text-4xl mb-4 animate-spin">🎡</div>
            <p className="text-xl" style={{ color: '#000000' }}>Girando...</p>
          </div>
        ) : challenge ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 animate-in fade-in duration-500">
            <div className="text-3xl mb-4">
              {challenge.category === 'memory' && '💭'}
              {challenge.category === 'fun' && '🎉'}
              {challenge.category === 'romantic' && '💕'}
              {challenge.category === 'challenge' && '🎯'}
            </div>
            <p className="text-xl font-semibold leading-relaxed" style={{ color: '#000000' }}>
              {challenge.text}
            </p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8">
            <p className="text-lg" style={{ color: '#000000' }}>Preparando a roleta...</p>
          </div>
        )}
      </div>
    </div>
  )
}

