'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import type { WrappedConfig } from '@/types/wrapped'
import StoryRenderer from './StoryRenderer'

interface StoriesViewerProps {
  stories: WrappedConfig[]
  onClose: () => void
  startIndex?: number
}

export default function StoriesViewer({ stories, onClose, startIndex = 0 }: StoriesViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const [isProgressPaused, setIsProgressPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50

  // Define navigation functions first (before useEffects that use them)
  const goToNext = useCallback(() => {
    // Clear progress interval before changing
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgressPercent(0) // Reset progress
    } else {
      // Last story - close viewer
      onClose()
    }
  }, [currentIndex, stories.length, onClose])

  const goToPrevious = useCallback(() => {
    // Clear progress interval before changing
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgressPercent(0) // Reset progress
    }
  }, [currentIndex])

  // Progress bar animation for current story
  useEffect(() => {
    // Reset progress when story changes
    setProgressPercent(0)
    setIsProgressPaused(false)

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    // For interactive stories (like quiz), progress is controlled by completion
    // For now, we'll use a simple timer-based progress
    // You can customize this per story type if needed
    const duration = 10000 // 10 seconds default
    const interval = 50 // Update every 50ms for smoother animation
    const increment = (100 / duration) * interval

    if (!isProgressPaused) {
      progressIntervalRef.current = setInterval(() => {
        setProgressPercent((prev) => {
          const newProgress = Math.min(prev + increment, 100)
          return newProgress
        })
      }, interval)
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [currentIndex, isProgressPaused])

  // Handle progress pause/resume
  useEffect(() => {
    if (isProgressPaused) {
      // Pause: clear interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    } else {
      // Resume: start interval if not already running
      if (!progressIntervalRef.current && progressPercent < 100) {
        const duration = 10000
        const interval = 50
        const increment = (100 / duration) * interval

        progressIntervalRef.current = setInterval(() => {
          setProgressPercent((prev) => {
            const newProgress = Math.min(prev + increment, 100)
            return newProgress
          })
        }, interval)
      }
    }
  }, [isProgressPaused, progressPercent])

  // Auto-advance when progress reaches 100%
  useEffect(() => {
    if (progressPercent >= 100) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        goToNext()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [progressPercent, goToNext])

  const onTouchStart = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling
    e.preventDefault()
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling
    e.preventDefault()
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling
    e.preventDefault()
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < stories.length - 1) {
      goToNext()
    }
    if (isRightSwipe && currentIndex > 0) {
      goToPrevious()
    }
    
    // Reset touch states
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Handle story completion (e.g., from quiz)
  const handleStoryComplete = useCallback(() => {
    goToNext()
  }, [goToNext])

  // Handle progress pause (for interactive stories)
  const handleProgressPause = useCallback((pause: boolean) => {
    setIsProgressPaused(pause)
    if (pause && progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrevious()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToNext, goToPrevious, onClose])

  // Prevent scroll when viewing stories
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const currentStory = stories[currentIndex]

  if (!currentStory) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-sm mx-auto relative bg-black rounded-2xl overflow-hidden aspect-[9/16] shadow-2xl touch-none select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        maxHeight: 'calc(100vh - 4rem)',
        touchAction: 'pan-y pinch-zoom'
      }}
    >
      {/* Instagram-style Progress Bars */}
      <div className="absolute top-0 left-0 right-0 p-2 z-20 pointer-events-none">
        <div className="flex gap-1">
          {stories.map((_, index) => {
            let barWidth = '0%'
            if (index < currentIndex) {
              barWidth = '100%' // Completed stories
            } else if (index === currentIndex) {
              barWidth = `${progressPercent}%` // Current story progress
            }

            return (
              <div
                key={index}
                className="flex-1 h-0.5 sm:h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{ width: barWidth }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Header with Close Button */}
      <div className="absolute top-10 sm:top-12 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-4 pointer-events-none">
        <button
          onClick={onClose}
          className="text-white/90 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 active:scale-95 pointer-events-auto touch-manipulation"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="text-white/90 text-xs sm:text-sm font-medium">
          {currentIndex + 1} / {stories.length}
        </div>
        <button
          onClick={onClose}
          className="text-white/90 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 active:scale-95 pointer-events-auto touch-manipulation"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Story Content */}
      <div className="w-full h-full relative">
        <StoryRenderer
          key={`${currentStory.id}-${currentIndex}`}
          config={currentStory}
          onComplete={handleStoryComplete}
          onProgressPause={handleProgressPause}
        />
        
        {/* Clickable areas for navigation */}
        {/* Left side - Previous */}
        {currentIndex > 0 && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer touch-manipulation"
            aria-label="Story anterior"
            style={{ background: 'transparent' }}
          />
        )}
        
        {/* Right side - Next */}
        {currentIndex < stories.length - 1 && (
          <button
            onClick={goToNext}
            className="absolute right-0 top-0 bottom-0 w-1/3 z-10 cursor-pointer touch-manipulation"
            aria-label="Próximo story"
            style={{ background: 'transparent' }}
          />
        )}
      </div>
    </div>
  )
}

