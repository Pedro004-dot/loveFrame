'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { WordGameConfig, WrappedConfigModalProps } from '@/types/wrapped'

export default function WordGameConfigModal({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: WrappedConfigModalProps) {
  const [config, setConfig] = useState<WordGameConfig>(() => {
    if (currentConfig && currentConfig.type === 'word-game') {
      return currentConfig as WordGameConfig
    }
    return {
      id: `word-game-${Date.now()}`,
      templateId: 'word-game',
      enabled: true,
      order: 0,
      duration: 30,
      words: [
        {
          word: '',
          description: '',
          order: 0
        }
      ],
      revealAnimation: 'fade'
    }
  })

  const addWord = () => {
    setConfig({
      ...config,
      words: [
        ...config.words,
        {
          word: '',
          description: '',
          order: config.words.length
        }
      ]
    })
  }

  const removeWord = (index: number) => {
    if (config.words.length <= 1) {
      alert('Você precisa ter pelo menos uma palavra')
      return
    }
    setConfig({
      ...config,
      words: config.words.filter((_, i) => i !== index).map((w, i) => ({ ...w, order: i }))
    })
  }

  const updateWord = (index: number, field: 'word' | 'description', value: string) => {
    setConfig({
      ...config,
      words: config.words.map((w, i) =>
        i === index ? { ...w, [field]: value } : w
      )
    })
  }

  const handleSave = () => {
    // Validate
    for (const word of config.words) {
      if (!word.word.trim()) {
        alert('Por favor, preencha todas as palavras')
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
              placeholder="Ex: O que eu mais gosto em você"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Words */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Palavras ({config.words.length})
              </label>
              <button
                onClick={addWord}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Palavra</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.words.map((word, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Palavra {index + 1}
                    </span>
                    {config.words.length > 1 && (
                      <button
                        onClick={() => removeWord(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={word.word}
                      onChange={(e) => updateWord(index, 'word', e.target.value)}
                      placeholder="Ex: Carinhoso"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-black placeholder:text-gray-500"
                    />
                    <input
                      type="text"
                      value={word.description}
                      onChange={(e) => updateWord(index, 'description', e.target.value)}
                      placeholder="Descrição (opcional)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animation Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estilo de Animação
            </label>
            <select
              value={config.revealAnimation}
              onChange={(e) => setConfig({ ...config, revealAnimation: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
            >
              <option value="fade">Fade (Desvanecer)</option>
              <option value="slide">Slide (Deslizar)</option>
              <option value="typewriter">Typewriter (Máquina de escrever)</option>
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

