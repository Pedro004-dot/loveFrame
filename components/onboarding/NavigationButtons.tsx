import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  isLoading?: boolean
  error?: string | null
}

export default function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext,
  isLoading = false,
  error = null
}: NavigationButtonsProps) {
  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={currentStep === 1 || isLoading}
          className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          onClick={onNext}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            {isLoading 
              ? 'Salvando...' 
              : currentStep === totalSteps 
                ? 'Finalizar' 
                : 'Próximo Passo'
            }
          </span>
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}