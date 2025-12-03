'use client'

import { useState, useEffect } from 'react'
import type { WordGameConfig, StoryComponentProps } from '@/types/wrapped'

export default function WordGameStory({ config, onComplete }: StoryComponentProps<WordGameConfig>) {
  const [revealedWords, setRevealedWords] = useState<number[]>([])

  // Reset when config changes
  useEffect(() => {
    setRevealedWords([])
  }, [config.id])

  useEffect(() => {
    // Show first word immediately
    if (config.words.length > 0) {
      setRevealedWords([0])
    }

    // Reveal remaining words one by one with delay
    const timers: NodeJS.Timeout[] = []
    
    config.words.forEach((_, index) => {
      if (index === 0) return // First word already shown
      const timer = setTimeout(() => {
        setRevealedWords(prev => [...prev, index])
      }, (index - 1) * 2000 + 2000)
      timers.push(timer)
    })

    // Auto-complete after all words are shown
    if (config.words.length > 0) {
      const totalTime = (config.words.length - 1) * 2000 + 5000
      const completeTimer = setTimeout(() => {
        if (onComplete) onComplete()
      }, totalTime)
      timers.push(completeTimer)
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [config.words.length, config.id, onComplete])

  const sortedWords = [...config.words].sort((a, b) => a.order - b.order)

  // If no words, show message
  if (sortedWords.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8" style={{ color: '#000000' }}>
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">💬</div>
          <h2 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>
            {config.customTitle || 'O que eu mais gosto em você'}
          </h2>
          <p className="text-lg" style={{ color: '#6B7280' }}>Nenhuma palavra configurada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 animate-in fade-in duration-500" style={{ color: '#000000' }}>
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">💬</div>
        <h2 className="text-3xl font-bold mb-8" style={{ color: '#000000' }}>
          {config.customTitle || 'O que eu mais gosto em você'}
        </h2>

        <div className="space-y-4">
          {sortedWords.map((word, sortedIndex) => {
            // Find original index in config.words
            const originalIndex = config.words.findIndex(w => w === word)
            const isRevealed = revealedWords.includes(originalIndex)
            
            return (
              <div
                key={word.word || sortedIndex}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 transition-all duration-500 ${
                  isRevealed
                    ? 'opacity-100 transform scale-100'
                    : 'opacity-0 transform scale-95'
                }`}
              >
                <div className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>{word.word || 'Palavra'}</div>
                {isRevealed && word.description && (
                  <div className="text-sm" style={{ color: '#374151' }}>{word.description}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

