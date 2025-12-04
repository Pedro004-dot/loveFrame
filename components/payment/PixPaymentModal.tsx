'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Check, Loader2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import { usePaymentStatus } from '@/hooks/usePaymentStatus'
import type { PixPaymentResponse, PaymentStatus } from '@/lib/payment/types'

interface PixPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payment: PixPaymentResponse | null
  onPaymentComplete?: (paymentId: string) => void
}

export default function PixPaymentModal({
  isOpen,
  onClose,
  payment,
  onPaymentComplete
}: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false)
  const [shouldClose, setShouldClose] = useState(false)

  // Use payment status hook for polling
  const { status, paymentData, isLoading } = usePaymentStatus({
    paymentId: payment?.id || null,
    method: 'pix',
    interval: 5000,
    onComplete: (data) => {
      if (data.status === 'completed' && onPaymentComplete) {
        onPaymentComplete(data.id)
        // Close modal after a short delay
        setTimeout(() => {
          setShouldClose(true)
          onClose()
        }, 2000)
      }
    }
  })

  useEffect(() => {
    if (shouldClose) {
      onClose()
    }
  }, [shouldClose, onClose])

  if (!isOpen || !payment) return null

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(payment.copyPasteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      alert('Erro ao copiar código. Tente novamente.')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusColor = (status: PaymentStatus | null) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-yellow-600 bg-yellow-50'
    }
  }

  const getStatusText = (status: PaymentStatus | null) => {
    switch (status) {
      case 'completed':
        return 'Pagamento Confirmado!'
      case 'processing':
        return 'Processando...'
      case 'failed':
        return 'Pagamento Falhou'
      case 'cancelled':
        return 'Pagamento Cancelado'
      default:
        return 'Aguardando Pagamento'
    }
  }

  const currentStatus = status || payment.status

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Pagamento PIX</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Payment Info */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Valor</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
          </div>

          {payment.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Descrição</p>
              <p className="text-sm text-gray-900">{payment.description}</p>
            </div>
          )}

          {/* Status Badge */}
          <div className={`rounded-lg p-3 flex items-center justify-between ${getStatusColor(currentStatus)}`}>
            <span className="font-medium">{getStatusText(currentStatus)}</span>
            {isLoading && currentStatus === 'pending' && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </div>
        </div>

        {/* QR Code */}
        {currentStatus === 'pending' || currentStatus === 'processing' ? (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 flex items-center justify-center">
              {payment.qrCode ? (
                <img 
                  src={payment.qrCode} 
                  alt="QR Code PIX" 
                  className="w-full max-w-xs"
                />
              ) : (
                <QRCode
                  value={payment.copyPasteCode}
                  size={256}
                  level="H"
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              )}
            </div>

            {/* Copy Paste Code */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Código PIX (Copiar e Colar)</p>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                <p className="text-xs text-gray-700 break-all font-mono flex-1">
                  {payment.copyPasteCode}
                </p>
                <button
                  onClick={handleCopyCode}
                  className="flex-shrink-0 p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  title="Copiar código"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-center text-gray-500">
              Escaneie o QR Code ou copie o código PIX para pagar
            </p>
          </div>
        ) : currentStatus === 'completed' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">Pagamento Confirmado!</p>
            <p className="text-sm text-gray-600">
              Redirecionando...
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {getStatusText(currentStatus)}
            </p>
            <p className="text-sm text-gray-600">
              Entre em contato com o suporte se precisar de ajuda.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex gap-3">
          {currentStatus === 'pending' || currentStatus === 'processing' ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Fechar (Pagamento pendente)
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

