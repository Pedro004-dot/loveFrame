import { PaymentFactoryConfig } from './payment-factory'

export const paymentConfig: PaymentFactoryConfig = {
  defaultPixProvider: 'abacatepay',
  defaultCardProvider: 'stripe', // ou 'mercadopago'
  
  providers: {
    abacatepay: {
      apiKey: process.env.abacatepayKey || '',
      baseUrl: 'https://api.abacatepay.com/v1',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      timeout: 30000
    },
    
    stripe: {
      apiKey: process.env.STRIPE_SECRET_KEY || '',
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      baseUrl: 'https://api.stripe.com/v1',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      timeout: 30000
    },
    
    mercadopago: {
      apiKey: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
      publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '',
      baseUrl: 'https://api.mercadopago.com',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      timeout: 30000
    }
  }
}

// Validate configuration
export function validatePaymentConfig(): string[] {
  const errors: string[] = []
  
  // Check if at least one PIX provider is configured
  const pixProviders = ['abacatepay', 'mercadopago'] as const
  const hasPixProvider = pixProviders.some(provider => {
    const config = paymentConfig.providers[provider]
    return config && config.apiKey
  })
  
  if (!hasPixProvider) {
    errors.push('No PIX provider configured. Please configure AbacatePay or MercadoPago.')
  }
  
  // Check if at least one card provider is configured
  const cardProviders = ['stripe', 'mercadopago'] as const
  const hasCardProvider = cardProviders.some(provider => {
    const config = paymentConfig.providers[provider]
    return config && config.apiKey
  })
  
  if (!hasCardProvider) {
    errors.push('No card provider configured. Please configure Stripe or MercadoPago.')
  }
  
  // Validate specific provider configurations
  if (paymentConfig.providers.abacatepay?.apiKey && !paymentConfig.providers.abacatepay.apiKey.startsWith('abc_')) {
    errors.push('Invalid AbacatePay API key format. Should start with "abc_".')
  }
  
  if (paymentConfig.providers.stripe?.apiKey && !paymentConfig.providers.stripe.apiKey.startsWith('sk_')) {
    errors.push('Invalid Stripe secret key format. Should start with "sk_".')
  }
  
  if (paymentConfig.providers.mercadopago?.apiKey && paymentConfig.providers.mercadopago.apiKey.length < 10) {
    errors.push('Invalid MercadoPago access token format.')
  }
  
  return errors
}

// Get active providers
export function getActiveProviders() {
  const active = []
  
  for (const [provider, config] of Object.entries(paymentConfig.providers)) {
    if (config && config.apiKey) {
      active.push(provider)
    }
  }
  
  return active
}