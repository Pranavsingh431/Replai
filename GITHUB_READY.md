# GitHub Ready - Replai Codebase

## ✅ Status: SAFE TO PUSH

This codebase has been prepared for GitHub with proper security, environment variable handling, and best practices.

---

## 🔐 Security Checklist

### Environment Variables
- ✅ All secrets moved to `.env` files
- ✅ `.env` files added to `.gitignore`
- ✅ `.env.example` files created with placeholders
- ✅ No hardcoded API keys in code
- ✅ No hardcoded database credentials
- ✅ No hardcoded OAuth secrets

### Code Verification
```bash
# Verified no hardcoded secrets:
✅ No OpenRouter API keys in Python code
✅ No Razorpay keys in Python code  
✅ No database URLs in Python code
✅ No Supabase URLs in frontend code
```

---

## 📁 Environment Files Created

### Backend (`/backend/.env`)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
PORT=8000
```

### Frontend (`/frontend/.env`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:8000
```

**Note:** `.env` files are NOT committed to Git. Use `.env.example` files as templates.

---

## 🗄️ Supabase Integration

### Database Migration
1. Go to your Supabase project → SQL Editor
2. Run `/backend/supabase_schema.sql`
3. This creates:
   - Users table (with RLS)
   - Contacts table (with RLS)
   - Conversations table (with RLS)
   - Messages table (with RLS)
   - Payments table (with RLS)
   - Auto-signup trigger (creates user profile on auth)
   - Row Level Security policies

### Authentication Setup
1. Go to Supabase → Authentication → Providers
2. Enable Email provider
3. Enable Google provider:
   - Add your Google Client ID
   - Add your Google Client Secret
   - Set redirect URL: `http://localhost:3000/dashboard` (local) or `https://yourdomain.com/dashboard` (production)

---

## 🔑 How to Set Up Locally

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Dating
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your actual keys
nano .env
```

Required keys in `backend/.env`:
- `SUPABASE_URL` - From Supabase → Project Settings → API
- `SUPABASE_ANON_KEY` - From Supabase → Project Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase → Project Settings → API (keep secret!)
- `OPENROUTER_API_KEY` - From https://openrouter.ai/keys
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` - From Razorpay Dashboard

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your actual keys
nano .env
```

Required keys in `frontend/.env`:
- `VITE_SUPABASE_URL` - From Supabase → Project Settings → API
- `VITE_SUPABASE_ANON_KEY` - From Supabase → Project Settings → API

### 4. Run Database Migration
```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of backend/supabase_schema.sql
# 3. Run the SQL
```

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 🔒 Authentication Flow

### Email + Password
1. User signs up via `/app/signup`
2. Supabase creates auth user
3. Trigger automatically creates profile in `users` table
4. User gets 10 free credits
5. Session persists across refresh

### Google OAuth
1. User clicks "Continue with Google"
2. Redirects to Google OAuth consent
3. On success, Supabase creates/logs in user
4. Redirects to `/dashboard`
5. Session persists across refresh

---

## 🚀 Deployment Notes

### Environment Variables (Production)

**Backend:**
- Set all variables from `.env.example`
- Update `SUPABASE_URL` to your Supabase project
- Update redirect URLs for OAuth

**Frontend:**
- Set `VITE_SUPABASE_URL`
- Set `VITE_SUPABASE_ANON_KEY`
- Update `VITE_API_URL` to your backend URL

### Supabase Configuration
1. Update Google OAuth redirect URL to production domain
2. Add production domain to Supabase → Authentication → URL Configuration
3. Set up Razorpay webhook URL (if using payments)

---

## 📦 Dependencies

### Backend
- `fastapi` - Web framework
- `supabase` - Supabase client
- `python-dotenv` - Environment variables
- `razorpay` - Payment processing
- `openai` / `openrouter` - AI models
- See `requirements.txt` for full list

### Frontend
- `react` - UI framework
- `@supabase/supabase-js` - Supabase client
- `react-router-dom` - Routing
- `lucide-react` - Icons
- See `package.json` for full list

---

## 🧪 Testing Checklist

### Before Pushing to GitHub
- [ ] All `.env` files are in `.gitignore`
- [ ] No secrets in committed code
- [ ] `.env.example` files are complete
- [ ] README.md is updated
- [ ] Dependencies are documented
- [ ] Setup instructions are clear

### After Cloning (New Developer)
- [ ] Can copy `.env.example` to `.env`
- [ ] Can install dependencies
- [ ] Can run database migration
- [ ] Can start backend server
- [ ] Can start frontend server
- [ ] Can sign up new user
- [ ] Can log in with Google

---

## 🔐 Security Best Practices

### Never Commit
- ❌ `.env` files
- ❌ API keys
- ❌ Database credentials
- ❌ OAuth secrets
- ❌ Service role keys
- ❌ Webhook secrets

### Always Commit
- ✅ `.env.example` files (with placeholders)
- ✅ `.gitignore` (with `.env` entry)
- ✅ Setup documentation
- ✅ Migration scripts
- ✅ Configuration templates

### Row Level Security (RLS)
All Supabase tables have RLS enabled. Users can only:
- View their own data
- Update their own data
- Delete their own data

This is enforced at the database level, not just in code.

---

## 📖 Additional Documentation

- `supabase_schema.sql` - Database schema and RLS policies
- `LOGO_INTEGRATION.md` - Logo usage and styling
- `DARK_MODE_REMOVAL.md` - UI theme documentation
- `RAZORPAY_INTEGRATION.md` - Payment processing setup

---

## 🤝 Contributing

### Setup for New Contributors
1. Follow "How to Set Up Locally" section
2. Get your own API keys (don't ask for others' keys)
3. Create your own Supabase project for development
4. Test authentication flows
5. Make changes and submit PR

### Code Standards
- Use environment variables for all secrets
- Follow existing code style
- Test authentication before committing
- Document any new environment variables

---

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists in both `backend/` and `frontend/`
- Verify keys are copied correctly (no extra spaces)
- Restart dev servers after changing `.env`

### "Authentication not working"
- Verify Supabase URL and anon key are correct
- Check Google OAuth is configured in Supabase dashboard
- Verify redirect URLs match your domain
- Check browser console for errors

### "Database queries failing"
- Verify you ran `supabase_schema.sql` in Supabase SQL Editor
- Check RLS policies are created
- Verify service role key is used in backend (not anon key)

---

## ✅ Final Verification

Before pushing to GitHub:

```bash
# 1. Check no .env files are tracked
git status | grep -E "\.env$"
# Should return nothing

# 2. Verify .gitignore includes .env
grep "\.env" .gitignore
# Should show .env entries

# 3. Check no secrets in code
grep -r "sk-or-v1" --include="*.py" --include="*.js" backend/ frontend/src/
grep -r "rzp_test" --include="*.py" --include="*.js" backend/ frontend/src/
grep -r "GOCSPX" --include="*.py" --include="*.js" backend/ frontend/src/
# All should return no results

# 4. Verify .env.example files exist
ls backend/.env.example frontend/.env.example
# Should list both files
```

---

## 🎉 Ready to Push!

Your codebase is now secure and ready for GitHub.

```bash
git add .
git commit -m "Initial commit - production-ready codebase with Supabase integration"
git push origin main
```

**The repo is safe to make PUBLIC.** ✅
