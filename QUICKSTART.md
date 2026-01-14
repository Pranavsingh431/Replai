# Quick Start Guide

Get Conversation Copilot running in 5 minutes!

## Step 1: Database Setup (2 minutes)

```bash
# Install PostgreSQL (if not installed)
brew install postgresql
brew services start postgresql

# Create database
psql postgres -c "CREATE DATABASE conversation_copilot;"
```

## Step 2: Backend Setup (1 minute)

```bash
cd backend

# Create virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start backend server
python main.py
```

Keep this terminal open. Backend runs at `http://localhost:8000`

## Step 3: Frontend Setup (1 minute)

Open a NEW terminal:

```bash
cd frontend

# Install dependencies and start
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

## Step 4: Use the App (1 minute)

1. Open `http://localhost:3000` in your browser
2. Click "Sign up" and create an account
3. Paste a conversation like:
   ```
   You: Hey! How's your day?
   Them: Pretty good! Just finished a workout
   You: Nice! What kind of workout?
   Them: Just some running, trying to stay active
   ```
4. Click "Generate Replies"
5. Get 3 AI-powered reply options!

## That's It!

You now have a working AI conversation assistant.

## Test Conversation

Try this example:

**Contact Name:** Sarah  
**Platform:** Tinder  
**Conversation:**
```
You: Hey! I saw you're into hiking. Where's your favorite spot?
Them: Oh nice! I love going to the mountains near Boulder
You: That's awesome! I've been meaning to check that area out
Them: You should! The trails are amazing this time of year
You: Maybe you could show me around sometime? 😊
Them: Haha that could be fun! I'm usually free on weekends
```

The AI will analyze:
- Attraction score: ~65/100
- Stage: Flirting → Rapport
- Tone: Playful, friendly
- Ghosting risk: Low

And generate 3 replies to move things forward!

## Common Issues

**"Connection refused" error:**
```bash
# Make sure PostgreSQL is running
brew services list
brew services start postgresql
```

**"Port already in use":**
```bash
# Kill the process on port 8000 or 3000
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

**"Module not found" error:**
```bash
# Backend: Make sure venv is activated
source venv/bin/activate
pip install -r requirements.txt
pip install email-validator  # Required for Pydantic EmailStr

# Frontend: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**"role 'postgres' does not exist" error:**
```bash
# Update backend/config.py to use your PostgreSQL username
# Change DATABASE_URL to: postgresql://YOUR_USERNAME@localhost:5432/conversation_copilot
# Replace YOUR_USERNAME with your actual PostgreSQL user (usually your macOS username)
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the AI prompts in `backend/openrouter_service.py`
- Add payment integration for monetization
- Build a Chrome extension for direct app integration

Enjoy! 🚀
