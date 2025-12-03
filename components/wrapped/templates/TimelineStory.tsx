'use client'

import { useState, useEffect, useRef } from 'react'
import type { TimelineConfig, StoryComponentProps } from '@/types/wrapped'

export default function TimelineStory({ config, onComplete }: StoryComponentProps<TimelineConfig>) {
  const [visibleEvents, setVisibleEvents] = useState<number[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reveal events one by one
    config.events.forEach((_, index) => {
      setTimeout(() => {
        setVisibleEvents(prev => [...prev, index])
      }, index * 1500)
    })

    // Auto-complete after all events are shown
    const totalTime = config.events.length * 1500 + 3000
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, totalTime)

    return () => clearTimeout(timer)
  }, [config.events.length, onComplete])

  const sortedEvents = [...config.events].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateA - dateB
  })

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-in fade-in duration-500" style={{ color: '#000000' }}>
      <div ref={scrollRef} className="min-h-full flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
            {config.customTitle || 'Nossa Linha do Tempo'}
          </h2>
        </div>

        <div className="max-w-md w-full space-y-6">
          {sortedEvents.map((event, index) => {
            const isVisible = visibleEvents.includes(index)
            return (
              <div
                key={event.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-8'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1" style={{ color: '#000000' }}>
                    <div className="text-sm mb-1" style={{ color: '#4B5563' }}>
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>{event.title}</h3>
                    <p style={{ color: '#374151' }}>{event.description}</p>
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="mt-4 rounded-lg w-full h-48 object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

