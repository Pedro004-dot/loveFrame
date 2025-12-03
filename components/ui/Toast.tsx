'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  duration?: number
  onClose?: () => void
  position?: 'top' | 'center' | 'bottom'
}

export default function Toast({ 
  message, 
  type, 
  duration = 2500, 
  onClose,
  position = 'top'
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10)

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300) // Wait for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible && !isExiting) return null

  const positionClasses = {
    top: 'top-4',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-4'
  }

  const bgColor = type === 'success' 
    ? 'bg-green-500' 
    : 'bg-red-500'

  const Icon = type === 'success' ? CheckCircle2 : XCircle

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 ${positionClasses[position]} transition-all duration-300 ${
        isExiting 
          ? 'opacity-0 scale-95 translate-y-[-10px]' 
          : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 min-w-[200px] max-w-[90vw] animate-in slide-in-from-top-2 fade-in duration-300`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        <span className="font-semibold text-sm md:text-base">{message}</span>
      </div>
    </div>
  )
}

