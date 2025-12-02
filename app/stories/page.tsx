'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, Settings, Crown, Play } from 'lucide-react'
import StoryModal from '@/components/stories/StoryModal'
import { availableTemplates, getTemplateById } from '@/lib/storyTemplates'
import type { StoryConfig } from '@/types/stories'
import FixedFooter from '@/components/ui/FixedFooter'

function StoriesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const retrospectiveId = searchParams.get('id')
  
  const [configuredStories, setConfiguredStories] = useState<StoryConfig[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null)
  const [editingConfig, setEditingConfig] = useState<StoryConfig | null>(null)

  const handleConfigure = (templateId: string) => {
    const existingConfig = configuredStories.find(story => story.id === templateId)
    setCurrentTemplate(templateId)
    setEditingConfig(existingConfig || null)
    setModalOpen(true)
  }

  const handleSaveStory = (config: StoryConfig) => {
    setConfiguredStories(prev => {
      const existing = prev.findIndex(story => story.id === config.id)
      if (existing >= 0) {
        // Update existing
        const updated = [...prev]
        updated[existing] = config
        return updated
      } else {
        // Add new
        return [...prev, config]
      }
    })
    setModalOpen(false)
    setCurrentTemplate(null)
    setEditingConfig(null)
  }

  const handleRemoveStory = (storyId: string) => {
    setConfiguredStories(prev => prev.filter(story => story.id !== storyId))
  }

  const handlePreview = (templateId: string) => {
    const template = getTemplateById(templateId)
    const config = configuredStories.find(story => story.id === templateId)
    
    if (config) {
      // Preview configurado
      alert(`Preview do story configurado: ${template?.name}`)
    } else {
      // Preview com dados mock
      alert(`Preview do template: ${template?.name}`)
    }
  }

  const handleContinue = () => {
    if (configuredStories.length === 0) return
    
    // TODO: Save configured stories to database
    console.log('Configured stories:', configuredStories)
    router.push(`/view/${retrospectiveId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'hard': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Rápido'
      case 'medium': return 'Médio'
      case 'hard': return 'Detalhado'
      default: return 'Normal'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 pb-24 md:pb-20">
      
      {/* Header */}
      <div className="bg-white border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Monte sua História ✨
              </h1>
              <p className="text-gray-600 mt-1">
                Configure stories únicos para sua retrospectiva
              </p>
            </div>
            
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              {configuredStories.length} configurados
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTemplates.map((template) => {
              const isConfigured = configuredStories.find(story => story.id === template.id)
              
              return (
                <div
                  key={template.id}
                  className={`
                    relative bg-white rounded-2xl p-6 shadow-lg transition-all transform hover:scale-105 border-2
                    ${isConfigured 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                    }
                  `}
                >
                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}

                  {/* Configured Badge */}
                  {isConfigured && (
                    <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  
                  {/* Story Content */}
                  <div className="text-center space-y-4">
                    <div className="text-5xl">{template.icon}</div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">{template.name}</h3>
                      <p className="text-gray-600 text-sm">{template.description}</p>
                    </div>

                    {/* Difficulty Badge */}
                    <div className={`inline-block text-xs px-2 py-1 rounded-full bg-gray-100 ${getDifficultyColor(template.difficulty)}`}>
                      {getDifficultyLabel(template.difficulty)}
                    </div>

                    {/* Estimated Time */}
                    <div className="text-xs text-gray-500">
                      ~{template.estimatedTime} min para configurar
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handlePreview(template.id)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                    
                    <button
                      onClick={() => handleConfigure(template.id)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 ${
                        isConfigured 
                          ? 'bg-purple-100 hover:bg-purple-200 text-purple-700' 
                          : 'bg-purple-500 hover:bg-purple-600 text-white'
                      }`}
                    >
                      <Settings className="w-3 h-3" />
                      <span>{isConfigured ? 'Editar' : 'Configurar'}</span>
                    </button>
                  </div>

                  {/* Remove button for configured stories */}
                  {isConfigured && (
                    <button
                      onClick={() => handleRemoveStory(template.id)}
                      className="mt-2 w-full text-red-600 hover:text-red-700 text-sm"
                    >
                      Remover Configuração
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Configured Stories Summary */}
          {configuredStories.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Stories Configurados ({configuredStories.length})
              </h3>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {configuredStories.map((story, index) => {
                  const template = getTemplateById(story.id)
                  if (!template) return null
                  
                  return (
                    <div key={story.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center space-x-3">
                      <span className="text-sm font-medium text-purple-600">#{index + 1}</span>
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{template.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {template.isPremium && (
                            <span className="text-xs text-yellow-600">Premium</span>
                          )}
                          <span className="text-xs text-green-600 font-medium">✓ Configurado</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-800">
                  <span className="font-semibold">Duração total:</span> {configuredStories.length * 30} segundos ({Math.round(configuredStories.length / 2)} min)
                </div>
              </div>
            </div>
          )}


          {/* Story Configuration Modal */}
          {modalOpen && currentTemplate && (
            <StoryModal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false)
                setCurrentTemplate(null)
                setEditingConfig(null)
              }}
              template={getTemplateById(currentTemplate)!}
              currentConfig={editingConfig || undefined}
              onSave={handleSaveStory}
            />
          )}
        </div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter
        singleButton={true}
        singleButtonLabel={
          configuredStories.length === 0 
            ? 'Configure pelo menos 1 story' 
            : `Finalizar com ${configuredStories.length} ${configuredStories.length === 1 ? 'story' : 'stories'}`
        }
        singleButtonOnClick={handleContinue}
        singleButtonDisabled={configuredStories.length === 0}
        helperText={
          configuredStories.length > 0 
            ? 'Sua retrospectiva será criada com os stories configurados'
            : undefined
        }
      />
    </div>
  )
}

export default function StoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-gray-600 mt-4">Carregando stories...</p>
        </div>
      </div>
    }>
      <StoriesContent />
    </Suspense>
  )
}
