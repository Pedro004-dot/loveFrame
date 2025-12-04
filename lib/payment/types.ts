// Base payment types
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface PaymentMetadata {
  email?: string
  phone?: string
  retrospectiveId?: string
  customerName?: string
  [key: string]: any
}

// PIX Payment Types
export interface PixPaymentRequest {
  amount: number
  description: string
  customerId?: string
  metadata?: PaymentMetadata
  expirationMinutes?: number
}

export interface PixPaymentResponse {
  id: string
  qrCode: string
  copyPasteCode: string
  amount: number
  description: string
  status: PaymentStatus
  createdAt: string
  expiresAt: string
  metadata?: PaymentMetadata
}

// Card Payment Types
export interface CardPaymentRequest {
  amount: number
  description: string
  customerId?: string
  metadata?: PaymentMetadata
  card: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    holderName: string
  }
  installments?: number
}

export interface CardPaymentResponse {
  id: string
  amount: number
  description: string
  status: PaymentStatus
  createdAt: string
  installments?: number
  metadata?: PaymentMetadata
  authorizationCode?: string
}

// Generic Payment Status Response
export interface PaymentStatusResponse {
  id: string
  status: PaymentStatus
  paidAt?: string
  amount: number
  method: PaymentMethod
  metadata?: PaymentMetadata
}

// Simulation Types (for development)
export interface PaymentSimulationRequest {
  paymentId: string
  action: 'approve' | 'reject'
}

export interface PaymentSimulationResponse {
  success: boolean
  message?: string
}

// Webhook Types
export interface PaymentWebhook {
  event: 'payment.completed' | 'payment.failed' | 'payment.cancelled'
  paymentId: string
  status: PaymentStatus
  timestamp: string
  metadata?: PaymentMetadata
}