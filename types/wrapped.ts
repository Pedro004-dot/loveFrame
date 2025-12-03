// Wrapped Templates Types

// Base configuration for all wrapped templates
export interface BaseWrappedConfig {
  id: string
  templateId: string
  enabled: boolean
  order: number
  duration: number // Duration in seconds (default 30)
  customTitle?: string
}

// Available template types
export type WrappedTemplateType = 
  | 'couple-quiz'
  | 'word-game'
  | 'timeline'
  | 'photo-stories'
  | 'time-stats'
  | 'star-map'
  | 'roulette'
  | 'special-messages'

// Template metadata (available templates)
export interface WrappedTemplate {
  id: WrappedTemplateType
  name: string
  description: string
  icon: string
  category: 'statistics' | 'emotional' | 'interactive' | 'premium'
  isPremium: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // Time to configure in minutes
  previewImage?: string
}

// Couple Quiz Configuration
export interface CoupleQuizConfig extends BaseWrappedConfig {
  type: 'couple-quiz'
  questions: {
    id: string
    question: string
    options: string[]
    correctAnswer: number // Index of correct answer
    explanation?: string
  }[]
  showScore: boolean
  backgroundColor?: string
  textColor?: string
}

// Word Game Configuration
export interface WordGameConfig extends BaseWrappedConfig {
  type: 'word-game'
  words: {
    word: string
    description: string
    order: number
  }[]
  revealAnimation: 'fade' | 'slide' | 'typewriter'
  backgroundColor?: string
  textColor?: string
}

// Timeline Configuration
export interface TimelineConfig extends BaseWrappedConfig {
  type: 'timeline'
  events: {
    id: string
    date: string
    title: string
    description: string
    imageUrl?: string
    order: number
  }[]
  scrollDirection: 'vertical' | 'horizontal'
  backgroundColor?: string
}

// Photo Stories Configuration
export interface PhotoStoriesConfig extends BaseWrappedConfig {
  type: 'photo-stories'
  photos: {
    id: string
    imageUrl: string
    caption: string
    order: number
  }[]
  transitionStyle: 'fade' | 'slide' | 'zoom'
  showCaptions: boolean
}

// Time Stats Configuration
export interface TimeStatsConfig extends BaseWrappedConfig {
  type: 'time-stats'
  stats: {
    label: string
    value: string | number
    icon?: string
  }[]
  chartType?: 'bar' | 'pie' | 'line'
  backgroundColor?: string
  accentColor?: string
}

// Star Map Configuration
export interface StarMapConfig extends BaseWrappedConfig {
  type: 'star-map'
  specialDate: string // Date when they met
  location?: {
    lat: number
    lng: number
  }
  customMessage?: string
  showConstellation?: boolean
}

// Roulette Configuration
export interface RouletteConfig extends BaseWrappedConfig {
  type: 'roulette'
  challenges: {
    id: string
    text: string
    category: 'memory' | 'fun' | 'romantic' | 'challenge'
    order: number
  }[]
  spinAnimation: boolean
}

// Special Messages Configuration
export interface SpecialMessagesConfig extends BaseWrappedConfig {
  type: 'special-messages'
  messages: {
    id: string
    text: string
    order: number
    revealDelay?: number // Seconds before revealing
  }[]
  revealStyle: 'fade' | 'typewriter' | 'slide'
  backgroundColor?: string
  textColor?: string
}

// Union type for all wrapped configs
export type WrappedConfig = 
  | CoupleQuizConfig
  | WordGameConfig
  | TimelineConfig
  | PhotoStoriesConfig
  | TimeStatsConfig
  | StarMapConfig
  | RouletteConfig
  | SpecialMessagesConfig

// Collection of wrapped templates for a retrospective
export interface WrappedCollection {
  retrospectiveId: string
  templates: WrappedConfig[]
  totalDuration: number // Sum of all durations
  createdAt: string
  updatedAt: string
}

// Database model for wrapped_templates table
export interface WrappedTemplateRecord {
  id: string
  retrospective_id: string
  template_id: WrappedTemplateType
  config: WrappedConfig
  order: number
  enabled: boolean
  created_at: string
  updated_at: string
}

// Props for story components
export interface StoryComponentProps<T extends WrappedConfig = WrappedConfig> {
  config: T
  isPreview?: boolean
  onComplete?: () => void
  onProgressPause?: (pause: boolean) => void
  className?: string
}

// Props for configuration modals
export interface WrappedConfigModalProps {
  isOpen: boolean
  onClose: () => void
  template: WrappedTemplate
  currentConfig?: WrappedConfig
  onSave: (config: WrappedConfig) => void
  retrospectiveId: string
}

