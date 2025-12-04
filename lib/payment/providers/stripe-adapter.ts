import {
  CardProvider,
  ProviderConfig
} from '../interfaces'
import {
  CardPaymentRequest,
  CardPaymentResponse,
  PaymentStatusResponse,
  PaymentStatus
} from '../types'

interface StripeConfig extends ProviderConfig {
  apiKey: string
  publishableKey?: string
  baseUrl?: string
}

export class StripeAdapter implements CardProvider {
  readonly name = 'Stripe'
  readonly supportedMethods: ['credit_card', 'debit_card'] = ['credit_card', 'debit_card']
  
  private config: StripeConfig
  private baseUrl: string

  constructor(config: StripeConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://api.stripe.com/v1'
    
    if (!config.apiKey) {
      throw new Error('Stripe API key is required')
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/charges`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Stripe-Version': '2023-10-16'
        }
      })
      return response.status !== 401 // Not unauthorized
    } catch {
      return false
    }
  }

  async processCardPayment(request: CardPaymentRequest): Promise<CardPaymentResponse> {
    // First create a payment method
    const paymentMethod = await this.createPaymentMethod(request.card) as any
    
    // Then create a payment intent
    const paymentIntent = await this.createPaymentIntent({
      amount: Math.round(request.amount * 100), // Convert to cents
      currency: 'brl',
      description: request.description,
      payment_method: paymentMethod.id,
      confirm: true,
      metadata: request.metadata || {}
    })

    return this.mapCardResponse(paymentIntent)
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await this.makeRequest<any>(`/payment_intents/${paymentId}`)
    
    return {
      id: response.id,
      status: this.mapStatus(response.status),
      paidAt: response.charges?.data?.[0]?.created ? new Date(response.charges.data[0].created * 1000).toISOString() : undefined,
      amount: response.amount / 100, // Convert from cents
      method: 'credit_card',
      metadata: response.metadata
    }
  }

  validateCard(cardNumber: string): boolean {
    // Remove spaces and hyphens
    const cleaned = cardNumber.replace(/\s|-/g, '')
    
    // Check if it's a valid number
    if (!/^\d+$/.test(cleaned)) return false
    
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

  getInstallmentOptions(amount: number): Array<{
    installments: number
    installmentAmount: number
    totalAmount: number
    interestRate?: number
  }> {
    const options = []
    
    // No interest for up to 6 installments
    for (let i = 1; i <= 6; i++) {
      options.push({
        installments: i,
        installmentAmount: amount / i,
        totalAmount: amount,
        interestRate: 0
      })
    }
    
    // With interest for 7-12 installments
    for (let i = 7; i <= 12; i++) {
      const interestRate = 0.0299 // 2.99% per month
      const totalAmount = amount * Math.pow(1 + interestRate, i)
      options.push({
        installments: i,
        installmentAmount: totalAmount / i,
        totalAmount,
        interestRate: interestRate * 100 // Convert to percentage
      })
    }
    
    return options
  }

  private async createPaymentMethod(card: CardPaymentRequest['card']) {
    const payload = {
      type: 'card',
      card: {
        number: card.number.replace(/\s/g, ''),
        exp_month: card.expiryMonth,
        exp_year: card.expiryYear,
        cvc: card.cvv
      },
      billing_details: {
        name: card.holderName
      }
    }

    return this.makeRequest('/payment_methods', 'POST', payload)
  }

  private async createPaymentIntent(data: any) {
    return this.makeRequest('/payment_intents', 'POST', data)
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const timeout = this.config.timeout || 30000
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Stripe-Version': '2023-10-16'
        },
        signal: controller.signal
      }

      if (body && method === 'POST') {
        // Stripe expects form data
        const formData = new URLSearchParams()
        this.appendToFormData(formData, body)
        options.body = formData
      }

      const response = await fetch(url, options)
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Stripe API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`)
      }
      
      throw error
    }
  }

  private appendToFormData(formData: URLSearchParams, obj: any, prefix = '') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        const formKey = prefix ? `${prefix}[${key}]` : key
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          this.appendToFormData(formData, value, formKey)
        } else {
          formData.append(formKey, String(value))
        }
      }
    }
  }

  private mapCardResponse(response: any): CardPaymentResponse {
    return {
      id: response.id,
      amount: response.amount / 100, // Convert from cents
      description: response.description || '',
      status: this.mapStatus(response.status),
      createdAt: new Date(response.created * 1000).toISOString(),
      metadata: response.metadata,
      authorizationCode: response.charges?.data?.[0]?.id
    }
  }

  private mapStatus(status: string): PaymentStatus {
    switch (status) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return 'pending'
      case 'processing':
        return 'processing'
      case 'succeeded':
        return 'completed'
      case 'requires_capture':
        return 'processing'
      case 'canceled':
        return 'cancelled'
      default:
        return 'failed'
    }
  }
}