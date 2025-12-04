import { NextRequest, NextResponse } from 'next/server'
import { validateCard } from '@/lib/paymentService'

interface CardValidationRequest {
  cardNumber: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CardValidationRequest = await request.json()
    
    if (!body.cardNumber) {
      return NextResponse.json(
        { error: 'Card number is required' },
        { status: 400 }
      )
    }

    // Validate card using the payment service
    const isValid = validateCard(body.cardNumber)
    
    return NextResponse.json({ 
      valid: isValid,
      cardNumber: body.cardNumber.replace(/\d(?=\d{4})/g, '*') // Mask for security
    })

  } catch (error) {
    console.error('Error validating card:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}