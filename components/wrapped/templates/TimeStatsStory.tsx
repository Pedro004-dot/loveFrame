'use client'

import { useState, useEffect } from 'react'
import type { TimeStatsConfig, StoryComponentProps } from '@/types/wrapped'

export default function TimeStatsStory({ config, onComplete }: StoryComponentProps<TimeStatsConfig>) {
  const [revealedStats, setRevealedStats] = useState<number[]>([])

  useEffect(() => {
    // Reveal stats one by one
    config.stats.forEach((_, index) => {
      setTimeout(() => {
        setRevealedStats(prev => [...prev, index])
      }, index * 2000)
    })

    // Auto-complete after all stats are shown
    const totalTime = config.stats.length * 2000 + 3000
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, totalTime)

    return () => clearTimeout(timer)
  }, [config.stats.length, onComplete])

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 animate-in fade-in duration-500" style={{ color: '#000000' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">📊</div>
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>
          {config.customTitle || 'Estatísticas do Tempo'}
        </h2>

        <div className="space-y-6">
          {config.stats.map((stat, index) => {
            const isRevealed = revealedStats.includes(index)
            return (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-700 ${
                  isRevealed
                    ? 'opacity-100 transform scale-100 translate-y-0'
                    : 'opacity-0 transform scale-95 translate-y-8'
                }`}
              >
                <div className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>{stat.value}</div>
                <div className="text-lg" style={{ color: '#374151' }}>{stat.label}</div>
                {stat.icon && (
                  <div className="text-3xl mt-2">{stat.icon}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

