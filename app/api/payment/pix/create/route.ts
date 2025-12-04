import { NextRequest, NextResponse } from 'next/server'
import { createPixPayment } from '@/lib/paymentService'

interface PixPaymentRequest {
  amount: number
  description: string
  customerId?: string
  metadata?: {
    email?: string
    phone?: string
    retrospectiveId?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PixPaymentRequest = await request.json()
    
    // Validate required fields
    if (!body.amount || !body.description) {
      return NextResponse.json(
        { error: 'Amount and description are required' },
        { status: 400 }
      )
    }

    // Create PIX payment using the new payment service
    const pixPayment = await createPixPayment(body)
    
    console.log('✅ PIX Payment Created via API:', {
      id: pixPayment.id,
      amount: pixPayment.amount,
      status: pixPayment.status,
      description: pixPayment.description
    })
    console.log('📋 Payment ID para simulação:', pixPayment.id)
    
    return NextResponse.json(pixPayment)

  } catch (error) {
    console.error('Error creating PIX payment:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('not configured') ? 503 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}