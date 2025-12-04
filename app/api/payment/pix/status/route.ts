import { NextRequest, NextResponse } from 'next/server'
import { checkPaymentStatus } from '@/lib/paymentService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('id')
    const method = searchParams.get('method') as 'pix' | 'credit_card' | 'debit_card' | null
    
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    // Check payment status using the new payment service
    const status = await checkPaymentStatus(paymentId, method || undefined)
    
    return NextResponse.json(status)

  } catch (error) {
    console.error('Error checking payment status:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('not found') ? 404 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}