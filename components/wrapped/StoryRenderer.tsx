'use client'

import type { WrappedConfig, CoupleQuizConfig, WordGameConfig, TimelineConfig, PhotoStoriesConfig, TimeStatsConfig, SpecialMessagesConfig, StarMapConfig, RouletteConfig } from '@/types/wrapped'
import CoupleQuizStory from './templates/CoupleQuizStory'
import WordGameStory from './templates/WordGameStory'
import TimelineStory from './templates/TimelineStory'
import PhotoStoriesStory from './templates/PhotoStoriesStory'
import TimeStatsStory from './templates/TimeStatsStory'
import SpecialMessagesStory from './templates/SpecialMessagesStory'
import StarMapStory from './templates/StarMapStory'
import RouletteStory from './templates/RouletteStory'

interface StoryRendererProps {
  config: WrappedConfig
  onComplete?: () => void
  onProgressPause?: (pause: boolean) => void
}

export default function StoryRenderer({ config, onComplete, onProgressPause }: StoryRendererProps) {
  switch (config.templateId) {
    case 'couple-quiz':
      return <CoupleQuizStory config={config as CoupleQuizConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'word-game':
      return <WordGameStory config={config as WordGameConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'timeline':
      return <TimelineStory config={config as TimelineConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'photo-stories':
      return <PhotoStoriesStory config={config as PhotoStoriesConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'time-stats':
      return <TimeStatsStory config={config as TimeStatsConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'special-messages':
      return <SpecialMessagesStory config={config as SpecialMessagesConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'star-map':
      return <StarMapStory config={config as StarMapConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    case 'roulette':
      return <RouletteStory config={config as RouletteConfig} onComplete={onComplete} onProgressPause={onProgressPause} />
    
    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-rose-500 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold">
              Template {config.templateId} em desenvolvimento
            </h2>
          </div>
        </div>
      )
  }
}

