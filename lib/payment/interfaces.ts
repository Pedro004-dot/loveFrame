import {
  PixPaymentRequest,
  PixPaymentResponse,
  CardPaymentRequest,
  CardPaymentResponse,
  PaymentStatusResponse,
  PaymentSimulationRequest,
  PaymentSimulationResponse,
  PaymentMethod
} from './types'

// Base Payment Provider Interface
export interface PaymentProvider {
  readonly name: string
  readonly supportedMethods: PaymentMethod[]
  
  // Health check
  isAvailable(): Promise<boolean>
  
  // Payment status check (universal method)
  checkPaymentStatus(paymentId: string): Promise<PaymentStatusResponse>
  
  // Simulation (for development/testing)
  simulatePayment?(request: PaymentSimulationRequest): Promise<PaymentSimulationResponse>
}

// PIX Provider Interface
export interface PixProvider extends PaymentProvider {
  supportedMethods: ['pix']
  
  createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResponse>
}

// Card Provider Interface  
export interface CardProvider extends PaymentProvider {
  supportedMethods: ['credit_card'] | ['debit_card'] | ['credit_card', 'debit_card']
  
  processCardPayment(request: CardPaymentRequest): Promise<CardPaymentResponse>
  
  // Card-specific methods
  validateCard?(cardNumber: string): boolean
  getInstallmentOptions?(amount: number): Array<{
    installments: number
    installmentAmount: number
    totalAmount: number
    interestRate?: number
  }>
}

// Multi-Provider Interface (providers that support multiple methods)
export interface MultiMethodProvider extends PaymentProvider {
  supportedMethods: PaymentMethod[]
  
  // PIX methods (if supported)
  createPixPayment?(request: PixPaymentRequest): Promise<PixPaymentResponse>
  
  // Card methods (if supported)  
  processCardPayment?(request: CardPaymentRequest): Promise<CardPaymentResponse>
  validateCard?(cardNumber: string): boolean
  getInstallmentOptions?(amount: number): Array<{
    installments: number
    installmentAmount: number
    totalAmount: number
    interestRate?: number
  }>
}

// Provider Configuration
export interface ProviderConfig {
  apiKey: string
  baseUrl?: string
  environment?: 'development' | 'production'
  webhookUrl?: string
  timeout?: number
  [key: string]: any
}