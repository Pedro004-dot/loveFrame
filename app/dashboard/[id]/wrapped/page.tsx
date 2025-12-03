'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Settings, Check, Play, Trash2, GripVertical } from 'lucide-react'
import { WrappedService } from '@/lib/wrappedService'
import { RetrospectiveService } from '@/lib/retrospectiveService'
import type { WrappedTemplate, WrappedConfig, WrappedTemplateRecord } from '@/types/wrapped'
import type { Retrospective } from '@/lib/supabase'
import ConfigModalRenderer from '@/components/wrapped/ConfigModalRenderer'

export default function WrappedConfigPage() {
  const params = useParams()
  const router = useRouter()
  const retrospectiveId = params.id as string

  const [retrospective, setRetrospective] = useState<Retrospective | null>(null)
  const [availableTemplates, setAvailableTemplates] = useState<WrappedTemplate[]>([])
  const [configuredTemplates, setConfiguredTemplates] = useState<WrappedTemplateRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<WrappedTemplate | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [retrospectiveId])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load retrospective
      // Note: We need retrospective ID, but we have unique_id in URL
      // For now, we'll try to get it from localStorage or we need to modify the route
      const storedData = localStorage.getItem('onboardingData')
      let retroId = retrospectiveId
      
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          retroId = data.retrospectiveId || retrospectiveId
        } catch (e) {
          console.error('Error parsing stored data:', e)
        }
      }

      // Load available templates
      const templates = WrappedService.getAvailableTemplates()
      setAvailableTemplates(templates)

      // Load configured templates
      const records = await WrappedService.getWrappedTemplateRecords(retroId)
      setConfiguredTemplates(records)

      // Try to load retrospective details
      // This is a workaround - ideally we'd have the retrospective ID directly
      // For now, we'll work with what we have
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigureTemplate = (template: WrappedTemplate) => {
    setSelectedTemplate(template)
    setShowConfigModal(true)
  }

  const handleSaveTemplate = async (config: WrappedConfig) => {
    try {
      const result = await WrappedService.saveWrappedTemplate(retrospectiveId, config)
      if (result.success) {
        await loadData()
        setShowConfigModal(false)
        setSelectedTemplate(null)
      } else {
        alert('Erro ao salvar template. Tente novamente.')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Erro ao salvar template.')
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Tem certeza que deseja remover este template?')) {
      return
    }

    try {
      const result = await WrappedService.deleteWrappedTemplate(templateId)
      if (result.success) {
        await loadData()
      } else {
        alert('Erro ao remover template.')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Erro ao remover template.')
    }
  }

  const handleToggleEnabled = async (templateId: string, enabled: boolean) => {
    try {
      const result = await WrappedService.toggleTemplateEnabled(templateId, !enabled)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error toggling template:', error)
    }
  }

  const handleReorder = async (newOrder: { id: string; order: number }[]) => {
    try {
      const result = await WrappedService.updateTemplateOrder(retrospectiveId, newOrder)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error('Error reordering templates:', error)
    }
  }

  const moveTemplate = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= configuredTemplates.length) return

    const newOrder = configuredTemplates.map((template, i) => {
      if (i === index) {
        return { id: template.id, order: configuredTemplates[newIndex].order }
      }
      if (i === newIndex) {
        return { id: template.id, order: configuredTemplates[index].order }
      }
      return { id: template.id, order: template.order }
    })

    handleReorder(newOrder)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="text-gray-600 mt-4">Carregando configuração...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pb-24">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Configurar Wrapped</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Info Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Templates Wrapped
            </h2>
            <p className="text-gray-600 mb-4">
              Configure templates interativos para sua retrospectiva. Os templates configurados aparecerão em formato de stories.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>✓ {configuredTemplates.filter(t => t.enabled).length} templates ativos</span>
              <span>•</span>
              <span>~{configuredTemplates.filter(t => t.enabled).length * 30}s de duração</span>
            </div>
          </div>

          {/* Configured Templates */}
          {configuredTemplates.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Templates Configurados ({configuredTemplates.length})
              </h3>
              <div className="space-y-3">
                {configuredTemplates.map((record, index) => {
                  const template = availableTemplates.find(t => t.id === record.template_id)
                  if (!template) return null

                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border-2 border-purple-200"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                        <span className="text-2xl">{template.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            {record.enabled ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                Ativo
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                Desativado
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveTemplate(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveTemplate(index, 'down')}
                          disabled={index === configuredTemplates.length - 1}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleToggleEnabled(record.id, record.enabled)}
                          className={`p-2 rounded-lg ${
                            record.enabled
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={record.enabled ? 'Desativar' : 'Ativar'}
                        >
                          {record.enabled ? '✓' : '○'}
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(record.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Available Templates */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Templates Disponíveis
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTemplates.map((template) => {
                const isConfigured = configuredTemplates.some(
                  t => t.template_id === template.id
                )

                return (
                  <div
                    key={template.id}
                    className={`relative p-6 rounded-xl border-2 transition-all ${
                      isConfigured
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    {isConfigured && (
                      <div className="absolute -top-2 -right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {template.isPremium && (
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Premium
                      </div>
                    )}

                    <div className="text-center space-y-4">
                      <div className="text-5xl">{template.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">
                          {template.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{template.description}</p>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                        <span>~{template.estimatedTime} min</span>
                        <span>•</span>
                        <span className={`${
                          template.difficulty === 'easy' ? 'text-green-600' :
                          template.difficulty === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {template.difficulty === 'easy' ? 'Fácil' :
                           template.difficulty === 'medium' ? 'Médio' : 'Avançado'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => handleConfigureTemplate(template)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          isConfigured
                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                        }`}
                      >
                        {isConfigured ? 'Editar' : 'Configurar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Config Modal */}
      {showConfigModal && selectedTemplate && (
        <ConfigModalRenderer
          isOpen={showConfigModal}
          onClose={() => {
            setShowConfigModal(false)
            setSelectedTemplate(null)
          }}
          template={selectedTemplate}
          currentConfig={configuredTemplates.find(t => t.template_id === selectedTemplate.id)?.config}
          onSave={handleSaveTemplate}
          retrospectiveId={retrospectiveId}
        />
      )}
    </div>
  )
}

