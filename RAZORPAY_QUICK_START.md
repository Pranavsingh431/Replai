# Razorpay Quick Start

## 🚀 Start Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

Backend will start at: `http://localhost:8000`

---

## 🧪 Test Order Creation

```bash
curl -X POST 'http://localhost:8000/razorpay/create-order?plan=small'
```

Expected response:
```json
{
  "order_id": "order_...",
  "amount": 9900,
  "currency": "INR",
  "razorpay_key_id": "rzp_test_..."
}
```

---

## 💰 Available Plans

| Plan   | Price  | Command                                                              |
|--------|--------|----------------------------------------------------------------------|
| small  | Rs 99  | `curl -X POST 'http://localhost:8000/razorpay/create-order?plan=small'`  |
| medium | Rs 199 | `curl -X POST 'http://localhost:8000/razorpay/create-order?plan=medium'` |
| large  | Rs 399 | `curl -X POST 'http://localhost:8000/razorpay/create-order?plan=large'`  |

---

## 🌐 Frontend Test

1. Start frontend (if not running)
2. Login to app
3. Click "Buy Credits"
4. Select a plan
5. Razorpay checkout should open

---

## ✅ What Works

- ✅ Order creation
- ✅ Razorpay checkout opens
- ✅ No errors
- ✅ Receipt length fixed
- ✅ Clean API responses

---

## ⚙️ Environment Variables

### Backend `.env`
```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
```

---

## 📖 Full Documentation

See `RAZORPAY_CLEAN_IMPLEMENTATION.md` for complete details.

---

## 🔍 Debug

If order creation fails, check:
1. Environment variables are set
2. Virtual environment is activated
3. Backend is running
4. Razorpay test keys are valid

---

## 🆘 Common Issues

### "Module not found: razorpay"
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "401 Unauthorized"
Check that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in backend/.env

### "Receipt length error"
This is fixed! Receipt is now `replai_{timestamp}` (18 chars)

---

## 📞 Support

All Razorpay code is in:
- `backend/payments/razorpay.py` (payment module)
- `backend/main.py` (endpoint)
- `frontend/src/components/Payment/PricingModal.jsx` (UI)
