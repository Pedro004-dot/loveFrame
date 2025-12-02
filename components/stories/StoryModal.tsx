'use client'

import { useState, useEffect } from 'react'
import { X, Play, Save, RotateCcw } from 'lucide-react'
import type { StoryModalProps, StoryConfig, StoryField } from '@/types/stories'

export default function StoryModal({ 
  isOpen, 
  onClose, 
  template, 
  currentConfig, 
  onSave 
}: StoryModalProps) {
  const [config, setConfig] = useState<Record<string, any>>(template.defaultConfig)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (currentConfig) {
      setConfig(currentConfig as Record<string, any>)
    } else {
      setConfig({
        ...template.defaultConfig,
        id: template.id,
        enabled: true,
        order: 0,
        duration: 30,
        type: template.id
      })
    }
  }, [currentConfig, template])

  const handleFieldChange = (field: StoryField, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field.key]: value
    }))

    // Clear error when user starts typing
    if (errors[field.key]) {
      setErrors(prev => ({
        ...prev,
        [field.key]: ''
      }))
    }
  }

  const validateField = (field: StoryField, value: any): string => {
    if (field.required && (!value || value === '')) {
      return `${field.label} é obrigatório`
    }

    if (field.validation) {
      const { min, max, pattern, fileTypes } = field.validation

      if (field.type === 'text' || field.type === 'textarea') {
        if (min && value.length < min) {
          return `${field.label} deve ter pelo menos ${min} caracteres`
        }
        if (max && value.length > max) {
          return `${field.label} deve ter no máximo ${max} caracteres`
        }
        if (pattern && !new RegExp(pattern).test(value)) {
          return `${field.label} tem formato inválido`
        }
      }

      if (field.type === 'number') {
        if (min && value < min) {
          return `${field.label} deve ser pelo menos ${min}`
        }
        if (max && value > max) {
          return `${field.label} deve ser no máximo ${max}`
        }
      }

      if (field.type === 'file' && value && fileTypes) {
        const fileName = value.name?.toLowerCase() || ''
        const isValidType = fileTypes.some(type => fileName.endsWith(type))
        if (!isValidType) {
          return `${field.label} deve ser ${fileTypes.join(', ')}`
        }
      }
    }

    return ''
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    // Validate all fields
    template.configFields.forEach(field => {
      const error = validateField(field, config[field.key])
      if (error) {
        newErrors[field.key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(config as StoryConfig)
    onClose()
  }

  const handleReset = () => {
    setConfig({
      ...template.defaultConfig,
      id: template.id,
      enabled: true,
      order: 0,
      duration: 30,
      type: template.id
    })
    setErrors({})
  }

  const renderField = (field: StoryField) => {
    const value = config[field.key] || ''
    const error = errors[field.key]

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field, Number(e.target.value))}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div className="flex space-x-2">
            <input
              type="color"
              value={value || '#8B5CF6'}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-16 h-12 border rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={value || '#8B5CF6'}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder="#8B5CF6"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        )

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleFieldChange(field, e.target.files?.[0])}
            accept={field.validation?.fileTypes?.join(',')}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          
          {/* Configuration Panel */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span className="text-3xl">{template.icon}</span>
                  <span>{template.name}</span>
                </h2>
                <p className="text-gray-600">{template.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {template.configFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.key] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field.key]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                <Play className="w-4 h-4" />
                <span>{isPreviewMode ? 'Editar' : 'Preview'}</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-gray-900 relative">
            {isPreviewMode ? (
              <div className="h-full flex items-center justify-center">
                {/* Story preview will be rendered here */}
                <div className="text-white text-center">
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-300">Preview em desenvolvimento</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">{template.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-300 mb-4">{template.description}</p>
                  <button
                    onClick={() => setIsPreviewMode(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                  >
                    <Play className="w-4 h-4" />
                    <span>Ver Preview</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}