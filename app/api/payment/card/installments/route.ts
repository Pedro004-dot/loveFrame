import { NextRequest, NextResponse } from 'next/server'
import { getInstallmentOptions } from '@/lib/paymentService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const amountParam = searchParams.get('amount')
    
    if (!amountParam) {
      return NextResponse.json(
        { error: 'Amount parameter is required' },
        { status: 400 }
      )
    }

    const amount = parseFloat(amountParam)
    
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount value' },
        { status: 400 }
      )
    }

    // Get installment options using the payment service
    const installmentOptions = getInstallmentOptions(amount)
    
    return NextResponse.json({ 
      amount,
      options: installmentOptions
    })

  } catch (error) {
    console.error('Error getting installment options:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}