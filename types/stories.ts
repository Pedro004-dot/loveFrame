// Base story types and interfaces
export interface BaseStoryConfig {
  id: string
  enabled: boolean
  order: number
  customTitle?: string
  duration: number // sempre 30 segundos
}

export interface StoryField {
  key: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'file' | 'color'
  label: string
  placeholder?: string
  required: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
    fileTypes?: string[]
  }
  options?: { label: string; value: string }[]
}

export interface StoryTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'statistics' | 'emotional' | 'interactive' | 'premium'
  isPremium: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // tempo para configurar em minutos
  configFields: StoryField[]
  defaultConfig: Record<string, any>
}

// Specific story configurations
export interface TimeTogetherConfig extends BaseStoryConfig {
  type: 'time-together'
  startDate: string
  customMessage?: string
  showHours: boolean
  showMinutes: boolean
  animationStyle: 'counter' | 'heartbeat' | 'pulse'
  backgroundColor: string
  textColor: string
}

export interface FirstMeetingConfig extends BaseStoryConfig {
  type: 'first-meeting'
  meetingDate: string
  location: string
  description: string
  mood: 'romantic' | 'fun' | 'emotional'
}

export interface OurSongConfig extends BaseStoryConfig {
  type: 'our-song'
  songTitle: string
  artist: string
  youtubeId?: string
  specialLyric?: string
  whySpecial: string
}

export interface PhotoGalleryConfig extends BaseStoryConfig {
  type: 'photo-gallery'
  photos: {
    file: File
    caption: string
    order: number
  }[]
  transitionStyle: 'fade' | 'slide' | 'zoom'
  duration: number // duração por foto
}

export interface CoupleQuizConfig extends BaseStoryConfig {
  type: 'couple-quiz'
  questions: {
    question: string
    options: string[]
    correctAnswer: number
    explanation?: string
  }[]
  showScore: boolean
}

// Union type for all story configs
export type StoryConfig = 
  | TimeTogetherConfig 
  | FirstMeetingConfig 
  | OurSongConfig 
  | PhotoGalleryConfig 
  | CoupleQuizConfig

// Story component props
export interface StoryComponentProps<T extends StoryConfig = StoryConfig> {
  config: T
  isPreview?: boolean
  onComplete?: () => void
  className?: string
}

// Modal props
export interface StoryModalProps {
  isOpen: boolean
  onClose: () => void
  template: StoryTemplate
  currentConfig?: StoryConfig
  onSave: (config: StoryConfig) => void
}

// Stories collection for retrospective
export interface StoriesCollection {
  retrospectiveId: string
  stories: StoryConfig[]
  totalDuration: number // soma de todas as durações
  createdAt: string
  updatedAt: string
}