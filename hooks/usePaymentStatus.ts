import { useState, useEffect, useRef, useCallback } from 'react'
import type { PaymentStatus } from '@/lib/payment/types'

interface PaymentStatusResponse {
  id: string
  status: PaymentStatus
  paidAt?: string
  amount: number
  method: 'pix' | 'credit_card' | 'debit_card'
  metadata?: Record<string, any>
}

interface UsePaymentStatusOptions {
  paymentId: string | null
  method?: 'pix' | 'credit_card' | 'debit_card'
  interval?: number // Polling interval in milliseconds (default: 5000)
  maxDuration?: number // Maximum polling duration in milliseconds (default: 5 minutes)
  onStatusChange?: (status: PaymentStatus) => void
  onComplete?: (data: PaymentStatusResponse) => void
  onError?: (error: Error) => void
}

interface UsePaymentStatusReturn {
  status: PaymentStatus | null
  paymentData: PaymentStatusResponse | null
  isLoading: boolean
  error: Error | null
  stopPolling: () => void
  startPolling: () => void
}

export function usePaymentStatus({
  paymentId,
  method = 'pix',
  interval = 5000,
  maxDuration = 5 * 60 * 1000, // 5 minutes
  onStatusChange,
  onComplete,
  onError
}: UsePaymentStatusOptions): UsePaymentStatusReturn {
  const [status, setStatus] = useState<PaymentStatus | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isPollingRef = useRef(false)

  const checkPaymentStatus = useCallback(async () => {
    if (!paymentId) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const queryParams = new URLSearchParams({
        id: paymentId
      })
      
      if (method) {
        queryParams.append('method', method)
      }

      const response = await fetch(`/api/payment/pix/status?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Failed to check payment status: ${response.statusText}`)
      }

      const data: PaymentStatusResponse = await response.json()
      
      setPaymentData(data)
      setStatus(data.status)

      // Call onStatusChange callback if provided
      if (onStatusChange && data.status !== status) {
        onStatusChange(data.status)
      }

      // If payment is completed or failed, stop polling and call onComplete
      if (data.status === 'completed' || data.status === 'failed' || data.status === 'cancelled') {
        stopPolling()
        if (onComplete) {
          onComplete(data)
        }
        return
      }

      // Check if max duration has been exceeded
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current
        if (elapsed >= maxDuration) {
          stopPolling()
          setError(new Error('Polling timeout: Maximum duration exceeded'))
          if (onError) {
            onError(new Error('Polling timeout: Maximum duration exceeded'))
          }
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [paymentId, method, status, onStatusChange, onComplete, onError, maxDuration])

  const startPolling = useCallback(() => {
    if (!paymentId || isPollingRef.current) {
      return
    }

    isPollingRef.current = true
    startTimeRef.current = Date.now()

    // Initial check
    checkPaymentStatus()

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (isPollingRef.current) {
        checkPaymentStatus()
      }
    }, interval)
  }, [paymentId, interval, checkPaymentStatus])

  const stopPolling = useCallback(() => {
    isPollingRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startTimeRef.current = null
  }, [])

  // Start polling when paymentId changes
  useEffect(() => {
    if (paymentId) {
      startPolling()
    } else {
      stopPolling()
    }

    // Cleanup on unmount
    return () => {
      stopPolling()
    }
  }, [paymentId, startPolling, stopPolling])

  return {
    status,
    paymentData,
    isLoading,
    error,
    stopPolling,
    startPolling
  }
}

