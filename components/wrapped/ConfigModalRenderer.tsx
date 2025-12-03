'use client'

import type { WrappedTemplate, WrappedConfig } from '@/types/wrapped'
import CoupleQuizConfigModal from './config/CoupleQuizConfigModal'
import WordGameConfigModal from './config/WordGameConfigModal'
import TimelineConfigModal from './config/TimelineConfigModal'
import PhotoStoriesConfigModal from './config/PhotoStoriesConfigModal'
import TimeStatsConfigModal from './config/TimeStatsConfigModal'
import SpecialMessagesConfigModal from './config/SpecialMessagesConfigModal'

interface ConfigModalRendererProps {
  isOpen: boolean
  onClose: () => void
  template: WrappedTemplate
  currentConfig?: WrappedConfig
  onSave: (config: WrappedConfig) => void
  retrospectiveId: string
}

export default function ConfigModalRenderer({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: ConfigModalRendererProps) {
  const commonProps = {
    isOpen,
    onClose,
    template,
    currentConfig,
    onSave,
    retrospectiveId
  }

  switch (template.id) {
    case 'couple-quiz':
      return <CoupleQuizConfigModal {...commonProps} />
    
    case 'word-game':
      return <WordGameConfigModal {...commonProps} />
    
    case 'timeline':
      return <TimelineConfigModal {...commonProps} />
    
    case 'photo-stories':
      return <PhotoStoriesConfigModal {...commonProps} />
    
    case 'time-stats':
      return <TimeStatsConfigModal {...commonProps} />
    
    case 'special-messages':
      return <SpecialMessagesConfigModal {...commonProps} />
    
    default:
      // Placeholder modal for other templates
      return (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${isOpen ? '' : 'hidden'}`}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-6">
                Modal de configuração para este template será implementado em breve.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )
  }
}

