# 🚀 DEPLOY TO PRODUCTION NOW

## ⚠️ CRITICAL - DO THIS FIRST

### Set Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Select your project: `replai-sandy`
3. Go to: **Settings** → **Environment Variables**
4. Add new variable:
   ```
   Key:   VITE_API_URL
   Value: https://replai-bhvz.onrender.com
   Scope: Production
   ```
5. Click **Save**

---

## 🚀 Deploy Methods

### Option A: Auto Deploy (Recommended)
```bash
git add .
git commit -m "Fix: Production API wiring + static payment plans"
git push origin main
```

Vercel will auto-deploy in ~2 minutes.

### Option B: Manual Deploy
```bash
vercel --prod
```

---

## ✅ Verify Deployment

### 1. Check Environment Variable
Visit: https://replai-sandy.vercel.app

Open Browser Console (F12), run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
```

Should show: `https://replai-bhvz.onrender.com`

### 2. Test Payment Modal
- Login
- Click "Buy Credits"
- Should see 3 plans immediately:
  - Small: ₹99
  - Medium: ₹199
  - Large: ₹399

### 3. Test API Calls
Open Network tab (F12):
- All requests should go to: `https://replai-bhvz.onrender.com`
- No `ERR_CONNECTION_REFUSED` errors
- No calls to `localhost:8000`

### 4. Test Features
- ✓ Login/Signup
- ✓ Dashboard loads
- ✓ Conversations update
- ✓ Reply generation
- ✓ Razorpay checkout opens

---

## 🐛 If Something Goes Wrong

### Issue: Still seeing localhost:8000
**Fix:** Check Vercel environment variable is set correctly

### Issue: Payment modal blank
**Fix:** This should not happen (static plans)
Check browser console for errors

### Issue: API calls fail
**Check:**
1. Backend is running: https://replai-bhvz.onrender.com/health
2. Should return: `{"status": "ok"}`

---

## 📋 What Was Fixed

✅ Payment modal shows static plans (no API dependency)
✅ All API calls use environment variable
✅ Proper error handling (UI doesn't break)
✅ Frontend builds successfully
✅ No hardcoded localhost in components

---

## 🎉 You're Done!

After setting `VITE_API_URL` in Vercel and deploying, your production app will work perfectly.
