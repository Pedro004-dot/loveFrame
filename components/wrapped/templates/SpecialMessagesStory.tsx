'use client'

import { useState, useEffect } from 'react'
import type { SpecialMessagesConfig, StoryComponentProps } from '@/types/wrapped'

export default function SpecialMessagesStory({ config, onComplete }: StoryComponentProps<SpecialMessagesConfig>) {
  const [revealedMessages, setRevealedMessages] = useState<number[]>([])

  useEffect(() => {
    // Reveal messages based on revealDelay or sequentially
    config.messages.forEach((message, index) => {
      const delay = message.revealDelay || (index * 3000)
      setTimeout(() => {
        setRevealedMessages(prev => [...prev, index])
      }, delay)
    })

    // Auto-complete after all messages are shown
    const lastMessage = config.messages[config.messages.length - 1]
    const totalDelay = (lastMessage?.revealDelay || (config.messages.length - 1) * 3000) + 5000
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, totalDelay)

    return () => clearTimeout(timer)
  }, [config.messages, onComplete])

  const sortedMessages = [...config.messages].sort((a, b) => a.order - b.order)

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 p-8 animate-in fade-in duration-500" style={{ color: '#000000' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">💌</div>
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>
          {config.customTitle || 'Mensagens Especiais'}
        </h2>

        <div className="space-y-6">
          {sortedMessages.map((message, index) => {
            const isRevealed = revealedMessages.includes(index)
            return (
              <div
                key={message.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-700 ${
                  isRevealed
                    ? 'opacity-100 transform scale-100'
                    : 'opacity-0 transform scale-95'
                }`}
              >
                <p className="text-lg leading-relaxed" style={{ color: '#000000' }}>
                  {message.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

