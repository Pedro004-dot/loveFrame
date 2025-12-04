# 🚀 Payment Gateway Setup Guide

## 📋 Required Credentials

### 🥑 **Abacate Pay** (PIX)
- **Variable**: `abacatepayKey`
- **Format**: `abc_dev_XXXXXXXX` (development) or `abc_live_XXXXXXXX` (production)
- **Get from**: [AbacatePay Dashboard](https://abacatepay.com)
- **Status**: ✅ **CONFIGURED** - `abc_dev_uyQ6Ugn0q66phxnQm5Ya03Rx`

### 💳 **Stripe** (Credit/Debit Cards)
- **Variables**: 
  - `STRIPE_SECRET_KEY` (server-side, starts with `sk_test_` or `sk_live_`)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (client-side, starts with `pk_test_` or `pk_live_`)
- **Get from**: [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- **Status**: ❌ **NOT CONFIGURED**

### 💰 **Mercado Pago** (PIX + Cards)
- **Variables**:
  - `MERCADOPAGO_ACCESS_TOKEN` (long access token)
  - `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` (starts with `APP_USR`)
- **Get from**: [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
- **Status**: ❌ **NOT CONFIGURED**

## 🔧 Environment Variables Setup

Add to your `.env` file:

```bash
# Abacate Pay (PIX) - ✅ Already configured
abacatepayKey=abc_dev_uyQ6Ugn0q66phxnQm5Ya03Rx

# Stripe (Cards) - ❌ Need to configure
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Mercado Pago (PIX + Cards) - ❌ Need to configure  
MERCADOPAGO_ACCESS_TOKEN=YOUR_ACCESS_TOKEN_HERE
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_YOUR_PUBLIC_KEY_HERE
```

## 🛠️ Current System Status

### ✅ **Working**
- **Abacate Pay**: PIX payments fully functional
- **API Architecture**: Adapter pattern implemented
- **Failover**: Automatic provider switching
- **Testing**: Development simulation working

### 🧪 **Test Results** (Latest)
```json
{
  "provider": "AbacatePay",
  "status": "✅ SUCCESS",
  "pix_creation": "✅ Working",
  "qr_code": "✅ Generated",
  "copy_paste": "✅ Generated", 
  "dev_mode": true
}
```

## 🎯 Next Steps

### 1. **Add Stripe for Cards** (Recommended)
```bash
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. **Or Add Mercado Pago** (Alternative)
```bash
# Get from: https://www.mercadopago.com.br/developers
MERCADOPAGO_ACCESS_TOKEN=...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_...
```

### 3. **Production Setup**
- Replace `abc_dev_` with `abc_live_` for Abacate Pay
- Replace `sk_test_` with `sk_live_` for Stripe
- Replace test tokens with production tokens for Mercado Pago

## 🔍 How to Test

### Test Payment Health
```bash
curl http://localhost:3000/api/payment/health
```

### Test PIX Creation
```bash
curl http://localhost:3000/api/test-payment
```

### Manual Test Script
```bash
node scripts/test-payment-providers.js
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Payment    │───▶│   Providers     │
│   (Checkout)    │    │   Service    │    │                 │
└─────────────────┘    └──────────────┘    │  ✅ Abacate Pay │
                                           │  ❌ Stripe      │
                                           │  ❌ MercadoPago │
                                           └─────────────────┘
```

## 🚨 Current Issue: RESOLVED ✅

**Problem**: PIX QR Code and copy-paste not generating
**Solution**: Fixed Abacate Pay adapter to handle their API response structure
**Status**: ✅ **FIXED** - PIX payments now working correctly

The Abacate Pay API returns data in this format:
```json
{
  "error": null,
  "data": {
    "id": "pix_char_...",
    "brCode": "00020101021126580...", // Copy-paste code
    "brCodeBase64": "data:image/png;base64,...", // QR Code
    "status": "PENDING"
  }
}
```

Adapter now correctly maps:
- `brCode` → `copyPasteCode`
- `brCodeBase64` → `qrCode`
- `PENDING` → `pending`