import { NextRequest, NextResponse } from 'next/server'
import { simulatePayment } from '@/lib/paymentService'

interface SimulatePaymentRequest {
  id: string
  action?: 'approve' | 'reject'
  method?: 'pix' | 'credit_card' | 'debit_card'
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulatePaymentRequest = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Only allow simulation in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Payment simulation not allowed in production' },
        { status: 403 }
      )
    }

    // Simulate payment using the new payment service
    // Only 'pix' and 'credit_card' are supported for simulation
    const method = body.method === 'debit_card' ? 'credit_card' : (body.method || 'pix')
    const result = await simulatePayment(
      body.id, 
      body.action || 'approve', 
      method as 'pix' | 'credit_card'
    )
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error simulating payment:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}