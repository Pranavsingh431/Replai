# Replai - AI-Powered Conversation Assistant

Replai helps you write the right thing when it matters most. Get AI-powered reply suggestions for dating, networking, and high-stakes conversations.

![Replai](./replai.png)

---

## ✨ Features

- 🤖 **AI-Powered Replies** - Get 3 reply suggestions (Safe, Flirty, Bold) tailored to your conversation
- 💬 **Conversation Memory** - AI remembers context and suggests replies that move things forward
- 👤 **Contact Management** - Track multiple conversations with personalized insights
- 💳 **Flexible Pricing** - Pay-as-you-go credits or unlimited weekly access
- 🔐 **Secure Auth** - Email/password or Google OAuth via Supabase
- 🎨 **Premium UI** - Clean, warm, romantic design built with React + Tailwind

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
cd Dating
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
# Edit .env with your actual keys
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your actual keys
```

### 4. Database Setup
1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor in Supabase Dashboard
3. Copy and run the contents of `backend/supabase_schema.sql`

### 5. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend && source venv/bin/activate && python main.py

# Terminal 2 - Frontend
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
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase JS** - Authentication & database
- **React Router** - Routing
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **Supabase** - Database & authentication
- **OpenRouter** - AI model API
- **Razorpay** - Payment processing (India)
- **Pydantic** - Data validation

### Database & Auth
- **Supabase (PostgreSQL)** - Database with RLS
- **Supabase Auth** - Email + Google OAuth

---

## 🗄️ Database Schema

### Tables
- `users` - User profiles, credits, preferences
- `contacts` - Saved contacts with conversation history
- `conversations` - Conversation state and analysis
- `messages` - Individual messages in conversations
- `payments` - Payment history and credits

All tables have **Row Level Security (RLS)** enabled. Users can only access their own data.

---

## 🔐 Authentication

### Email + Password
1. Sign up at `/app/signup`
2. Supabase creates auth user
3. Automatic profile creation via trigger
4. 10 free credits awarded

### Google OAuth
1. Click "Continue with Google"
2. OAuth consent via Supabase
3. Auto-login or sign-up
4. Redirect to dashboard

### Session Persistence
- Sessions stored in Supabase
- Auto-refresh on token expiry
- Persistent across page refresh

---

## 💳 Payment Integration

### Razorpay (India)
- **Small Pack**: ₹99 for 20 credits
- **Medium Pack**: ₹399 for 100 credits
- **Weekly Unlimited**: ₹699 for unlimited replies (7 days)

Supports UPI, Cards, Wallets, Netbanking.

### Stripe (International) - Coming Soon
Placeholder for international credit card payments.

---

## 🤖 AI Models

### OpenRouter API
- **Claude 3.5 Haiku** - Fast classification and memory updates
- **Claude 3.5 Sonnet** - Profile analysis and reply generation

---

## 📁 Project Structure

```
Dating/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── config.py            # Environment config
│   ├── models.py            # Database models (legacy)
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
│   │   ├── lib/            # Supabase client
│   │   ├── api.js          # API utilities
│   │   └── App.jsx         # Main app
│   ├── .env.example        # Environment template
│   └── package.json        # Node dependencies
│
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── GITHUB_READY.md         # Deployment guide
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Sign up with email/password
- [ ] Sign up with Google
- [ ] Create a contact
- [ ] Paste conversation
- [ ] Generate AI replies
- [ ] Copy reply
- [ ] Buy credits (Razorpay)
- [ ] Log out and log back in
- [ ] Session persists across refresh

---

## 🚀 Deployment

### Prerequisites
- Supabase project (production)
- Domain with HTTPS
- Environment variables configured

### Steps
1. Run `supabase_schema.sql` in production Supabase
2. Configure Google OAuth redirect URLs for production
3. Set environment variables in hosting platform
4. Deploy backend (Railway, Render, etc.)
5. Deploy frontend (Vercel, Netlify, etc.)
6. Test authentication flows
7. Configure Razorpay webhooks

See `GITHUB_READY.md` for detailed deployment instructions.

---

## 🔒 Security

### Environment Variables
- ✅ All secrets in `.env` files
- ✅ `.env` files in `.gitignore`
- ✅ No hardcoded API keys
- ✅ `.env.example` for setup guidance

### Database Security
- ✅ Row Level Security (RLS) on all tables
- ✅ Users can only access their own data
- ✅ Service role key only used in backend
- ✅ Anon key only used in frontend

### Authentication
- ✅ Supabase Auth (industry-standard)
- ✅ JWT tokens with auto-refresh
- ✅ Google OAuth via Supabase
- ✅ No passwords stored in application code

---

## 🤝 Contributing

### Setup
1. Fork the repository
2. Clone your fork
3. Create your own Supabase project
4. Get your own API keys (don't ask for others')
5. Follow Quick Start guide
6. Make changes
7. Submit pull request

### Guidelines
- Use environment variables for secrets
- Follow existing code style
- Test authentication before submitting
- Document new environment variables in `.env.example`

---

## 📄 License

[Add your license here]

---

## 🙏 Acknowledgments

- **Supabase** - Database and authentication
- **OpenRouter** - AI model API
- **Razorpay** - Payment processing
- **Tailwind CSS** - Styling framework
- **Lucide** - Icon library

---

## 📞 Support

For issues or questions:
1. Check `GITHUB_READY.md` troubleshooting section
2. Review Supabase documentation
3. Open an issue on GitHub

---

## 🎯 Roadmap

- [x] Email + password authentication
- [x] Google OAuth
- [x] AI-powered reply generation
- [x] Razorpay payment integration
- [ ] Stripe international payments
- [ ] Mobile app (React Native)
- [ ] More AI models
- [ ] Conversation templates
- [ ] Export conversation history

---

**Built with ❤️ for better conversations**
