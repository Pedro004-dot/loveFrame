'use client'

import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import { X, Download } from 'lucide-react'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title?: string
}

export default function QRCodeModal({ isOpen, onClose, url, title }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    if (!qrRef.current) return

    setIsDownloading(true)
    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      })

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Erro ao gerar imagem do QR Code')
          setIsDownloading(false)
          return
        }

        const link = document.createElement('a')
        link.download = `qrcode-${title || 'retrospectiva'}.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
        setIsDownloading(false)
      }, 'image/png')
    } catch (error) {
      console.error('Error downloading QR Code:', error)
      alert('Erro ao baixar QR Code. Tente novamente.')
      setIsDownloading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Escaneie o QR Code para acessar a retrospectiva
          </p>

          {/* QR Code Container */}
          <div 
            ref={qrRef}
            className="bg-white p-6 rounded-xl border-2 border-gray-200 flex items-center justify-center"
          >
            <QRCode
              value={url}
              size={256}
              level="H"
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </div>

          {/* URL Display */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Link:</p>
            <p className="text-sm text-gray-700 break-all font-mono">{url}</p>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Baixando...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Baixar QR Code</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

