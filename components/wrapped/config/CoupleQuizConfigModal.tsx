'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { CoupleQuizConfig, WrappedConfigModalProps } from '@/types/wrapped'

export default function CoupleQuizConfigModal({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: WrappedConfigModalProps) {
  const [config, setConfig] = useState<CoupleQuizConfig>(() => {
    if (currentConfig && currentConfig.type === 'couple-quiz') {
      return currentConfig as CoupleQuizConfig
    }
    return {
      id: `couple-quiz-${Date.now()}`,
      type: 'couple-quiz',
      templateId: 'couple-quiz',
      enabled: true,
      order: 0,
      duration: 30,
      questions: [
        {
          id: `q-${Date.now()}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ],
      showScore: true
    }
  })

  const addQuestion = () => {
    setConfig({
      ...config,
      questions: [
        ...config.questions,
        {
          id: `q-${Date.now()}-${Math.random()}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }
      ]
    })
  }

  const removeQuestion = (questionId: string) => {
    if (config.questions.length <= 1) {
      alert('Você precisa ter pelo menos uma pergunta')
      return
    }
    setConfig({
      ...config,
      questions: config.questions.filter(q => q.id !== questionId)
    })
  }

  const updateQuestion = (questionId: string, field: string, value: any) => {
    setConfig({
      ...config,
      questions: config.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    })
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setConfig({
      ...config,
      questions: config.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = [...q.options]
          newOptions[optionIndex] = value
          return { ...q, options: newOptions }
        }
        return q
      })
    })
  }

  const handleSave = () => {
    // Validate
    for (const question of config.questions) {
      if (!question.question.trim()) {
        alert('Por favor, preencha todas as perguntas')
        return
      }
      if (question.options.some(opt => !opt.trim())) {
        alert('Por favor, preencha todas as opções de resposta')
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
              Título do Quiz (opcional)
            </label>
            <input
              type="text"
              value={config.customTitle || ''}
              onChange={(e) => setConfig({ ...config, customTitle: e.target.value })}
              placeholder="Ex: Quanto você me conhece?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Perguntas ({config.questions.length})
              </label>
              <button
                onClick={addQuestion}
                className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Pergunta</span>
              </button>
            </div>

            <div className="space-y-4">
              {config.questions.map((question, qIndex) => (
                <div key={question.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">
                      Pergunta {qIndex + 1}
                    </span>
                    {config.questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="Digite a pergunta..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                            className="text-purple-500"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            placeholder={`Opção ${optIndex + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Explicação (opcional)
                      </label>
                      <input
                        type="text"
                        value={question.explanation || ''}
                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                        placeholder="Explicação da resposta correta..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Show Score */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showScore"
              checked={config.showScore}
              onChange={(e) => setConfig({ ...config, showScore: e.target.checked })}
              className="text-purple-500"
            />
            <label htmlFor="showScore" className="text-sm text-gray-700">
              Mostrar pontuação final
            </label>
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

