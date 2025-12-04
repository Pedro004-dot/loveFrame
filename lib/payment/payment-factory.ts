import {
  PaymentProvider,
  PixProvider,
  CardProvider,
  MultiMethodProvider,
  ProviderConfig
} from './interfaces'
import { PaymentMethod } from './types'

// Import adapters
import { AbacatePayAdapter } from './providers/abacatepay-adapter'
import { StripeAdapter } from './providers/stripe-adapter'
import { MercadoPagoAdapter } from './providers/mercadopago-adapter'

export type ProviderType = 'abacatepay' | 'stripe' | 'mercadopago'

export interface PaymentFactoryConfig {
  defaultPixProvider?: ProviderType
  defaultCardProvider?: ProviderType
  providers: {
    [K in ProviderType]?: ProviderConfig
  }
}

export class PaymentFactory {
  private static instance: PaymentFactory
  private config: PaymentFactoryConfig
  private providerInstances = new Map<ProviderType, PaymentProvider>()

  constructor(config: PaymentFactoryConfig) {
    this.config = config
  }

  static getInstance(config?: PaymentFactoryConfig): PaymentFactory {
    if (!PaymentFactory.instance && config) {
      PaymentFactory.instance = new PaymentFactory(config)
    } else if (!PaymentFactory.instance) {
      throw new Error('PaymentFactory must be initialized with config first')
    }
    return PaymentFactory.instance
  }

  static initialize(config: PaymentFactoryConfig): void {
    PaymentFactory.instance = new PaymentFactory(config)
  }

  // Get provider by type
  getProvider(type: ProviderType): PaymentProvider {
    if (!this.providerInstances.has(type)) {
      const provider = this.createProvider(type)
      this.providerInstances.set(type, provider)
    }
    
    return this.providerInstances.get(type)!
  }

  // Get PIX provider
  getPixProvider(preferredType?: ProviderType): PixProvider | MultiMethodProvider {
    const type = preferredType || this.config.defaultPixProvider || 'abacatepay'
    const provider = this.getProvider(type)
    
    if (!provider.supportedMethods.includes('pix')) {
      throw new Error(`Provider ${type} does not support PIX payments`)
    }
    
    return provider as PixProvider | MultiMethodProvider
  }

  // Get Card provider
  getCardProvider(preferredType?: ProviderType): CardProvider | MultiMethodProvider {
    const type = preferredType || this.config.defaultCardProvider || 'stripe'
    const provider = this.getProvider(type)
    
    const supportsCard = provider.supportedMethods.some(method => 
      ['credit_card', 'debit_card'].includes(method)
    )
    
    if (!supportsCard) {
      throw new Error(`Provider ${type} does not support card payments`)
    }
    
    return provider as CardProvider | MultiMethodProvider
  }

  // Get best provider for specific method
  getProviderForMethod(method: PaymentMethod): PaymentProvider {
    switch (method) {
      case 'pix':
        return this.getPixProvider()
      case 'credit_card':
      case 'debit_card':
        return this.getCardProvider()
      default:
        throw new Error(`Unsupported payment method: ${method}`)
    }
  }

  // Get all available providers
  getAvailableProviders(): ProviderType[] {
    return Object.keys(this.config.providers) as ProviderType[]
  }

  // Get supported methods across all providers
  getSupportedMethods(): PaymentMethod[] {
    const methods = new Set<PaymentMethod>()
    
    for (const type of this.getAvailableProviders()) {
      try {
        const provider = this.getProvider(type)
        provider.supportedMethods.forEach(method => methods.add(method))
      } catch (error) {
        console.warn(`Failed to load provider ${type}:`, error)
      }
    }
    
    return Array.from(methods)
  }

  // Health check for all providers
  async checkProvidersHealth(): Promise<Record<ProviderType, boolean>> {
    const health: Record<string, boolean> = {}
    
    for (const type of this.getAvailableProviders()) {
      try {
        const provider = this.getProvider(type)
        health[type] = await provider.isAvailable()
      } catch (error) {
        console.warn(`Health check failed for ${type}:`, error)
        health[type] = false
      }
    }
    
    return health as Record<ProviderType, boolean>
  }

  // Switch to fallback provider
  async getWorkingProvider(method: PaymentMethod): Promise<PaymentProvider | null> {
    const candidates = this.getAvailableProviders().filter(type => {
      try {
        const provider = this.getProvider(type)
        return provider.supportedMethods.includes(method)
      } catch {
        return false
      }
    })

    for (const type of candidates) {
      try {
        const provider = this.getProvider(type)
        const isAvailable = await provider.isAvailable()
        if (isAvailable) {
          return provider
        }
      } catch (error) {
        console.warn(`Provider ${type} is not available:`, error)
      }
    }

    return null
  }

  private createProvider(type: ProviderType): PaymentProvider {
    const config = this.config.providers[type]
    if (!config) {
      throw new Error(`Configuration for provider ${type} not found`)
    }

    switch (type) {
      case 'abacatepay':
        return new AbacatePayAdapter({
          apiKey: config.apiKey,
          baseUrl: config.baseUrl,
          environment: config.environment,
          timeout: config.timeout
        })
        
      case 'stripe':
        return new StripeAdapter({
          apiKey: config.apiKey,
          publishableKey: config.publishableKey,
          baseUrl: config.baseUrl,
          environment: config.environment,
          timeout: config.timeout
        })
        
      case 'mercadopago':
        return new MercadoPagoAdapter({
          accessToken: config.apiKey,
          publicKey: config.publicKey,
          baseUrl: config.baseUrl,
          environment: config.environment,
          timeout: config.timeout
        })
        
      default:
        throw new Error(`Unknown provider type: ${type}`)
    }
  }

  // Update provider configuration
  updateProviderConfig(type: ProviderType, config: ProviderConfig): void {
    this.config.providers[type] = config
    // Remove cached instance to force recreation
    this.providerInstances.delete(type)
  }

  // Clear all cached instances
  clearCache(): void {
    this.providerInstances.clear()
  }
}