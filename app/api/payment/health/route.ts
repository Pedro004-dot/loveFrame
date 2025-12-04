import { NextRequest, NextResponse } from 'next/server'
import { checkProvidersHealth, getSupportedMethods } from '@/lib/paymentService'

export async function GET(request: NextRequest) {
  try {
    // Check health of all configured providers
    const providersHealth = await checkProvidersHealth()
    
    // Get supported payment methods
    const supportedMethods = getSupportedMethods()
    
    // Calculate overall health
    const healthyProviders = Object.values(providersHealth).filter(Boolean).length
    const totalProviders = Object.keys(providersHealth).length
    const overallHealth = totalProviders > 0 ? (healthyProviders / totalProviders) * 100 : 0
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overallHealth: `${overallHealth.toFixed(1)}%`,
      status: overallHealth > 50 ? 'healthy' : 'degraded',
      providers: providersHealth,
      supportedMethods,
      details: {
        totalProviders,
        healthyProviders,
        degradedProviders: totalProviders - healthyProviders
      }
    })

  } catch (error) {
    console.error('Error checking payment providers health:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to check providers health',
        timestamp: new Date().toISOString(),
        status: 'error'
      },
      { status: 500 }
    )
  }
}