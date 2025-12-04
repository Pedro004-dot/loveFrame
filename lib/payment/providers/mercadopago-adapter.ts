import {
  MultiMethodProvider,
  ProviderConfig
} from '../interfaces'
import {
  PixPaymentRequest,
  PixPaymentResponse,
  CardPaymentRequest,
  CardPaymentResponse,
  PaymentStatusResponse,
  PaymentSimulationRequest,
  PaymentSimulationResponse,
  PaymentStatus,
  PaymentMethod
} from '../types'

interface MercadoPagoConfig {
  accessToken: string
  publicKey?: string
  baseUrl?: string
  environment?: 'development' | 'production'
  timeout?: number
}

export class MercadoPagoAdapter implements MultiMethodProvider {
  readonly name = 'MercadoPago'
  readonly supportedMethods: PaymentMethod[] = ['pix', 'credit_card', 'debit_card']
  
  private config: MercadoPagoConfig
  private baseUrl: string

  constructor(config: MercadoPagoConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://api.mercadopago.com'
    
    if (!config.accessToken) {
      throw new Error('MercadoPago access token is required')
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/payment_methods`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    const payload = {
      transaction_amount: request.amount,
      description: request.description,
      payment_method_id: 'pix',
      payer: {
        email: request.metadata?.email,
        identification: {
          type: 'CPF',
          number: request.metadata?.phone // This should be CPF in real scenario
        }
      },
      metadata: request.metadata
    }

    const response = await this.makeRequest<any>('/v1/payments', 'POST', payload)
    
    return {
      id: response.id.toString(),
      qrCode: response.point_of_interaction.transaction_data.qr_code,
      copyPasteCode: response.point_of_interaction.transaction_data.qr_code_base64,
      amount: response.transaction_amount,
      description: response.description,
      status: this.mapStatus(response.status),
      createdAt: response.date_created,
      expiresAt: response.date_of_expiration,
      metadata: response.metadata
    }
  }

  async processCardPayment(request: CardPaymentRequest): Promise<CardPaymentResponse> {
    const payload = {
      transaction_amount: request.amount,
      description: request.description,
      installments: request.installments || 1,
      payment_method_id: 'visa', // Should be determined based on card number
      payer: {
        email: request.metadata?.email,
        identification: {
          type: 'CPF',
          number: request.metadata?.phone // This should be CPF in real scenario
        }
      },
      token: await this.createCardToken(request.card),
      metadata: request.metadata
    }

    const response = await this.makeRequest<any>('/v1/payments', 'POST', payload)
    
    return {
      id: response.id.toString(),
      amount: response.transaction_amount,
      description: response.description,
      status: this.mapStatus(response.status),
      createdAt: response.date_created,
      installments: response.installments,
      metadata: response.metadata,
      authorizationCode: response.authorization_code
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await this.makeRequest<any>(`/v1/payments/${paymentId}`)
    
    return {
      id: response.id.toString(),
      status: this.mapStatus(response.status),
      paidAt: response.date_approved,
      amount: response.transaction_amount,
      method: response.payment_method_id === 'pix' ? 'pix' : 'credit_card',
      metadata: response.metadata
    }
  }

  validateCard(cardNumber: string): boolean {
    // Remove spaces and hyphens
    const cleaned = cardNumber.replace(/\s|-/g, '')
    
    // Check if it's a valid number
    if (!/^\d+$/.test(cleaned)) return false
    
    // Basic length validation
    return cleaned.length >= 13 && cleaned.length <= 19
  }

  getInstallmentOptions(amount: number): Array<{
    installments: number
    installmentAmount: number
    totalAmount: number
    interestRate?: number
  }> {
    const options = []
    
    // MercadoPago typically offers 1-12 installments
    for (let i = 1; i <= 12; i++) {
      const interestRate = i <= 3 ? 0 : 0.0199 * (i - 3) // Interest after 3 installments
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

  async simulatePayment(request: PaymentSimulationRequest): Promise<PaymentSimulationResponse> {
    try {
      // MercadoPago doesn't have a direct simulation endpoint in production
      // This would be a custom implementation for testing
      const action = request.action === 'approve' ? 'approved' : 'rejected'
      
      const payload = {
        status: action
      }

      await this.makeRequest(`/v1/payments/${request.paymentId}`, 'PUT', payload)
      
      return {
        success: true,
        message: `Payment ${action} successfully`
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Simulation failed'
      }
    }
  }

  private async createCardToken(card: CardPaymentRequest['card']): Promise<string> {
    const payload = {
      card_number: card.number.replace(/\s/g, ''),
      expiration_month: card.expiryMonth,
      expiration_year: card.expiryYear,
      security_code: card.cvv,
      cardholder: {
        name: card.holderName
      }
    }

    const response = await this.makeRequest<any>('/v1/card_tokens', 'POST', payload)
    return response.id
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const timeout = this.config.timeout || 30000
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      }
      
      if (method === 'POST') {
        headers['X-Idempotency-Key'] = Math.random().toString(36)
      }
      
      const options: RequestInit = {
        method,
        headers,
        signal: controller.signal
      }

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`MercadoPago API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
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

  private mapStatus(status: string): PaymentStatus {
    switch (status) {
      case 'pending':
        return 'pending'
      case 'in_process':
        return 'processing'
      case 'approved':
        return 'completed'
      case 'rejected':
        return 'failed'
      case 'cancelled':
        return 'cancelled'
      default:
        return 'pending'
    }
  }
}