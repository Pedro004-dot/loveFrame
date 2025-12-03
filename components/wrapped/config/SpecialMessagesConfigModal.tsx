'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { SpecialMessagesConfig, WrappedConfigModalProps } from '@/types/wrapped'

export default function SpecialMessagesConfigModal({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: WrappedConfigModalProps) {
  const [config, setConfig] = useState<SpecialMessagesConfig>(() => {
    if (currentConfig && currentConfig.type === 'special-messages') {
      return currentConfig as SpecialMessagesConfig
    }
    return {
      id: `special-messages-${Date.now()}`,
      templateId: 'special-messages',
      enabled: true,
      order: 0,
      duration: 30,
      messages: [
        {
          id: `m-${Date.now()}`,
          text: '',
          order: 0
        }
      ],
      revealStyle: 'fade'
    }
  })

  const addMessage = () => {
    setConfig({
      ...config,
      messages: [
        ...config.messages,
        {
          id: `m-${Date.now()}-${Math.random()}`,
          text: '',
          order: config.messages.length
        }
      ]
    })
  }

  const removeMessage = (messageId: string) => {
    if (config.messages.length <= 1) {
      alert('Você precisa ter pelo menos uma mensagem')
      return
    }
    setConfig({
      ...config,
      messages: config.messages.filter(m => m.id !== messageId).map((m, i) => ({ ...m, order: i }))
    })
  }

  const updateMessage = (messageId: string, field: 'text' | 'revealDelay', value: string | number) => {
    setConfig({
      ...config,
      messages: config.messages.map(m =>
        m.id === messageId ? { ...m, [field]: value } : m
      )
    })
  }

  const handleSave = () => {
    // Validate
    for (const message of config.messages) {
      if (!message.text.trim()) {
        alert('Por favor, preencha todas as mensagens')
        return
      }
    }

    onSave(config)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              placeholder="Ex: Mensagens do Coração"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Mensagens ({config.messages.length})
              </label>
              <button
                onClick={addMessage}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Mensagem</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.messages.map((message, index) => (
                <div key={message.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Mensagem {index + 1}
                    </span>
                    {config.messages.length > 1 && (
                      <button
                        onClick={() => removeMessage(message.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={message.text}
                      onChange={(e) => updateMessage(message.id, 'text', e.target.value)}
                      placeholder="Digite sua mensagem especial..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Delay de revelação (segundos, opcional)
                      </label>
                      <input
                        type="number"
                        value={message.revealDelay || ''}
                        onChange={(e) => updateMessage(message.id, 'revealDelay', parseInt(e.target.value) || 0)}
                        placeholder="Auto (sequencial)"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reveal Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilo de Revelação
            </label>
            <select
              value={config.revealStyle}
              onChange={(e) => setConfig({ ...config, revealStyle: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
            >
              <option value="fade">Fade (Desvanecer)</option>
              <option value="typewriter">Typewriter (Máquina de escrever)</option>
              <option value="slide">Slide (Deslizar)</option>
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

