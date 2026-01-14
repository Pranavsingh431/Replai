# Setup Checklist - Replai

Complete these steps before pushing to GitHub and deploying.

---

## ✅ Pre-Push Checklist

### 1. Environment Files
- [x] `backend/.env` created with actual keys
- [x] `backend/.env.example` created with placeholders
- [x] `frontend/.env` created with actual keys
- [x] `frontend/.env.example` created with placeholders
- [x] `.env` files added to `.gitignore`

### 2. Security Verification
- [x] No hardcoded API keys in code
- [x] No hardcoded database credentials
- [x] No hardcoded OAuth secrets
- [x] No Supabase URLs in code
- [x] No Razorpay keys in code
- [x] No OpenRouter keys in code

### 3. Code Updates
- [x] `config.py` uses environment variables
- [x] Supabase client created (backend)
- [x] Supabase client created (frontend)
- [x] AuthContext provider created
- [x] Login component updated (Google OAuth)
- [x] Signup component updated (Google OAuth)
- [x] App.jsx updated for Supabase Auth

### 4. Documentation
- [x] README.md created
- [x] GITHUB_READY.md created
- [x] Database schema SQL created
- [x] Environment variable examples documented

---

## 📋 Supabase Setup

### Before First Use
- [ ] Create Supabase project
- [ ] Copy URL and keys to `.env` files
- [ ] Run `supabase_schema.sql` in SQL Editor
- [ ] Verify tables created (users, contacts, conversations, messages, payments)
- [ ] Verify RLS policies are active
- [ ] Test auto-signup trigger

### Google OAuth Configuration
- [ ] Go to Supabase → Authentication → Providers
- [ ] Enable Google provider
- [ ] Add Google Client ID
- [ ] Add Google Client Secret
- [ ] Set redirect URL: `http://localhost:3000/dashboard` (dev)
- [ ] Test Google sign-up
- [ ] Test Google sign-in

---

## 🧪 Testing Checklist

### Authentication
- [ ] Sign up with email/password works
- [ ] Sign up with Google works
- [ ] Login with email/password works
- [ ] Login with Google works
- [ ] Session persists across page refresh
- [ ] Logout works correctly
- [ ] Protected routes redirect to login

### Features
- [ ] Create contact works
- [ ] Paste conversation works
- [ ] Generate AI replies works
- [ ] Copy reply works
- [ ] View conversation history works
- [ ] Credits are deducted correctly

### Payments
- [ ] View pricing modal works
- [ ] Razorpay checkout opens
- [ ] Test payment completes
- [ ] Credits are added after payment
- [ ] Payment history is recorded

---

## 🚀 Deployment Checklist

### Production Supabase
- [ ] Create production Supabase project
- [ ] Run `supabase_schema.sql` in production
- [ ] Update Google OAuth redirect URL to production domain
- [ ] Add production domain to Supabase URL Configuration
- [ ] Test authentication on production

### Backend Deployment
- [ ] Set all environment variables
- [ ] Deploy to Railway/Render/Vercel
- [ ] Verify `/` endpoint returns API status
- [ ] Test API endpoints
- [ ] Configure CORS for production domain

### Frontend Deployment
- [ ] Update `VITE_API_URL` to production backend
- [ ] Set Supabase URL and anon key
- [ ] Deploy to Vercel/Netlify
- [ ] Test landing page loads
- [ ] Test authentication flows
- [ ] Test full user journey

### Post-Deployment
- [ ] Test sign-up with email
- [ ] Test sign-up with Google
- [ ] Test creating contacts
- [ ] Test generating replies
- [ ] Test payment flow
- [ ] Monitor logs for errors

---

## 🔍 Final Verification

### Before Pushing to GitHub
```bash
# 1. Check no .env files are tracked
git status | grep -E "\.env$"
# Should return nothing

# 2. Verify .gitignore includes .env
grep "\.env" .gitignore
# Should show .env entries

# 3. Check no secrets in code
grep -r "sk-or-v1" --include="*.py" --include="*.js" backend/ frontend/src/
# Should return no results

grep -r "rzp_test" --include="*.py" --include="*.js" backend/ frontend/src/
# Should return no results

grep -r "supabase.co" --include="*.py" --include="*.js" backend/ frontend/src/
# Should return no results (except in comments/docs)

# 4. Verify .env.example files exist
ls backend/.env.example frontend/.env.example
# Should list both files

# 5. Test imports
cd backend && python -c "from config import settings; print('✅ Backend config OK')"
cd frontend && npm run build
# Should build without errors
```

---

## 📝 Documentation Review

### README.md
- [x] Quick start instructions
- [x] Environment variable documentation
- [x] Tech stack listed
- [x] Database schema overview
- [x] Authentication flow explained
- [x] Deployment notes

### GITHUB_READY.md
- [x] Security checklist
- [x] Environment setup guide
- [x] Supabase configuration steps
- [x] Troubleshooting section
- [x] Verification commands

---

## 🎉 Ready to Push!

Once all checkboxes are complete:

```bash
# Initialize Git (if not already)
git init

# Stage all files
git add .

# Commit
git commit -m "Initial commit - production-ready codebase with Supabase"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/replai.git

# Push to GitHub
git push -u origin main
```

---

## ⚠️ Important Notes

### Never Commit
- ❌ `.env` files
- ❌ `venv/` directory
- ❌ `node_modules/` directory
- ❌ `__pycache__/` directories
- ❌ `.DS_Store` files
- ❌ API keys in code

### Always Commit
- ✅ `.env.example` files
- ✅ `.gitignore`
- ✅ `README.md`
- ✅ Database schemas
- ✅ Source code
- ✅ Configuration templates

---

## 🆘 Common Issues

### "Missing environment variables"
→ Check `.env` files exist and have correct format (no spaces around `=`)

### "Authentication not working"
→ Verify Supabase URL and keys are correct in `.env` files

### "Google login fails"
→ Check Google OAuth is configured in Supabase Dashboard

### "Database queries fail"
→ Verify `supabase_schema.sql` was run and tables exist

### "Payment not working"
→ Check Razorpay keys are correct and test mode is enabled

---

**Your codebase is now ready for GitHub! 🚀**
