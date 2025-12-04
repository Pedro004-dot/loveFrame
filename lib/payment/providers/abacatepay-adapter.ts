import {
  PixProvider,
  ProviderConfig
} from '../interfaces'
import {
  PixPaymentRequest,
  PixPaymentResponse,
  PaymentStatusResponse,
  PaymentSimulationRequest,
  PaymentSimulationResponse,
  PaymentStatus
} from '../types'

interface AbacatePayConfig extends ProviderConfig {
  apiKey: string
  baseUrl?: string
}

export class AbacatePayAdapter implements PixProvider {
  readonly name = 'AbacatePay'
  readonly supportedMethods: ['pix'] = ['pix']
  
  private config: AbacatePayConfig
  private baseUrl: string

  constructor(config: AbacatePayConfig) {
    this.config = config
    this.baseUrl = config.baseUrl || 'https://api.abacatepay.com/v1'
    
    if (!config.apiKey) {
      throw new Error('AbacatePay API key is required')
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  async createPixPayment(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    const payload: any = {
      amount: Math.round(request.amount * 100), // Convert to cents
      description: request.description,
      customer_id: request.customerId,
      metadata: request.metadata,
      expires_in: request.expirationMinutes ? request.expirationMinutes * 60 : undefined
    }

    // Adicionar cupom se presente no metadata
    if (request.metadata?.couponCode) {
      payload.coupon_code = request.metadata.couponCode
    }

    const response = await this.makeRequest('/pixQrCode/create', 'POST', payload)
    
    return this.mapPixResponse(response)
  }

  async checkPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await this.makeRequest(`/pixQrCode/check?id=${paymentId}`)
    const data = (response as { data?: any }).data || response
    
    return {
      id: data.id,
      status: this.mapStatus(data.status),
      paidAt: data.paidAt || data.paid_at,
      amount: data.amount / 100, // Convert from cents
      method: 'pix',
      metadata: data.metadata
    }
  }

  async simulatePayment(request: PaymentSimulationRequest): Promise<PaymentSimulationResponse> {
    try {
      // AbacatePay expects 'id' as query parameter, not in body
      const response = await this.makeRequest(`/pixQrCode/simulate-payment?id=${request.paymentId}`, 'POST')
      
      return {
        success: true,
        message: 'Payment simulated successfully'
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Simulation failed'
      }
    }
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
        },
        signal: controller.signal
      }

      // Only set Content-Type and body for POST requests with body
      if (method === 'POST') {
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
        }
        // Send empty object if no body provided (some APIs require it)
        options.body = JSON.stringify(body || {})
      }

      const response = await fetch(url, options)
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`AbacatePay API error: ${response.status} - ${errorData}`)
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

  private mapPixResponse(response: any): PixPaymentResponse {
    // Handle Abacate Pay response structure: { error: null, data: {...} }
    const data = response.data || response
    
    return {
      id: data.id,
      qrCode: data.brCodeBase64 || data.qr_code || data.qrCode,
      copyPasteCode: data.brCode || data.copy_paste_code || data.copyPasteCode,
      amount: data.amount / 100, // Convert from cents
      description: data.description,
      status: this.mapStatus(data.status),
      createdAt: data.createdAt || data.created_at,
      expiresAt: data.expiresAt || data.expires_at,
      metadata: data.metadata
    }
  }

  private mapStatus(status: string): PaymentStatus {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'pending'
      case 'PROCESSING':
        return 'processing'
      case 'COMPLETED':
      case 'PAID':
        return 'completed'
      case 'FAILED':
      case 'ERROR':
        return 'failed'
      case 'CANCELLED':
      case 'CANCELED':
        return 'cancelled'
      default:
        return 'pending'
    }
  }
}