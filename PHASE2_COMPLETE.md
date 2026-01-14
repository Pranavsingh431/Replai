# ✅ Phase 2 Complete: Stripe Integration & Payments

## 🎯 What's Been Built

### **Payment System**
- ✅ Stripe SDK integrated
- ✅ Checkout session creation
- ✅ Webhook handling for payment events
- ✅ Payment history tracking
- ✅ Automatic credit fulfillment

### **New Database Model**
- ✅ **Payment** table with full transaction tracking
  - Stripe session & payment intent IDs
  - Amount, currency, credits purchased
  - Product type and status
  - Timestamps for created and completed

### **Product Offerings**

| Product | Price | Credits | Description |
|---------|-------|---------|-------------|
| **20 Credits** | ₹99 | 20 | Perfect for trying out |
| **100 Credits** | ₹399 | 100 | Best value for regular users |
| **Unlimited 7 Days** | ₹699 | 1000 | Unlimited replies for a week |

---

## 🔌 New API Endpoints

### **Products**
```
GET /products
```
Returns all available products with pricing.

**Response:**
```json
{
  "products": [
    {
      "id": "20_credits",
      "name": "20 Reply Credits",
      "description": "20 AI-powered reply generations",
      "credits": 20,
      "amount": 9900,
      "currency": "inr",
      "price_display": "₹99"
    }
  ]
}
```

### **Checkout**
```
POST /checkout/create-session
```
Create a Stripe checkout session.

**Request:**
```json
{
  "product_type": "20_credits"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_test_..."
}
```

### **Webhooks**
```
POST /webhook/stripe
```
Handles Stripe webhook events (payment success, failure, etc.)

**Events Handled:**
- `checkout.session.completed` - Credits added automatically
- `payment_intent.payment_failed` - Payment marked as failed

### **Payment History**
```
GET /payments              - List all payments
GET /payments/{id}         - Get specific payment
```

**Response:**
```json
{
  "id": 1,
  "amount": 9900,
  "currency": "inr",
  "credits_purchased": 20,
  "product_type": "20_credits",
  "status": "completed",
  "created_at": "2024-01-11T...",
  "completed_at": "2024-01-11T..."
}
```

---

## 💳 Payment Flow

### **1. User Initiates Purchase**
```bash
# User clicks "Buy Credits" in UI
# Frontend calls:
POST /checkout/create-session
{
  "product_type": "20_credits"
}
```

### **2. Redirect to Stripe**
```javascript
// Frontend receives checkout URL
window.location.href = response.checkout_url;
```

### **3. User Completes Payment**
- User enters card details on Stripe's secure page
- Stripe processes payment

### **4. Webhook Notification**
```
Stripe → POST /webhook/stripe
{
  "type": "checkout.session.completed",
  "data": { ... }
}
```

### **5. Credits Added Automatically**
- Backend verifies webhook signature
- Finds payment record by session ID
- Adds credits to user account
- Updates payment status to "completed"

### **6. User Redirected Back**
```
Success: http://localhost:3000/payment/success?session_id=cs_...
Cancel:  http://localhost:3000/payment/cancel
```

---

## 🧪 Testing Payments

### **Test Mode Setup**

1. **Get Stripe Test Keys**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy "Secret key" (starts with `sk_test_`)
   - Copy "Webhook signing secret" (starts with `whsec_`)

2. **Update Config**
```python
# backend/config.py
STRIPE_SECRET_KEY = "sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET = "whsec_your_secret_here"
```

3. **Test Cards**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

Any future expiry date
Any 3-digit CVC
Any billing ZIP
```

### **Testing Locally**

1. **Install Stripe CLI**
```bash
brew install stripe/stripe-cli/stripe
stripe login
```

2. **Forward Webhooks**
```bash
stripe listen --forward-to localhost:8000/webhook/stripe
```

This gives you a webhook secret like `whsec_...`

3. **Trigger Test Payment**
```bash
stripe trigger checkout.session.completed
```

---

## 🔐 Security Features

### **Webhook Verification**
- ✅ Signature verification using Stripe's SDK
- ✅ Prevents fake webhook calls
- ✅ Only processes verified events

### **Idempotency**
- ✅ Each payment tracked by unique session ID
- ✅ Prevents double-crediting
- ✅ Safe to replay webhooks

### **User Isolation**
- ✅ Users can only see their own payments
- ✅ Credits only added to correct user
- ✅ JWT protection on all endpoints

---

## 📊 Database Schema

### **payments Table**
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    stripe_payment_intent_id VARCHAR UNIQUE,
    stripe_session_id VARCHAR UNIQUE,
    amount INTEGER,
    currency VARCHAR DEFAULT 'inr',
    credits_purchased INTEGER,
    product_type VARCHAR,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP,
    completed_at TIMESTAMP
);
```

---

## 🎨 Frontend Integration (Phase 3)

The UI will include:

### **Credits Display**
```jsx
<div className="credits-badge">
  <CreditIcon />
  <span>{user.credits} credits</span>
</div>
```

### **Buy Credits Button**
```jsx
<button onClick={handleBuyCredits}>
  Buy More Credits
</button>
```

### **Pricing Modal**
```jsx
<PricingModal>
  {products.map(product => (
    <PricingCard
      key={product.id}
      name={product.name}
      price={product.price_display}
      credits={product.credits}
      onSelect={() => createCheckout(product.id)}
    />
  ))}
</PricingModal>
```

### **Payment Success Page**
```jsx
<PaymentSuccess>
  <CheckIcon />
  <h1>Payment Successful!</h1>
  <p>20 credits have been added to your account</p>
  <Link to="/dashboard">Start Chatting</Link>
</PaymentSuccess>
```

---

## 💰 Revenue Projections

### **Pricing Strategy**
- **Free Tier**: 10 credits (attracts users)
- **Entry**: ₹99 for 20 (₹4.95/credit)
- **Value**: ₹399 for 100 (₹3.99/credit) - 20% discount
- **Premium**: ₹699 unlimited 7d (best for power users)

### **Example Scenarios**

**Casual User** (5 replies/week)
- Uses free 10 credits
- Buys ₹99 pack once/month
- **Monthly**: ₹99

**Regular User** (20 replies/week)
- Buys 100 credits
- Lasts ~5 weeks
- **Monthly**: ₹320

**Power User** (50+ replies/week)
- Buys unlimited 7-day pass
- Renews 4x/month
- **Monthly**: ₹2,796

### **At Scale**
- 1,000 users × ₹200 avg = **₹2,00,000/month**
- 10,000 users × ₹200 avg = **₹20,00,000/month**
- 100,000 users × ₹200 avg = **₹2,00,00,000/month**

---

## 🚀 Deployment Notes

### **Environment Variables**
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **Webhook Endpoint**
```
Production: https://api.replai.app/webhook/stripe
```

Configure in Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://api.replai.app/webhook/stripe`
3. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy webhook secret

---

## ✅ Phase 2 Complete!

### **What Works:**
- ✅ Stripe checkout integration
- ✅ Automatic credit fulfillment
- ✅ Webhook handling
- ✅ Payment history
- ✅ 3 product tiers
- ✅ Secure payment flow

### **Backend Status:**
- **Running**: `http://localhost:8000`
- **Database**: `replai_db` with payments table
- **API Version**: 2.0
- **New Endpoints**: 5 payment endpoints

---

## 📋 Next: Phase 3

Phase 3 will build the complete UI:
- Modern design with Tailwind CSS
- Sidebar with contacts list
- Conversation history
- Profile management
- Credits display & purchase flow
- Premium, clean aesthetic

**Ready for Phase 3?** 🎨
