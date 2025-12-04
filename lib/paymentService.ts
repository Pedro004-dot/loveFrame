import { PaymentService } from './payment'
import { paymentConfig } from './payment/config'

// Initialize payment service with configuration
export const paymentService = new PaymentService(paymentConfig)

// Convenience methods for easy usage
export async function createPixPayment(data: {
  amount: number
  description: string
  customerId?: string
  metadata?: {
    email?: string
    phone?: string
    retrospectiveId?: string
  }
}) {
  return paymentService.createPixPayment(data)
}

export async function processCardPayment(data: {
  amount: number
  description: string
  customerId?: string
  metadata?: {
    email?: string
    phone?: string
    retrospectiveId?: string
  }
  card: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    holderName: string
  }
  installments?: number
}) {
  return paymentService.processCardPayment(data)
}

export async function checkPaymentStatus(paymentId: string, method?: 'pix' | 'credit_card' | 'debit_card') {
  return paymentService.checkPaymentStatus(paymentId, method)
}

export function validateCard(cardNumber: string): boolean {
  return paymentService.validateCard(cardNumber)
}

export function getInstallmentOptions(amount: number) {
  return paymentService.getInstallmentOptions(amount)
}

export async function simulatePayment(paymentId: string, action: 'approve' | 'reject' = 'approve', method?: 'pix' | 'credit_card') {
  return paymentService.simulatePayment({ paymentId, action }, method)
}

export async function checkProvidersHealth() {
  return paymentService.checkProvidersHealth()
}

export function getSupportedMethods() {
  return paymentService.getSupportedMethods()
}

// Re-export types for convenience
export type {
  PaymentMethod,
  PaymentStatus,
  PixPaymentRequest,
  PixPaymentResponse,
  CardPaymentRequest,
  CardPaymentResponse,
  PaymentStatusResponse
} from './payment'