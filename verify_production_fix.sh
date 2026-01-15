#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verifying Production Deployment Fix"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd frontend

# Check 1: No hardcoded localhost in source
echo "1️⃣  Checking for hardcoded localhost references..."
LOCALHOST_COUNT=$(grep -r "http://localhost:8000" src/ 2>/dev/null | grep -v "VITE_API_URL.*localhost" | wc -l | tr -d ' ')
if [ "$LOCALHOST_COUNT" -eq "0" ]; then
  echo "   ✅ No hardcoded localhost URLs found"
else
  echo "   ❌ Found $LOCALHOST_COUNT hardcoded localhost references"
  grep -r "http://localhost:8000" src/ 2>/dev/null | grep -v "VITE_API_URL.*localhost"
  exit 1
fi

# Check 2: Static plans exist
echo "2️⃣  Checking for static RAZORPAY_PLANS..."
if grep -q "const RAZORPAY_PLANS" src/components/Payment/PricingModal.jsx; then
  echo "   ✅ Static RAZORPAY_PLANS found"
else
  echo "   ❌ Static RAZORPAY_PLANS not found"
  exit 1
fi

# Check 3: API client uses env var
echo "3️⃣  Checking API client configuration..."
if grep -q "import.meta.env.VITE_API_URL" src/api.js; then
  echo "   ✅ API client uses environment variable"
else
  echo "   ❌ API client doesn't use environment variable"
  exit 1
fi

# Check 4: .env.example has production URL
echo "4️⃣  Checking .env.example..."
if grep -q "replai-bhvz.onrender.com" .env.example; then
  echo "   ✅ .env.example has production URL"
else
  echo "   ❌ .env.example missing production URL"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All checks passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo "   1. Set VITE_API_URL in Vercel environment variables"
echo "   2. Deploy: vercel --prod"
echo "   3. Test production site"
echo ""

