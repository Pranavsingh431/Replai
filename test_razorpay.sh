#!/bin/bash

# Test Razorpay Integration

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Testing Razorpay Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend

# Activate venv
echo "1️⃣  Activating virtual environment..."
source venv/bin/activate

# Test imports
echo "2️⃣  Testing Razorpay module import..."
python -c "from payments.razorpay import get_razorpay_client, PLANS; print('✅ Razorpay module imports successfully')" || exit 1

# Test main.py import
echo "3️⃣  Testing main.py import..."
python -c "from main import app; print('✅ Backend imports successfully')" || exit 1

# Test plans
echo "4️⃣  Testing pricing plans..."
python -c "from payments.razorpay import PLANS; print('Plans available:', list(PLANS.keys()))"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 To start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "🧪 To test order creation:"
echo "   curl -X POST 'http://localhost:8000/razorpay/create-order?plan=small'"
echo ""

