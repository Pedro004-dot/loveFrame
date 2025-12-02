'use client'

import { X, MessageCircle, Link2 } from 'lucide-react'
import { shareToWhatsApp, copyToClipboard } from '@/utils/shareUtils'

interface ShareMenuProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title?: string
  text?: string
}

export default function ShareMenu({ isOpen, onClose, url, title, text }: ShareMenuProps) {
  if (!isOpen) return null

  const handleWhatsApp = () => {
    shareToWhatsApp({ url, text })
    onClose()
  }

  const handleCopyLink = async () => {
    const copied = await copyToClipboard(url)
    if (copied) {
      alert('Link copiado para área de transferência!')
      onClose()
    } else {
      alert('Erro ao copiar link. Tente novamente.')
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl w-full p-6 animate-in slide-in-from-bottom duration-300 max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Compartilhar</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="space-y-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 px-4 rounded-xl font-medium flex items-center justify-center space-x-3 transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </button>
          
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-4 px-4 rounded-xl font-medium flex items-center justify-center space-x-3 transition-all hover:scale-105"
          >
            <Link2 className="w-5 h-5" />
            <span>Copiar Link</span>
          </button>
          
          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

