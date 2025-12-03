'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Calendar } from 'lucide-react'
import type { TimelineConfig, WrappedConfigModalProps } from '@/types/wrapped'

export default function TimelineConfigModal({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: WrappedConfigModalProps) {
  const [config, setConfig] = useState<TimelineConfig>(() => {
    if (currentConfig && currentConfig.type === 'timeline') {
      return currentConfig as TimelineConfig
    }
    return {
      id: `timeline-${Date.now()}`,
      templateId: 'timeline',
      enabled: true,
      order: 0,
      duration: 30,
      events: [
        {
          id: `e-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          order: 0
        }
      ],
      scrollDirection: 'vertical'
    }
  })

  const addEvent = () => {
    setConfig({
      ...config,
      events: [
        ...config.events,
        {
          id: `e-${Date.now()}-${Math.random()}`,
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          order: config.events.length
        }
      ]
    })
  }

  const removeEvent = (eventId: string) => {
    if (config.events.length <= 1) {
      alert('Você precisa ter pelo menos um evento')
      return
    }
    setConfig({
      ...config,
      events: config.events.filter(e => e.id !== eventId).map((e, i) => ({ ...e, order: i }))
    })
  }

  const updateEvent = (eventId: string, field: string, value: any) => {
    setConfig({
      ...config,
      events: config.events.map(e =>
        e.id === eventId ? { ...e, [field]: value } : e
      )
    })
  }

  const handleSave = () => {
    // Validate
    for (const event of config.events) {
      if (!event.title.trim()) {
        alert('Por favor, preencha todos os títulos dos eventos')
        return
      }
      if (!event.date) {
        alert('Por favor, selecione uma data para todos os eventos')
        return
      }
    }

    onSave(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {template.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título (opcional)
            </label>
            <input
              type="text"
              value={config.customTitle || ''}
              onChange={(e) => setConfig({ ...config, customTitle: e.target.value })}
              placeholder="Ex: Nossa História"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Eventos ({config.events.length})
              </label>
              <button
                onClick={addEvent}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Evento</span>
              </button>
            </div>

            <div className="space-y-4">
              {config.events.map((event, index) => (
                <div key={event.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Evento {index + 1}</span>
                    </span>
                    {config.events.length > 1 && (
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Data</label>
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                      />
                    </div>

                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                      placeholder="Título do evento..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-black placeholder:text-gray-500"
                    />

                    <textarea
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                      placeholder="Descrição do evento..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                    />

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">URL da Imagem (opcional)</label>
                      <input
                        type="url"
                        value={event.imageUrl || ''}
                        onChange={(e) => updateEvent(event.id, 'imageUrl', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Direção de Scroll
            </label>
            <select
              value={config.scrollDirection}
              onChange={(e) => setConfig({ ...config, scrollDirection: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
            >
              <option value="vertical">Vertical (Recomendado)</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

