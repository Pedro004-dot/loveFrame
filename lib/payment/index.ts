// Main exports
export { PaymentService } from './payment-service'
export { PaymentFactory, type PaymentFactoryConfig } from './payment-factory'

// Types
export type {
  PaymentMethod,
  PaymentStatus,
  PaymentMetadata,
  PixPaymentRequest,
  PixPaymentResponse,
  CardPaymentRequest,
  CardPaymentResponse,
  PaymentStatusResponse,
  PaymentSimulationRequest,
  PaymentSimulationResponse,
  PaymentWebhook
} from './types'

// Interfaces
export type {
  PaymentProvider,
  PixProvider,
  CardProvider,
  MultiMethodProvider,
  ProviderConfig
} from './interfaces'

// Provider adapters
export { AbacatePayAdapter } from './providers/abacatepay-adapter'
export { StripeAdapter } from './providers/stripe-adapter'
export { MercadoPagoAdapter } from './providers/mercadopago-adapter'

// Provider type
export type { ProviderType } from './payment-factory'