'use client'

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface FixedFooterProps {
  // Para páginas com botões de voltar/avançar
  showBack?: boolean
  showNext?: boolean
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  backLabel?: string
  isLoading?: boolean
  error?: string | null
  
  // Para páginas com botão único (continuar, finalizar)
  singleButton?: boolean
  singleButtonLabel?: string
  singleButtonOnClick?: () => void
  singleButtonDisabled?: boolean
  singleButtonLoading?: boolean
  
  // Texto adicional abaixo do botão
  helperText?: string | ReactNode
}

export default function FixedFooter({
  showBack = false,
  showNext = false,
  onBack,
  onNext,
  nextLabel = 'Próximo Passo',
  backLabel = 'Voltar',
  isLoading = false,
  error = null,
  singleButton = false,
  singleButtonLabel = 'Continuar',
  singleButtonOnClick,
  singleButtonDisabled = false,
  singleButtonLoading = false,
  helperText
}: FixedFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-3 text-sm">
            {error}
          </div>
        )}

        {/* Single Button Layout */}
        {singleButton ? (
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={singleButtonOnClick}
              disabled={singleButtonDisabled || singleButtonLoading}
              className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all disabled:transform-none disabled:cursor-not-allowed inline-flex items-center justify-center space-x-2"
            >
              {singleButtonLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{singleButtonLabel}</span>
              {!singleButtonLoading && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            {helperText && (
              <div className="text-sm text-gray-500 text-center">{helperText}</div>
            )}
          </div>
        ) : (
          /* Two Button Layout (Back/Next) */
          <div className="flex justify-between items-center gap-4 max-w-4xl mx-auto">
            <button
              onClick={onBack}
              disabled={!showBack || isLoading}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{backLabel}</span>
            </button>

            <button
              onClick={onNext}
              disabled={!showNext || isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{nextLabel}</span>
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </footer>
  )
}

