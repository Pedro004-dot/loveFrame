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

  // Format date to show month and year
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-900 relative animate-in fade-in duration-500">
      {/* Starry background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20px 30px, white, transparent),
                            radial-gradient(2px 2px at 60px 70px, white, transparent),
                            radial-gradient(1px 1px at 50px 50px, white, transparent),
                            radial-gradient(1px 1px at 80px 10px, white, transparent),
                            radial-gradient(2px 2px at 90px 40px, white, transparent),
                            radial-gradient(1px 1px at 130px 80px, white, transparent),
                            radial-gradient(1px 1px at 160px 30px, white, transparent)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}></div>
      </div>

      <div ref={scrollRef} className="relative min-h-full flex flex-col items-center py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            {config.customTitle || 'Nossa Jornada'}
          </h2>
          <p className="text-gray-400 text-sm">Cada momento que nos trouxe até aqui</p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-2xl w-full">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-pink-500"></div>

          {/* Events */}
          <div className="space-y-20">
            {sortedEvents.map((event, index) => {
              const isVisible = visibleEvents.includes(index)
              const isEven = index % 2 === 0
              const monthYear = formatDate(event.date)

              return (
                <div
                  key={event.id}
                  className={`relative transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 transform translate-y-0'
                      : 'opacity-0 transform translate-y-8'
                  }`}
                  style={{ minHeight: '250px' }}
                >
                  {/* Heart icon on timeline - centered vertically */}
                  <div className="absolute left-1/2 z-10" style={{ 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }}>
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg border-2 border-pink-300">
                      <span className="text-white text-xl">💕</span>
                    </div>
                  </div>

                  {/* Content - alternates left/right */}
                  <div className={`w-full flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Photo (left side for even, right side for odd) */}
                    {event.imageUrl && (
                      <div className={`flex-shrink-0 ${isEven ? 'order-1' : 'order-2'}`}>
                        <div className="bg-white p-3 rounded shadow-2xl" style={{ 
                          transform: 'rotate(-1deg)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                          width: '200px'
                        }}>
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-56 object-cover rounded-sm"
                          />
                          {event.description && (
                            <p className="mt-3 text-xs text-gray-800 text-center px-2" style={{
                              fontFamily: '"Comic Sans MS", cursive, sans-serif',
                              fontSize: '11px',
                              lineHeight: '1.4',
                              fontStyle: 'italic'
                            }}>
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text content (right side for even, left side for odd) */}
                    <div className={`flex-1 ${isEven ? 'order-2 text-left' : 'order-1 text-right'} ${!event.imageUrl ? 'w-full text-center' : ''}`}>
                      <div className={`${!event.imageUrl ? 'text-center' : ''}`}>
                        <div className="text-pink-400 font-semibold text-lg mb-3 capitalize">
                          {monthYear}
                        </div>
                        <div className="text-white text-base leading-relaxed">
                          {event.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer message */}
          {visibleEvents.length === sortedEvents.length && (
            <div className="text-center mt-16 mb-8 animate-in fade-in duration-500">
              <p className="text-white text-2xl font-semibold mb-6">
                E estamos apenas começando!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

