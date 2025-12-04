// Test script for payment providers
const https = require('https')

const ABACATE_PAY_API_KEY = process.env.abacatepayKey || 'abc_dev_uyQ6Ugn0q66phxnQm5Ya03Rx'

async function testAbacatePay() {
  console.log('🧪 Testing Abacate Pay...')
  console.log('API Key:', ABACATE_PAY_API_KEY.substring(0, 10) + '...')

  // Test 1: Health check (if available)
  try {
    const healthResponse = await makeRequest('https://api.abacatepay.com/v1/health', 'GET', null, ABACATE_PAY_API_KEY)
    console.log('✅ Health check:', healthResponse)
  } catch (error) {
    console.log('⚠️ Health check not available:', error.message)
  }

  // Test 2: Create PIX payment
  try {
    const pixPayload = {
      amount: 2990, // R$ 29.90 in cents
      description: 'LoveFrame - Test Payment',
      customer_id: 'test@example.com',
      metadata: {
        test: true,
        timestamp: new Date().toISOString()
      }
    }

    console.log('📋 Creating PIX payment with payload:', JSON.stringify(pixPayload, null, 2))
    
    const pixResponse = await makeRequest('https://api.abacatepay.com/v1/pixQrCode/create', 'POST', pixPayload, ABACATE_PAY_API_KEY)
    console.log('✅ PIX payment created:', JSON.stringify(pixResponse, null, 2))
    
    // Test status check
    if (pixResponse.id) {
      const statusResponse = await makeRequest(`https://api.abacatepay.com/v1/pixQrCode/check?id=${pixResponse.id}`, 'GET', null, ABACATE_PAY_API_KEY)
      console.log('✅ Status check:', JSON.stringify(statusResponse, null, 2))
    }

    return pixResponse
    
  } catch (error) {
    console.error('❌ PIX payment failed:', error.message)
    console.error('Full error:', error.details)
    return null
  }
}

function makeRequest(url, method, data, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LoveFrame/1.0'
      }
    }

    const req = https.request(url, options, (res) => {
      let body = ''
      
      res.on('data', (chunk) => {
        body += chunk
      })
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed)
          } else {
            const error = new Error(`HTTP ${res.statusCode}: ${parsed.message || parsed.error || body}`)
            error.details = parsed
            reject(error)
          }
        } catch (parseError) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(body)
          } else {
            const error = new Error(`HTTP ${res.statusCode}: ${body}`)
            error.details = { raw: body }
            reject(error)
          }
        }
      })
    })

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`))
    })

    if (data && method === 'POST') {
      req.write(JSON.stringify(data))
    }
    
    req.end()
  })
}

async function main() {
  console.log('🚀 Payment Providers Test\n')
  
  console.log('📋 Required Credentials:')
  console.log('='.repeat(50))
  console.log('🥑 ABACATE PAY:')
  console.log('  - abacatepayKey (starts with abc_dev_ or abc_live_)')
  console.log('  - Get from: https://abacatepay.com')
  console.log('')
  console.log('💳 STRIPE:')
  console.log('  - STRIPE_SECRET_KEY (starts with sk_test_ or sk_live_)')
  console.log('  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (starts with pk_test_ or pk_live_)')
  console.log('  - Get from: https://dashboard.stripe.com/apikeys')
  console.log('')
  console.log('💰 MERCADO PAGO:')
  console.log('  - MERCADOPAGO_ACCESS_TOKEN (long string)')
  console.log('  - NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY (starts with APP_USR)')
  console.log('  - Get from: https://www.mercadopago.com.br/developers')
  console.log('='.repeat(50))
  console.log('')

  // Test Abacate Pay
  await testAbacatePay()
  
  console.log('\n🏁 Test completed!')
}

if (require.main === module) {
  main().catch(console.error)
}