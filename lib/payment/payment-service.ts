import { PaymentFactory, PaymentFactoryConfig } from './payment-factory'
import {
  PaymentMethod,
  PixPaymentRequest,
  PixPaymentResponse,
  CardPaymentRequest,
  CardPaymentResponse,
  PaymentStatusResponse,
  PaymentSimulationRequest,
  PaymentSimulationResponse
} from './types'

export class PaymentService {
  private factory: PaymentFactory

  constructor(config: PaymentFactoryConfig) {
    this.factory = new PaymentFactory(config)
  }

  // PIX Payment Methods
  async createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    const provider = this.factory.getPixProvider()
    
    if (provider && 'createPixPayment' in provider && typeof provider.createPixPayment === 'function') {
      return provider.createPixPayment(request)
    }
    
    throw new Error('Provider does not support PIX payments')
  }

  // Card Payment Methods
  async processCardPayment(request: CardPaymentRequest): Promise<CardPaymentResponse> {
    const provider = this.factory.getCardProvider()
    
    if (provider && 'processCardPayment' in provider && typeof provider.processCardPayment === 'function') {
      return provider.processCardPayment(request)
    }
    
    throw new Error('Provider does not support card payments')
  }

  // Universal Payment Status Check
  async checkPaymentStatus(paymentId: string, method?: PaymentMethod): Promise<PaymentStatusResponse> {
    if (method) {
      const provider = this.factory.getProviderForMethod(method)
      return provider.checkPaymentStatus(paymentId)
    }

    // Try to determine provider from payment ID format or try all providers
    const availableProviders = this.factory.getAvailableProviders()
    
    for (const providerType of availableProviders) {
      try {
        const provider = this.factory.getProvider(providerType)
        const status = await provider.checkPaymentStatus(paymentId)
        return status
      } catch (error) {
        // Continue to next provider
        console.warn(`Failed to check status with ${providerType}:`, error)
      }
    }
    
    throw new Error('Payment not found in any provider')
  }

  // Card Validation
  validateCard(cardNumber: string, preferredProvider?: string): boolean {
    try {
      const provider = this.factory.getCardProvider()
      
      if ('validateCard' in provider && provider.validateCard) {
        return provider.validateCard(cardNumber)
      }
      
      // Fallback to basic validation
      return this.basicCardValidation(cardNumber)
    } catch {
      return this.basicCardValidation(cardNumber)
    }
  }

  // Get Installment Options
  getInstallmentOptions(amount: number): Array<{
    installments: number
    installmentAmount: number
    totalAmount: number
    interestRate?: number
  }> {
    try {
      const provider = this.factory.getCardProvider()
      
      if ('getInstallmentOptions' in provider && provider.getInstallmentOptions) {
        return provider.getInstallmentOptions(amount)
      }
      
      // Fallback to basic installment calculation
      return this.basicInstallmentOptions(amount)
    } catch {
      return this.basicInstallmentOptions(amount)
    }
  }

  // Simulation (for development/testing)
  async simulatePayment(request: PaymentSimulationRequest, method?: PaymentMethod): Promise<PaymentSimulationResponse> {
    if (method) {
      const provider = this.factory.getProviderForMethod(method)
      
      if ('simulatePayment' in provider && provider.simulatePayment) {
        return provider.simulatePayment(request)
      }
    }

    // Try all providers that support simulation
    const availableProviders = this.factory.getAvailableProviders()
    
    for (const providerType of availableProviders) {
      try {
        const provider = this.factory.getProvider(providerType)
        
        if ('simulatePayment' in provider && provider.simulatePayment) {
          return await provider.simulatePayment(request)
        }
      } catch (error) {
        console.warn(`Failed to simulate with ${providerType}:`, error)
      }
    }
    
    throw new Error('No provider supports payment simulation')
  }

  // Provider Health Check
  async checkProvidersHealth() {
    return this.factory.checkProvidersHealth()
  }

  // Get Available Payment Methods
  getSupportedMethods(): PaymentMethod[] {
    return this.factory.getSupportedMethods()
  }

  // Failover - Get Working Provider
  async getWorkingProvider(method: PaymentMethod) {
    return this.factory.getWorkingProvider(method)
  }

  // Provider Information
  getProviderInfo(method: PaymentMethod) {
    try {
      const provider = this.factory.getProviderForMethod(method)
      return {
        name: provider.name,
        supportedMethods: provider.supportedMethods
      }
    } catch (error) {
      return null
    }
  }

  // Private helper methods
  private basicCardValidation(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s|-/g, '')
    
    if (!/^\d+$/.test(cleaned)) return false
    if (cleaned.length < 13 || cleaned.length > 19) return false
    
    // Luhn algorithm
    let sum = 0
    let isEven = false
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }

  private basicInstallmentOptions(amount: number) {
    const options = []
    
    for (let i = 1; i <= 12; i++) {
      const interestRate = i <= 6 ? 0 : 0.025 * (i - 6) // 2.5% interest after 6 installments
      const totalAmount = amount * (1 + interestRate)
      
      options.push({
        installments: i,
        installmentAmount: totalAmount / i,
        totalAmount,
        interestRate: interestRate * 100
      })
    }
    
    return options
  }
}