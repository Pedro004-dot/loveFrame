'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { TimeStatsConfig, WrappedConfigModalProps } from '@/types/wrapped'

export default function TimeStatsConfigModal({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: WrappedConfigModalProps) {
  const [config, setConfig] = useState<TimeStatsConfig>(() => {
    if (currentConfig && currentConfig.type === 'time-stats') {
      return currentConfig as TimeStatsConfig
    }
    return {
      id: `time-stats-${Date.now()}`,
      templateId: 'time-stats',
      enabled: true,
      order: 0,
      duration: 30,
      stats: [
        {
          label: '',
          value: ''
        }
      ]
    }
  })

  const addStat = () => {
    setConfig({
      ...config,
      stats: [
        ...config.stats,
        {
          label: '',
          value: ''
        }
      ]
    })
  }

  const removeStat = (index: number) => {
    if (config.stats.length <= 1) {
      alert('Você precisa ter pelo menos uma estatística')
      return
    }
    setConfig({
      ...config,
      stats: config.stats.filter((_, i) => i !== index)
    })
  }

  const updateStat = (index: number, field: 'label' | 'value' | 'icon', value: string) => {
    setConfig({
      ...config,
      stats: config.stats.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    })
  }

  const handleSave = () => {
    // Validate
    for (const stat of config.stats) {
      if (!stat.label.trim() || !stat.value) {
        alert('Por favor, preencha todos os campos das estatísticas')
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
              placeholder="Ex: Nossos Números"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Estatísticas ({config.stats.length})
              </label>
              <button
                onClick={addStat}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>

            <div className="space-y-3">
              {config.stats.map((stat, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Estatística {index + 1}
                    </span>
                    {config.stats.length > 1 && (
                      <button
                        onClick={() => removeStat(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="Valor (ex: 365, 2 anos, 1000)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-black placeholder:text-gray-500"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Label (ex: Dias juntos, Anos de amor)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                    <input
                      type="text"
                      value={stat.icon || ''}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                      placeholder="Emoji (opcional, ex: 💕)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                    />
                  </div>
                </div>
              ))}
            </div>
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

