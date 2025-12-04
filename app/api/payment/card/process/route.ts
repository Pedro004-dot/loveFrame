import { NextRequest, NextResponse } from 'next/server'
import { processCardPayment } from '@/lib/paymentService'

interface CardPaymentRequest {
  amount: number
  description: string
  customerId?: string
  metadata?: {
    email?: string
    phone?: string
    retrospectiveId?: string
  }
  card: {
    number: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    holderName: string
  }
  installments?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CardPaymentRequest = await request.json()
    
    // Validate required fields
    if (!body.amount || !body.description || !body.card) {
      return NextResponse.json(
        { error: 'Amount, description and card data are required' },
        { status: 400 }
      )
    }

    // Validate card data
    const { card } = body
    if (!card.number || !card.expiryMonth || !card.expiryYear || !card.cvv || !card.holderName) {
      return NextResponse.json(
        { error: 'Complete card information is required' },
        { status: 400 }
      )
    }

    // Process card payment using the new payment service
    const cardPayment = await processCardPayment(body)
    
    return NextResponse.json(cardPayment)

  } catch (error) {
    console.error('Error processing card payment:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('not configured') ? 503 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}