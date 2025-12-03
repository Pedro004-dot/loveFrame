'use client'

import { useState, useEffect } from 'react'
import type { PhotoStoriesConfig, StoryComponentProps } from '@/types/wrapped'

export default function PhotoStoriesStory({ config, onComplete }: StoryComponentProps<PhotoStoriesConfig>) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    // Auto-advance photos
    if (currentPhotoIndex < config.photos.length - 1) {
      const timer = setTimeout(() => {
        setCurrentPhotoIndex(currentPhotoIndex + 1)
      }, 5000) // 5 seconds per photo
      return () => clearTimeout(timer)
    } else {
      // Last photo - complete after delay
      const timer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentPhotoIndex, config.photos.length, onComplete])

  const currentPhoto = config.photos[currentPhotoIndex]

  if (!currentPhoto) {
    return null
  }

  return (
    <div className="w-full h-full relative bg-black animate-in fade-in duration-500">
      <img
        src={currentPhoto.imageUrl}
        alt={currentPhoto.caption || `Foto ${currentPhotoIndex + 1}`}
        className="w-full h-full object-cover"
      />
      
      {config.showCaptions && currentPhoto.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
          <p className="text-white text-xl font-semibold text-center">
            {currentPhoto.caption}
          </p>
        </div>
      )}

      {/* Photo Counter */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
        {currentPhotoIndex + 1} / {config.photos.length}
      </div>
    </div>
  )
}

