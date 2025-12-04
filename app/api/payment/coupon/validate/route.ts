import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { couponCode } = body
    
    if (!couponCode) {
      return NextResponse.json(
        { error: 'Código do cupom é obrigatório' },
        { status: 400 }
      )
    }

    const apiKey = process.env.abacatepayKey
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AbacatePay API key não configurada' },
        { status: 503 }
      )
    }

    // Validar cupom via API da AbacatePay
    // Listar todos os cupons e buscar o cupom específico
    try {
      const response = await fetch('https://api.abacatepay.com/v1/coupon/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`AbacatePay API error: ${response.status} - ${errorData}`)
      }

      const result = await response.json()
      const coupons = result.data || []
      
      // Buscar o cupom pelo ID (código)
      const coupon = coupons.find((c: any) => 
        c.id?.toUpperCase() === couponCode.toUpperCase()
      )

      if (!coupon) {
        return NextResponse.json({
          valid: false,
          error: 'Cupom não encontrado'
        }, { status: 404 })
      }

      // Verificar se o cupom está ativo
      if (coupon.status !== 'ACTIVE') {
        return NextResponse.json({
          valid: false,
          error: 'Cupom inativo ou expirado'
        }, { status: 400 })
      }

      // Verificar se ainda pode ser usado
      if (coupon.maxRedeems !== -1 && coupon.redeemsCount >= coupon.maxRedeems) {
        return NextResponse.json({
          valid: false,
          error: 'Cupom esgotado (limite de resgates atingido)'
        }, { status: 400 })
      }

      // Converter discountKind para o formato esperado
      const discountType = coupon.discountKind === 'PERCENTAGE' 
        ? 'percentage' 
        : coupon.discountKind === 'FIXED' 
        ? 'fixed' 
        : 'percentage'

      // Converter discount: se PERCENTAGE, já vem como número (ex: 20 = 20%)
      // Se FIXED, vem como valor em centavos
      const discount = discountType === 'percentage' 
        ? coupon.discount / 100  // Converter 20 para 0.20
        : coupon.discount / 100   // Se FIXED, também está em centavos

      console.log('✅ Cupom validado:', {
        id: coupon.id,
        discount: discount,
        discountType: discountType,
        status: coupon.status
      })

      return NextResponse.json({
        valid: true,
        discount: discount,
        discountType: discountType,
        coupon: {
          id: coupon.id,
          notes: coupon.notes,
          maxRedeems: coupon.maxRedeems,
          redeemsCount: coupon.redeemsCount
        }
      })
    } catch (apiError) {
      console.error('Error validating coupon with AbacatePay:', apiError)
      
      // Fallback para validação local em caso de erro na API
      const validCoupons: Record<string, { discount: number; type: 'percentage' }> = {
        'LOVEFRAME10': { discount: 0.10, type: 'percentage' },
        'LOVEFRAME20': { discount: 0.20, type: 'percentage' },
        'LANCAMENTO': { discount: 0.50, type: 'percentage' },
      }

      const coupon = validCoupons[couponCode.toUpperCase()]
      
      if (coupon) {
        console.warn('Using local coupon validation as fallback')
        return NextResponse.json({
          valid: true,
          discount: coupon.discount,
          discountType: coupon.type,
          coupon: { code: couponCode.toUpperCase() }
        })
      } else {
        return NextResponse.json({
          valid: false,
          error: apiError instanceof Error ? apiError.message : 'Cupom inválido ou expirado'
        }, { status: 400 })
      }
    }
  } catch (error) {
    console.error('Error validating coupon:', error)
    
    return NextResponse.json(
      { 
        valid: false,
        error: error instanceof Error ? error.message : 'Erro ao validar cupom'
      },
      { status: 500 }
    )
  }
}

