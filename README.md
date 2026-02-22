# Replai – AI Conversation Assistant

Replai is a full-stack AI-powered conversation assistant designed to generate context-aware replies for high-stakes conversations (dating, networking, professional outreach).

It combines LLM-based reply generation, persistent conversation memory, credit-based monetization, and secure authentication into a production-style SaaS architecture.

### Key Capabilities

- Context-aware reply generation across multiple tone strategies (Safe, Flirty, Bold)
- Persistent conversation memory per contact
- Credit-based monetization system with pay-as-you-go and subscription tiers
- Secure authentication — Email + Google OAuth via Supabase
- Razorpay payment integration (UPI, Cards, Wallets, Netbanking)
- Full-stack architecture — FastAPI + React + Supabase

---

## Architecture Overview

```
Frontend (React + Vite)
        ↓
FastAPI Backend
        ↓
LLM API (OpenRouter — Claude 3.5 Haiku / Sonnet)
        ↓
Supabase (PostgreSQL + Auth + Row Level Security)
        ↓
Razorpay (Payments)
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Supabase account
- OpenRouter API key
- (Optional) Razorpay account for payments

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd replai
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your actual keys
```

### 3. Frontend Setup
```bash
cd frontend
npm install

cp .env.example .env
# Edit .env with your actual keys
```

### 4. Database Setup
1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor in the Supabase Dashboard
3. Run the contents of `backend/supabase_schema.sql`

### 5. Start Development Servers
```bash
# Terminal 1 — Backend
cd backend && source venv/bin/activate && python main.py

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 6. Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

---

## 🔑 Environment Variables

### Backend (`.env`)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=8000
```

### Frontend (`.env`)
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:8000
```

See `.env.example` files for complete templates.

---

## 📖 Tech Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Supabase JS** — Authentication & database client
- **React Router** — Routing
- **Lucide React** — Icons

### Backend
- **FastAPI** — Python web framework
- **Supabase** — Database & authentication
- **OpenRouter** — LLM API (Claude 3.5 Haiku / Sonnet)
- **Razorpay** — Payment processing
- **Pydantic** — Data validation

### Database & Auth
- **Supabase (PostgreSQL)** — Database with Row Level Security
- **Supabase Auth** — Email + Google OAuth

---

## 🗄️ Database Schema

The schema covers five core tables: `users` (profiles, credits, preferences), `contacts` (saved contacts with conversation history), `conversations` (state and analysis), `messages` (individual messages), and `payments` (transaction history and credit ledger). All tables have Row Level Security enabled — users can only access their own data.

---

## 🔐 Authentication

**Email + Password** — Sign up at `/app/signup`. Supabase creates the auth user, a profile trigger fires automatically, and 10 free credits are awarded.

**Google OAuth** — One-click OAuth consent via Supabase. Handles both new sign-ups and returning users, with redirect back to the dashboard.

Sessions are stored in Supabase with automatic JWT refresh and persistence across page reloads.

---

## 💳 Payment Integration

### Razorpay (India)
- **Small Pack** — ₹99 for 20 credits
- **Medium Pack** — ₹399 for 100 credits
- **Weekly Unlimited** — ₹699 for unlimited replies (7 days)

Supports UPI, Cards, Wallets, and Netbanking.

### Stripe (International) — Coming Soon

---

## 📁 Project Structure

```
replai/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Environment config
│   ├── supabase_client.py   # Supabase client
│   ├── supabase_schema.sql  # Database schema
│   ├── razorpay_service.py  # Payment processing
│   ├── .env.example         # Environment template
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # Auth context
│   │   ├── lib/             # Supabase client
│   │   ├── api.js           # API utilities
│   │   └── App.jsx          # Main app
│   ├── .env.example         # Environment template
│   └── package.json         # Node dependencies
│
├── .gitignore
└── README.md
```

---

## 🔒 Security

All secrets live in `.env` files excluded from version control. The Supabase service role key is backend-only; the anon key is frontend-only. Row Level Security enforces data isolation at the database level. Authentication uses Supabase Auth with JWT auto-refresh — no passwords stored in application code.

---

## 🚀 Deployment

1. Run `supabase_schema.sql` in your production Supabase project
2. Configure Google OAuth redirect URLs for your production domain
3. Set environment variables in your hosting platform
4. Deploy backend (Railway, Render, Fly.io)
5. Deploy frontend (Vercel, Netlify)
6. Configure Razorpay webhooks

---

## 🎯 Roadmap

- [x] Email + password authentication
- [x] Google OAuth
- [x] AI-powered reply generation
- [x] Razorpay payment integration
- [ ] Stripe international payments
- [ ] Mobile app (React Native)
- [ ] Conversation templates
- [ ] Export conversation history

---

## 🤝 Contributing

Fork the repository, create your own Supabase project and API keys, follow the Quick Start guide, and open a pull request. Document any new environment variables in the relevant `.env.example` file.

---

## 🙏 Acknowledgments

Supabase · OpenRouter · Razorpay · Tailwind CSS · Lucide

---

**Built for better conversations.**
