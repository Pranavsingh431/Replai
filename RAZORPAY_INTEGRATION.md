# Razorpay Integration - Complete Guide

## Overview

Razorpay is now integrated for **Indian payments** with support for:
- ✅ UPI (PhonePe, Google Pay, Paytm, etc.)
- ✅ Credit/Debit Cards
- ✅ Wallets (Paytm, Mobikwik, etc.)
- ✅ Netbanking
- ✅ Instant credit addition
- ✅ Secure payment verification

---

## Test Credentials

**Razorpay Test API Key:**
```
Get your test credentials from: https://dashboard.razorpay.com/app/keys
Key ID: rzp_test_XXXXX
Key Secret: XXXXX
```

Configure these in `backend/.env`.

---

## Pricing Plans

| Plan | Price (₹) | Credits | Best For |
|------|-----------|---------|----------|
| **Small Pack** | ₹99 | 20 | Try it out |
| **Medium Pack** | ₹399 | 100 | Regular users (Best Value) |
| **Weekly Unlimited** | ₹699 | Unlimited for 7 days | Power users (Most Popular) |

---

## How It Works

### 1. User Flow

1. User clicks "Buy Credits" in dashboard
2. Pricing modal opens with Razorpay selected (default for Indian users)
3. User selects a plan
4. Razorpay Checkout opens with:
   - UPI options (PhonePe, Google Pay, etc.)
   - Card payment
   - Wallets
   - Netbanking
5. User completes payment
6. Backend verifies payment signature
7. Credits added instantly to user account
8. Success message shown

### 2. Technical Flow

```
Frontend                Backend                 Razorpay
   |                       |                        |
   |-- Create Order ------>|                        |
   |                       |-- Create Order ------->|
   |                       |<-- Order ID -----------|
   |<-- Order Data --------|                        |
   |                       |                        |
   |-- Open Checkout ----->|                        |
   |                       |                        |
   |<-- Payment UI --------|----------------------->|
   |                       |                        |
   |-- Verify Payment ---->|                        |
   |                       |-- Verify Signature --->|
   |                       |<-- Verified -----------|
   |                       |                        |
   |                       |-- Add Credits          |
   |<-- Success -----------|                        |
```

---

## Backend Implementation

### 1. Razorpay Service (`backend/razorpay_service.py`)

```python
class RazorpayService:
    def create_order(plan, user_id)
    def verify_payment_signature(order_id, payment_id, signature)
    def verify_webhook_signature(payload, signature)
    def get_pricing()
```

**Pricing in paise (1 INR = 100 paise):**
- Small: 9900 paise (₹99)
- Medium: 39900 paise (₹399)
- Weekly: 69900 paise (₹699)

### 2. API Endpoints

#### Create Razorpay Order
```
POST /razorpay/create-order?plan=small
Authorization: Bearer {token}

Response:
{
  "order_id": "order_xxx",
  "amount": 9900,
  "currency": "INR",
  "key_id": "rzp_test_xxx",
  "name": "Small Pack",
  "description": "20 AI replies",
  "payment_id": 123
}
```

#### Verify Payment
```
POST /razorpay/verify-payment
Authorization: Bearer {token}
Params:
  - order_id: Razorpay order ID
  - payment_id: Razorpay payment ID
  - signature: Razorpay signature

Response:
{
  "status": "success",
  "credits": 30,
  "credits_added": 20
}
```

#### Webhook (for server-to-server notifications)
```
POST /webhook/razorpay
Headers:
  - x-razorpay-signature: {signature}
Body: Razorpay webhook payload

Events handled:
  - payment.captured (success)
  - payment.failed (failure)
```

### 3. Database Schema

**Payment Model** (updated):
```python
class Payment:
    id: int
    user_id: int
    
    # Razorpay fields
    razorpay_order_id: str
    razorpay_payment_id: str
    
    # Common fields
    amount: float  # in rupees
    currency: str  # "INR"
    credits_purchased: int
    product_type: str  # "small", "medium", "weekly"
    status: str  # "pending", "completed", "failed"
    created_at: datetime
    completed_at: datetime
```

---

## Frontend Implementation

### 1. PricingModal Component

**Features:**
- Payment method selector (Razorpay / Stripe)
- Razorpay selected by default
- Rose-themed UI matching landing page
- Animated cards with hover effects
- UPI/Card/Wallet icons

**Flow:**
1. Load products from `/products` API
2. User selects plan
3. Create Razorpay order
4. Load Razorpay Checkout script
5. Open Razorpay modal
6. Handle payment success
7. Verify on backend
8. Reload page to show new credits

### 2. Razorpay Checkout Options

```javascript
const options = {
  key: "rzp_test_xxx",
  order_id: "order_xxx",
  amount: 9900,
  currency: "INR",
  name: "Replai",
  description: "20 AI replies",
  handler: function(response) {
    // Verify payment on backend
  },
  theme: {
    color: "#E11D48"  // Rose-600 brand color
  }
}
```

---

## Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: `4000 0000 0000 0002`

**UPI:**
- Use `success@razorpay` for success
- Use `failure@razorpay` for failure

### Test Flow

1. Login to app: `test@example.com` / `test123`
2. Click "Buy Credits" in dashboard
3. Select "Small Pack" (₹99)
4. Razorpay Checkout opens
5. Select UPI or Card
6. Use test credentials
7. Complete payment
8. Credits should be added instantly

---

## Webhook Setup (Production)

### 1. Create Webhook in Razorpay Dashboard

1. Go to: https://dashboard.razorpay.com/app/webhooks
2. Click "Add New Webhook"
3. URL: `https://your-domain.com/webhook/razorpay`
4. Events: Select "payment.captured" and "payment.failed"
5. Secret: Copy the webhook secret

### 2. Update Backend Config

Add to `backend/config.py`:
```python
RAZORPAY_WEBHOOK_SECRET: str = "your_webhook_secret_here"
```

### 3. Verify Webhook

The backend automatically verifies webhook signatures using HMAC SHA256.

---

## Security

### 1. Payment Signature Verification

Every payment is verified using Razorpay's signature:

```python
message = f"{order_id}|{payment_id}"
expected_signature = hmac.new(
    RAZORPAY_KEY_SECRET.encode(),
    message.encode(),
    hashlib.sha256
).hexdigest()

return hmac.compare_digest(expected_signature, signature)
```

### 2. Webhook Signature Verification

Webhooks are verified before processing:

```python
expected_signature = hmac.new(
    RAZORPAY_WEBHOOK_SECRET.encode(),
    payload,
    hashlib.sha256
).hexdigest()
```

### 3. Double-Spend Prevention

- Payment status checked before crediting
- Database constraints on unique order IDs
- Idempotent credit addition

---

## UX Improvements

### For Indian Users:

✅ **UPI First**: UPI is the primary payment method shown  
✅ **Rupee Pricing**: All prices in ₹  
✅ **Instant Credits**: Credits added immediately after payment  
✅ **Rose Theme**: Matches landing page branding  
✅ **Mobile Optimized**: Works seamlessly on mobile  

### Payment Method Selector:

- **Razorpay** (default): UPI / Cards / Wallets
- **Stripe** (coming soon): International cards

---

## Error Handling

### Frontend:
- Failed order creation → Alert with error message
- Payment cancelled → Modal closes, no charge
- Verification failed → Alert, credits not added

### Backend:
- Invalid plan → 400 Bad Request
- Signature mismatch → 400 Invalid signature
- Database error → 500 Internal Server Error
- Webhook verification failed → 400 Invalid signature

---

## Monitoring

### Key Metrics to Track:

1. **Order Creation Rate**: How many orders are created
2. **Payment Success Rate**: % of successful payments
3. **Verification Failures**: Signature mismatches
4. **Average Order Value**: ₹99, ₹399, or ₹699
5. **Popular Plans**: Which plan sells most

### Logs:

- All payment events logged in database
- Webhook events logged to console
- Failed verifications logged with details

---

## Production Checklist

### Before Going Live:

- [ ] Replace test API keys with live keys
- [ ] Set up webhook in Razorpay dashboard
- [ ] Add webhook secret to config
- [ ] Test with real ₹1 payment
- [ ] Verify credits are added correctly
- [ ] Test refund flow (if needed)
- [ ] Set up monitoring/alerts
- [ ] Add GST/tax handling (if required)
- [ ] Add invoice generation (if required)
- [ ] Test on mobile devices
- [ ] Test UPI apps (PhonePe, Google Pay)
- [ ] Test card payments
- [ ] Test wallet payments

---

## API Reference

### Get Products

```bash
curl http://localhost:8000/products
```

Response:
```json
{
  "razorpay_products": [
    {
      "id": "small",
      "name": "Small Pack",
      "description": "20 AI replies",
      "credits": 20,
      "amount": 9900,
      "currency": "INR",
      "price_display": "₹99"
    },
    ...
  ]
}
```

### Create Order

```bash
curl -X POST "http://localhost:8000/razorpay/create-order?plan=small" \
  -H "Authorization: Bearer {token}"
```

### Verify Payment

```bash
curl -X POST "http://localhost:8000/razorpay/verify-payment" \
  -H "Authorization: Bearer {token}" \
  -d "order_id=order_xxx&payment_id=pay_xxx&signature=xxx"
```

---

## Troubleshooting

### Issue: Razorpay Checkout not opening

**Solution:**
- Check if Razorpay script is loaded
- Check browser console for errors
- Verify order creation succeeded

### Issue: Payment successful but credits not added

**Solution:**
- Check backend logs
- Verify signature verification passed
- Check database for payment record
- Check user credits in database

### Issue: Webhook not receiving events

**Solution:**
- Verify webhook URL is correct
- Check webhook secret is set
- Test webhook with Razorpay dashboard
- Check server logs for incoming requests

---

## Status

✅ Razorpay SDK installed  
✅ Backend service created  
✅ API endpoints added  
✅ Database schema updated  
✅ Frontend modal updated  
✅ Payment verification implemented  
✅ Webhook handler added  
✅ Test credentials configured  
✅ Rose theme applied  
✅ UX optimized for Indian users  

**Razorpay integration is complete and ready for testing!**

---

## Testing Now

1. **Login**: http://localhost:3000/app/login
   - Email: `test@example.com`
   - Password: `test123`

2. **Buy Credits**: Click "Buy Credits" in dashboard

3. **Select Plan**: Choose any plan (₹99, ₹399, or ₹699)

4. **Test Payment**: Use test UPI (`success@razorpay`) or test card

5. **Verify**: Credits should be added instantly!

---

**Ready to accept payments in India! 🇮🇳💳**
