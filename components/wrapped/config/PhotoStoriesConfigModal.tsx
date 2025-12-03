'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import type { PhotoStoriesConfig, WrappedConfigModalProps } from '@/types/wrapped'
import { compressImage } from '@/utils/fileUpload'

export default function PhotoStoriesConfigModal({
  isOpen,
  onClose,
  template,
  currentConfig,
  onSave,
  retrospectiveId
}: WrappedConfigModalProps) {
  const [config, setConfig] = useState<PhotoStoriesConfig>(() => {
    if (currentConfig && currentConfig.type === 'photo-stories') {
      return currentConfig as PhotoStoriesConfig
    }
    return {
      id: `photo-stories-${Date.now()}`,
      type: 'photo-stories',
      templateId: 'photo-stories',
      enabled: true,
      order: 0,
      duration: 30,
      photos: [],
      transitionStyle: 'fade',
      showCaptions: true
    }
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    try {
      // Compress and convert to base64
      const compressedImages = await Promise.all(
        files.map(file => compressImage(file, 1200, 1200, 0.8))
      )

      const newPhotos = compressedImages.map((imageUrl, index) => ({
        id: `photo-${Date.now()}-${index}`,
        imageUrl,
        caption: '',
        order: config.photos.length + index
      }))

      setConfig({
        ...config,
        photos: [...config.photos, ...newPhotos]
      })
    } catch (error) {
      console.error('Error uploading photos:', error)
      alert('Erro ao fazer upload das fotos. Tente novamente.')
    }
  }

  const removePhoto = (photoId: string) => {
    setConfig({
      ...config,
      photos: config.photos.filter(p => p.id !== photoId).map((p, i) => ({ ...p, order: i }))
    })
  }

  const updatePhoto = (photoId: string, field: 'caption', value: string) => {
    setConfig({
      ...config,
      photos: config.photos.map(p =>
        p.id === photoId ? { ...p, [field]: value } : p
      )
    })
  }

  const handleSave = () => {
    if (config.photos.length === 0) {
      alert('Por favor, adicione pelo menos uma foto')
      return
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
              placeholder="Ex: Nossos Momentos"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black placeholder:text-gray-500"
            />
          </div>

          {/* Upload Photos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos ({config.photos.length})
            </label>
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-600 font-medium">Clique para adicionar fotos</span>
              <span className="text-gray-500 text-sm block mt-1">ou arraste e solte aqui</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Photos List */}
          {config.photos.length > 0 && (
            <div className="space-y-4">
              {config.photos.map((photo, index) => (
                <div key={photo.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={photo.imageUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Foto {index + 1}
                        </span>
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => updatePhoto(photo.id, 'caption', e.target.value)}
                        placeholder="Legenda da foto (opcional)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-black placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estilo de Transição
              </label>
              <select
                value={config.transitionStyle}
                onChange={(e) => setConfig({ ...config, transitionStyle: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
              >
                <option value="fade">Fade (Desvanecer)</option>
                <option value="slide">Slide (Deslizar)</option>
                <option value="zoom">Zoom</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showCaptions"
                checked={config.showCaptions}
                onChange={(e) => setConfig({ ...config, showCaptions: e.target.checked })}
                className="text-purple-500"
              />
              <label htmlFor="showCaptions" className="text-sm text-gray-700">
                Mostrar legendas nas fotos
              </label>
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

