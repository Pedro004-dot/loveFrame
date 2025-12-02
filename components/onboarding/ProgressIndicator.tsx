interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center lg:justify-start space-x-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step <= currentStep
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-purple-200 text-purple-400'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 text-center lg:text-left">
        Etapa {currentStep} de {totalSteps}
      </p>
    </div>
  )
}