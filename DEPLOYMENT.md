# Deployment Guide

Complete guide to deploy Conversation Copilot to production.

## 🎯 Deployment Options

### Recommended Stack
- **Backend**: Railway or Render
- **Frontend**: Vercel or Netlify
- **Database**: Supabase or Neon (managed PostgreSQL)

**Total cost**: $0-20/month to start

---

## 📦 Backend Deployment (Railway)

### 1. Prepare for Deployment

Create `Procfile` in backend directory:
```bash
cd backend
cat > Procfile << EOF
web: uvicorn main:app --host 0.0.0.0 --port \$PORT
EOF
```

Create `runtime.txt`:
```bash
cat > runtime.txt << EOF
python-3.11
EOF
```

### 2. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your project
railway link

# Set environment variables
railway variables set DATABASE_URL="your-database-url"
railway variables set OPENROUTER_API_KEY="your-openrouter-key"
railway variables set SECRET_KEY="your-secret-key"

# Deploy
railway up
```

Your backend will be at: `https://your-app.railway.app`

### 3. Alternative: Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `DATABASE_URL`
   - `OPENROUTER_API_KEY`
   - `SECRET_KEY`
6. Click "Create Web Service"

---

## 🎨 Frontend Deployment (Vercel)

### 1. Update API URL

Edit `frontend/src/api.js`:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000'
```

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.railway.app
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? conversation-copilot
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

Your frontend will be at: `https://conversation-copilot.vercel.app`

### 3. Alternative: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
netlify deploy

# Follow prompts, then deploy to production
netlify deploy --prod
```

---

## 🗄️ Database Deployment (Supabase)

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization
4. Set project name: `conversation-copilot`
5. Set database password (save this!)
6. Choose region (closest to your users)
7. Click "Create new project"

### 2. Get Connection String

1. Go to Project Settings → Database
2. Copy "Connection string" (URI format)
3. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 3. Update Environment Variables

Update your backend deployment:

**Railway:**
```bash
railway variables set DATABASE_URL="postgresql://postgres:..."
```

**Render:**
Go to Environment → Add `DATABASE_URL`

### 4. Run Migrations

The tables will be created automatically on first backend startup (SQLAlchemy creates them).

To verify:
```bash
# Connect to Supabase database
psql "postgresql://postgres:..."

# Check tables
\dt

# Should see: users, contacts, conversations, messages
```

---

## 🔒 Security Checklist

### Before Going Live

- [ ] Change `SECRET_KEY` to a strong random value
  ```bash
  python -c "import secrets; print(secrets.token_hex(32))"
  ```

- [ ] Enable HTTPS only (Vercel/Railway do this automatically)

- [ ] Update CORS origins in `backend/main.py`:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=[
          "https://your-frontend.vercel.app",
          "http://localhost:3000"  # Keep for local dev
      ],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

- [ ] Add rate limiting (see DEVELOPMENT.md)

- [ ] Set up error tracking (Sentry)

- [ ] Enable database backups (Supabase does this automatically)

- [ ] Review OpenRouter API key permissions

- [ ] Add environment variable validation

---

## 📊 Monitoring Setup

### 1. Backend Monitoring (Sentry)

```bash
cd backend
pip install sentry-sdk[fastapi]
```

Add to `main.py`:
```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)
```

### 2. Analytics (PostHog)

```bash
cd frontend
npm install posthog-js
```

Add to `frontend/src/main.jsx`:
```javascript
import posthog from 'posthog-js'

posthog.init('your-project-api-key', {
  api_host: 'https://app.posthog.com'
})
```

Track events in `Dashboard.jsx`:
```javascript
posthog.capture('reply_generated', {
  platform: platform,
  stage: classification?.stage
})
```

---

## 💳 Payment Integration (Stripe)

### 1. Setup Stripe

```bash
cd backend
pip install stripe
```

### 2. Add to `models.py`:
```python
class User(Base):
    # ... existing fields ...
    credits = Column(Integer, default=10)  # Free credits
    stripe_customer_id = Column(String)
    subscription_status = Column(String)  # active, cancelled, expired
    subscription_expires = Column(DateTime)
```

### 3. Create Payment Endpoint

Add to `main.py`:
```python
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

@app.post("/create-checkout-session")
async def create_checkout_session(
    plan: str,  # "20_replies" or "unlimited_7days"
    current_user: User = Depends(get_current_user)
):
    prices = {
        "20_replies": "price_xxx",  # Create in Stripe Dashboard
        "unlimited_7days": "price_yyy"
    }
    
    session = stripe.checkout.Session.create(
        customer_email=current_user.email,
        payment_method_types=['card'],
        line_items=[{
            'price': prices[plan],
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://your-app.com/success',
        cancel_url='https://your-app.com/cancel',
    )
    
    return {"checkout_url": session.url}

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    event = stripe.Webhook.construct_event(
        payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
    )
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Update user credits/subscription
        
    return {"status": "success"}
```

### 4. Add Payment UI

Create `frontend/src/components/PaymentModal.jsx` with Stripe Elements.

---

## 🚀 Domain Setup

### 1. Buy Domain (Namecheap/GoDaddy)

Example: `conversationcopilot.com`

### 2. Configure DNS

**For Vercel (Frontend):**
1. Go to Vercel project settings
2. Add custom domain
3. Follow DNS instructions

**For Railway (Backend):**
1. Go to Railway project settings
2. Add custom domain: `api.conversationcopilot.com`
3. Add CNAME record in your DNS

### 3. SSL Certificates

Both Vercel and Railway provide free SSL certificates automatically.

---

## 📈 Performance Optimization

### 1. Enable Caching

Add Redis for caching (Railway addon):
```bash
railway add redis
```

Update `openrouter_service.py`:
```python
import redis

redis_client = redis.from_url(settings.REDIS_URL)

async def classify_conversation(self, chat_log: str):
    # Check cache first
    cache_key = f"classify:{hash(chat_log)}"
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Call AI
    result = await self._call_ai(...)
    
    # Cache result (1 hour)
    redis_client.setex(cache_key, 3600, json.dumps(result))
    return result
```

### 2. Database Indexing

Already done in `models.py`, but verify:
```sql
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_contacts_user ON contacts(user_id);
```

### 3. CDN for Frontend

Vercel and Netlify include CDN automatically.

---

## 🧪 Pre-Launch Checklist

### Testing
- [ ] Test signup/login flow
- [ ] Test conversation paste and analysis
- [ ] Test reply generation
- [ ] Test on mobile devices
- [ ] Test error handling
- [ ] Load test with 100 concurrent users

### Security
- [ ] HTTPS enabled
- [ ] Strong SECRET_KEY
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] SQL injection protected
- [ ] XSS protected

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog/Mixpanel)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Database backups enabled

### Legal
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Cookie consent (if in EU)
- [ ] GDPR compliance (if applicable)

### Marketing
- [ ] Landing page ready
- [ ] Social media accounts created
- [ ] Beta user list prepared
- [ ] Launch announcement written

---

## 🎉 Launch Day

### 1. Final Checks
```bash
# Test production endpoints
curl https://api.conversationcopilot.com
curl https://conversationcopilot.com

# Check logs
railway logs
vercel logs
```

### 2. Announce

- Post on Reddit (r/SideProject, r/startups)
- Tweet about it
- Post on Hacker News (Show HN)
- Email beta users
- Post in relevant communities

### 3. Monitor

Watch for:
- Error rates
- Response times
- User signups
- Conversion rates
- API costs

---

## 📊 Post-Launch

### Week 1
- Fix critical bugs
- Respond to user feedback
- Monitor costs
- Optimize AI prompts based on usage

### Week 2-4
- Implement payment system
- Add requested features
- Improve onboarding
- Start marketing campaigns

### Month 2-3
- Build Chrome extension
- Add mobile app
- Scale infrastructure
- Hire team members

---

## 💰 Cost Estimates

### Starter (0-100 users)
- Railway: $5/month
- Vercel: Free
- Supabase: Free
- Domain: $12/year
- **Total: ~$5-10/month**

### Growth (100-1000 users)
- Railway: $20/month
- Vercel: Free (or $20/month Pro)
- Supabase: $25/month
- OpenRouter: $50-200/month
- **Total: ~$100-250/month**

### Scale (1000+ users)
- Railway: $50-100/month
- Vercel: $20/month
- Supabase: $100/month
- OpenRouter: $500-2000/month
- **Total: ~$700-2200/month**

---

## 🆘 Troubleshooting

### Backend Won't Start
```bash
# Check logs
railway logs

# Check environment variables
railway variables

# Test locally with production env
export DATABASE_URL="..."
python main.py
```

### Frontend Build Fails
```bash
# Check build logs
vercel logs

# Test build locally
npm run build

# Check environment variables
vercel env ls
```

### Database Connection Issues
```bash
# Test connection
psql "postgresql://..."

# Check SSL requirements
# Add ?sslmode=require to DATABASE_URL if needed
```

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs

---

## 🎯 Success Metrics

Track these KPIs:

### Product
- Daily Active Users (DAU)
- Replies generated per user
- Conversion rate (free → paid)
- Retention rate (7-day, 30-day)

### Technical
- API response time (< 10s)
- Error rate (< 1%)
- Uptime (> 99.9%)
- AI cost per user

### Business
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target: > 3:1)

---

## 🚀 You're Ready!

You have everything you need to deploy and launch Conversation Copilot.

**Next steps:**
1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Set up Supabase database
4. Test everything
5. Launch! 🎉

Good luck! 🍀
