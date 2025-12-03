'use client'

import { useState, useEffect } from 'react'
import type { CoupleQuizConfig, StoryComponentProps } from '@/types/wrapped'
import Toast from '@/components/ui/Toast'

export default function CoupleQuizStory({ config, onComplete, onProgressPause }: StoryComponentProps<CoupleQuizConfig>) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [toastMessage, setToastMessage] = useState('')
  const [isAnswering, setIsAnswering] = useState(false)

  // Reset state when config changes (different story)
  useEffect(() => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowToast(false)
    setIsAnswering(false)
  }, [config.id])

  // Pause progress when user is interacting
  useEffect(() => {
    if (onProgressPause) {
      onProgressPause(true) // Pause progress during quiz
    }
    return () => {
      if (onProgressPause) {
        onProgressPause(false) // Resume when component unmounts
      }
    }
  }, [onProgressPause])

  const currentQuestion = config.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswering || selectedAnswer !== null) return

    setIsAnswering(true)
    setSelectedAnswer(answerIndex)

    // Check if correct
    const isCorrect = answerIndex === currentQuestion.correctAnswer
    
    // Show toast
    setToastType(isCorrect ? 'success' : 'error')
    setToastMessage(isCorrect ? 'Acertou! 🎉' : 'Errou! 😔')
    setShowToast(true)
  }

  const handleToastClose = () => {
    setShowToast(false)
    setIsAnswering(false)
    
    // Move to next question or complete
    setTimeout(() => {
      if (isLastQuestion) {
        // Complete the story
        onComplete?.()
      } else {
        // Reset for next question
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
      }
    }, 100)
  }

  const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-8 relative" style={{ color: '#000000' }}>
      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={2500}
          onClose={handleToastClose}
          position="center"
        />
      )}

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
            {config.customTitle || 'Quiz do Casal'}
          </h2>
          <div className="text-sm" style={{ color: '#374151' }}>
            Pergunta {currentQuestionIndex + 1} de {config.questions.length}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: '#000000' }}>
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isOptionCorrect = index === currentQuestion.correctAnswer
              const showFeedback = selectedAnswer !== null

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswering || selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    showFeedback
                      ? isSelected
                        ? isOptionCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : isOptionCorrect
                          ? 'bg-green-400/50 text-black border-2 border-green-500'
                          : 'bg-gray-200 text-gray-600'
                      : 'bg-white hover:bg-gray-100 text-black border border-gray-300'
                  } ${(isAnswering || selectedAnswer !== null) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={showFeedback && isSelected ? (isOptionCorrect ? 'text-white' : 'text-white') : 'text-black'}>{option}</span>
                    {showFeedback && isSelected && (
                      <span className="text-2xl text-white">
                        {isOptionCorrect ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  {showFeedback && isSelected && isOptionCorrect && currentQuestion.explanation && (
                    <p className="text-sm mt-2 text-white/90">{currentQuestion.explanation}</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

