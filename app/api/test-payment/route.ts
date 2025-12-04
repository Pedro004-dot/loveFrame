import { NextRequest, NextResponse } from 'next/server'
import { createPixPayment, checkProvidersHealth } from '@/lib/paymentService'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing payment system...')
    
    // Check providers health
    const health = await checkProvidersHealth()
    console.log('Provider health:', health)
    
    // Test PIX payment creation
    const pixPayment = await createPixPayment({
      amount: 29.90,
      description: 'LoveFrame - Test Payment',
      customerId: 'test@example.com',
      metadata: {
        email: 'test@example.com',
        timestamp: new Date().toISOString()
      } as any
    })
    
    return NextResponse.json({
      success: true,
      health,
      pixPayment,
      message: 'Payment system working correctly!'
    })

  } catch (error) {
    console.error('Test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Payment system test failed'
    }, { status: 500 })
  }
}