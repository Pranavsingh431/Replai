# Development Guide

## Project Architecture

### The Moat: 4-Table Database Design

This is what makes Conversation Copilot defensible:

1. **users** - Who is using the system
2. **contacts** - Who they're talking to (with memory profiles)
3. **conversations** - The chat sessions
4. **messages** - Individual messages with sentiment

The magic is in the **memory system** stored in `contacts.tone_profile_json`.

### The State Engine

Every conversation is classified into:
- **Attraction Score** (-100 to +100): How interested they are
- **Stage** (cold → warm → flirting → rapport → intimate)
- **Tone** (playful, formal, dry, teasing, romantic)
- **Ghosting Risk** (low, medium, high)

This is what ChatGPT doesn't have.

### The Memory Model

For each contact, we track:
```json
{
  "emoji_usage": "high",
  "humor": "sarcastic",
  "formality": "low",
  "response_speed": "fast",
  "topics_that_work": ["travel", "music"],
  "topics_that_failed": ["work"],
  "communication_patterns": "Uses short messages, lots of questions"
}
```

This gets smarter over time.

---

## Code Structure

### Backend (`/backend`)

```
backend/
├── main.py                 # FastAPI app, all routes
├── models.py              # SQLAlchemy models (4 tables)
├── schemas.py             # Pydantic validation schemas
├── database.py            # Database connection & session
├── auth.py                # JWT authentication logic
├── openrouter_service.py  # AI integration (the brain)
├── config.py              # Settings & environment vars
└── requirements.txt       # Python dependencies
```

**Key Files:**

- `main.py`: All API endpoints, business logic
- `openrouter_service.py`: The AI engine - classification, memory, replies
- `models.py`: Database schema (the moat)

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx      # Login page
│   │   ├── Signup.jsx     # Signup page
│   │   └── Dashboard.jsx  # Main app interface
│   ├── App.jsx            # Router & auth state
│   ├── App.css            # All styles (beautiful UI)
│   ├── api.js             # Axios API client
│   └── main.jsx           # React entry point
├── index.html
├── package.json
└── vite.config.js
```

**Key Files:**

- `Dashboard.jsx`: The main UI where users paste conversations
- `api.js`: All backend API calls
- `App.css`: Modern, gradient-based UI design

---

## Adding New Features

### 1. Add a New Platform

**Backend** (`models.py`):
```python
# Already supports any platform via string field
# Just add to frontend dropdown
```

**Frontend** (`Dashboard.jsx`):
```jsx
<select value={platform} onChange={(e) => setPlatform(e.target.value)}>
  <option value="tinder">Tinder</option>
  <option value="your_new_platform">Your Platform</option>
</select>
```

### 2. Add Payment System

**Backend** (`main.py`):
```python
from stripe import Stripe

@app.post("/create-payment")
async def create_payment(
    plan: str,  # "20_replies" or "unlimited_7days"
    current_user: User = Depends(get_current_user)
):
    # Stripe integration
    # Update user credits/subscription
    pass
```

**Frontend**: Add payment modal with Stripe Elements

### 3. Improve AI Prompts

Edit `backend/openrouter_service.py`:

```python
async def generate_replies(self, chat_log, ...):
    prompt = f"""Your improved prompt here...
    
    Make replies more:
    - Witty
    - Contextual
    - Personalized
    
    {chat_log}
    """
```

### 4. Add Chrome Extension

Create `extension/manifest.json`:
```json
{
  "name": "Conversation Copilot",
  "version": "1.0",
  "permissions": ["activeTab", "storage"],
  "content_scripts": [{
    "matches": ["*://tinder.com/*", "*://bumble.com/*"],
    "js": ["content.js"]
  }]
}
```

Extract conversations from DOM, send to API, inject replies.

---

## Customizing AI Behavior

### Classification Prompt

In `openrouter_service.py`, modify `classify_conversation()`:

```python
prompt = f"""You are an expert in social and dating dynamics.

CUSTOM RULES:
- Weight recent messages more heavily
- Consider response time (if available)
- Detect sarcasm vs genuine interest

Given this conversation, determine:
1) attraction score (-100 to 100)
2) stage (cold, warm, flirting, rapport, intimate, dying)
3) dominant tone
4) ghosting risk

Conversation:
{chat_log}
"""
```

### Reply Generation Prompt

Modify `generate_replies()`:

```python
prompt = f"""You are a world-class conversation coach.

STYLE RULES:
- Use emojis sparingly (only if they do)
- Mirror their message length
- Be 20% more interesting than them
- Never be needy or desperate

Generate 3 replies:
1. SAFE: Keeps conversation alive, low risk
2. FLIRTY: Shows interest, builds attraction
3. BOLD: Direct, moves to next step (date/number/meet)

Context:
{context}

Conversation:
{chat_log}
"""
```

---

## Testing

### Backend Tests

Create `backend/test_main.py`:

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_signup():
    response = client.post("/signup", json={
        "email": "test@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_generate_replies():
    # Login first
    login_response = client.post("/login", json={
        "email": "test@test.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]
    
    # Paste conversation
    paste_response = client.post(
        "/conversation/paste",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "contact_name": "Test",
            "platform": "tinder",
            "chat_text": "You: Hey\nThem: Hi!"
        }
    )
    conv_id = paste_response.json()["conversation_id"]
    
    # Generate replies
    reply_response = client.post(
        "/generate-replies",
        headers={"Authorization": f"Bearer {token}"},
        json={"conversation_id": conv_id}
    )
    
    assert "safe" in reply_response.json()
    assert "flirty" in reply_response.json()
    assert "bold" in reply_response.json()
```

Run tests:
```bash
cd backend
pytest test_main.py
```

### Frontend Tests

Create `frontend/src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders login page', () => {
  render(<App />)
  expect(screen.getByText(/Conversation Copilot/i)).toBeInTheDocument()
})
```

---

## Performance Optimization

### 1. Cache AI Responses

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
async def classify_conversation(chat_log: str):
    # Cache identical conversations
    pass
```

### 2. Database Indexing

Already done in `models.py`:
```python
email = Column(String, unique=True, index=True)
```

Add more for queries:
```python
class Message(Base):
    conversation_id = Column(Integer, ForeignKey("conversations.id"), index=True)
```

### 3. Async Everything

Backend already uses `async/await`. Frontend uses promises.

### 4. Rate Limiting

Add to `main.py`:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/generate-replies")
@limiter.limit("10/hour")  # Free tier
async def generate_replies(...):
    pass
```

---

## Deployment

### Backend (Railway/Render/Fly.io)

1. Add `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Set environment variables:
```
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
SECRET_KEY=...
```

3. Deploy:
```bash
git push railway main
```

### Frontend (Vercel/Netlify)

1. Update `api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'
```

2. Deploy:
```bash
npm run build
vercel deploy
```

### Database (Supabase/Neon)

Use managed PostgreSQL. Update `DATABASE_URL` in config.

---

## Monetization Strategy

### Pricing Tiers

```python
# Add to models.py
class User(Base):
    credits = Column(Integer, default=10)  # Free tier
    subscription = Column(String)  # None, "weekly", "monthly"
    subscription_expires = Column(DateTime)
```

### Payment Flow

1. User runs out of free credits
2. Show payment modal
3. Stripe checkout
4. Webhook updates credits/subscription
5. User continues using app

### Pricing

- 10 replies free
- ₹99 for 20 replies
- ₹299 unlimited 7 days
- ₹999 unlimited 30 days

This is exactly like Tinder boosts - people pay when emotionally activated.

---

## Security Checklist

- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] CORS configured
- [x] SQL injection protected (SQLAlchemy ORM)
- [ ] Rate limiting (add in production)
- [ ] HTTPS only (add in production)
- [ ] Input validation (Pydantic schemas)
- [ ] API key rotation
- [ ] User data encryption

---

## Monitoring

### Add Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/generate-replies")
async def generate_replies(...):
    logger.info(f"Generating replies for conversation {conversation_id}")
    # ...
```

### Track Metrics

- Reply generation time
- AI model costs
- User engagement (replies used)
- Conversion rate (free → paid)

---

## Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## Support

Questions? Issues? Improvements?

Open an issue or reach out!

---

Built with ❤️ for better conversations
