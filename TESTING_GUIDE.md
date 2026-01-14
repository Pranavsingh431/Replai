# Testing Guide

Complete guide to test Conversation Copilot end-to-end.

## Quick Test (5 minutes)

### 1. Start the Application

```bash
# Option 1: Use the startup script
./start.sh

# Option 2: Manual start
# Terminal 1 - Backend
cd backend
source venv/bin/activate
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Test User Registration

1. Open `http://localhost:3000`
2. Click "Sign up"
3. Enter:
   - Email: `test@example.com`
   - Password: `password123`
   - Display Name: `Test User`
4. Click "Sign Up"
5. You should be redirected to the dashboard

### 3. Test Conversation Analysis

Use this test conversation:

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

**Expected Results:**
- Attraction Score: 50-70
- Stage: Flirting or Rapport
- Tone: Playful, friendly
- Ghosting Risk: Low

**Expected Replies:**
- Safe: Friendly, keeps conversation going
- Flirty: Playful, shows interest
- Bold: Asks for specific plans/date

### 4. Test Copy Functionality

1. Click "Copy" on any reply
2. Button should change to "Copied!"
3. Paste somewhere to verify it copied correctly

---

## Detailed Testing

### Backend API Tests

#### Test 1: Health Check
```bash
curl http://localhost:8000
```

Expected:
```json
{"message": "Conversation Copilot API", "status": "running"}
```

#### Test 2: Signup
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api_test@example.com",
    "password": "testpass123",
    "display_name": "API Test User"
  }'
```

Expected:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

Save the token for next tests!

#### Test 3: Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api_test@example.com",
    "password": "testpass123"
  }'
```

#### Test 4: Get User Info
```bash
curl http://localhost:8000/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test 5: Paste Conversation
```bash
curl -X POST http://localhost:8000/conversation/paste \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "contact_name": "Test Contact",
    "platform": "tinder",
    "chat_text": "You: Hey how are you?\nThem: Good! You?\nYou: Great! Want to grab coffee?"
  }'
```

Save the `conversation_id` from response!

#### Test 6: Generate Replies
```bash
curl -X POST http://localhost:8000/generate-replies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "conversation_id": 1
  }'
```

Expected:
```json
{
  "safe": "...",
  "flirty": "...",
  "bold": "..."
}
```

#### Test 7: Get Conversations
```bash
curl http://localhost:8000/conversations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test 8: Get Contacts
```bash
curl http://localhost:8000/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Test Scenarios

### Scenario 1: Cold Conversation (LinkedIn)

**Input:**
```
Contact: John Smith
Platform: LinkedIn
Conversation:
You: Hi John, I saw your profile and was impressed by your work at Google
Them: Thank you! What do you do?
You: I'm a software engineer at a startup. Would love to connect
```

**Expected:**
- Stage: Cold or Warm
- Tone: Professional, formal
- Replies should be professional, not flirty

### Scenario 2: Flirty Conversation (Tinder)

**Input:**
```
Contact: Emma
Platform: Tinder
Conversation:
You: Your photos are amazing! Love the one from Paris
Them: Haha thanks! That was such a fun trip
You: I'm jealous! I've always wanted to go
Them: You should! Maybe I can give you some tips 😉
You: I'd love that. When are you free?
Them: How about this weekend?
```

**Expected:**
- Stage: Flirting or Rapport
- Attraction Score: 60-80
- Bold reply should suggest specific plans

### Scenario 3: Dying Conversation

**Input:**
```
Contact: Mike
Platform: Bumble
Conversation:
You: Hey! How was your weekend?
Them: Good
You: Do anything fun?
Them: Not really
You: Cool, I went hiking
Them: Nice
```

**Expected:**
- Stage: Dying
- Ghosting Risk: High
- Replies should try to revive or gracefully exit

### Scenario 4: Intimate Conversation

**Input:**
```
Contact: Lisa
Platform: WhatsApp
Conversation:
You: I had such a great time last night
Them: Me too! You're really easy to talk to
You: I feel the same way. Want to do it again soon?
Them: Definitely! I'm free Thursday
You: Perfect, I know a great place
Them: Can't wait ❤️
```

**Expected:**
- Stage: Intimate or Rapport
- Attraction Score: 70-90
- Tone: Romantic, warm
- Replies should maintain intimacy

---

## Frontend Testing

### Test User Flows

#### Flow 1: New User Journey
1. Visit homepage
2. Click "Sign up"
3. Create account
4. Redirected to dashboard
5. See empty state
6. Paste first conversation
7. Get replies
8. Copy a reply
9. Paste another conversation
10. Logout
11. Login again
12. See previous conversations (future feature)

#### Flow 2: Multiple Conversations
1. Login
2. Paste Tinder conversation
3. Note the classification results
4. Paste LinkedIn conversation
5. Compare classification (should be different tone)
6. Paste WhatsApp conversation
7. All should have different reply styles

#### Flow 3: Error Handling
1. Try to paste without contact name → See error
2. Try to paste empty conversation → See error
3. Logout and try to access dashboard → Redirected to login
4. Try to login with wrong password → See error
5. Try to signup with existing email → See error

---

## Performance Testing

### Test 1: Response Time

Paste a conversation and measure time to get replies.

**Expected:**
- Classification: 2-4 seconds
- Memory update: 2-3 seconds
- Reply generation: 3-5 seconds
- **Total: 7-12 seconds**

### Test 2: Multiple Users

Create 5 accounts and paste conversations simultaneously.

**Expected:**
- All should complete successfully
- No database conflicts
- No token collisions

### Test 3: Long Conversations

Paste a conversation with 50+ messages.

**Expected:**
- Should still work
- May take longer (15-20 seconds)
- Replies should be contextually relevant

---

## Database Testing

### Check Database Contents

```bash
# Connect to database
psql conversation_copilot

# Check users
SELECT id, email, display_name FROM users;

# Check contacts
SELECT id, name, platform, interest_score, stage FROM contacts;

# Check conversations
SELECT id, user_id, contact_id, platform FROM conversations;

# Check messages
SELECT id, conversation_id, sender, text FROM messages LIMIT 10;

# Check memory profiles
SELECT name, tone_profile_json FROM contacts WHERE tone_profile_json IS NOT NULL;
```

---

## AI Quality Testing

### Test Different Conversation Types

1. **Professional (LinkedIn)**
   - Should generate formal replies
   - No flirting
   - Focus on networking

2. **Casual (Tinder)**
   - Should be playful
   - Appropriate flirting
   - Fun and engaging

3. **Direct (Bumble)**
   - Should be confident
   - Clear intentions
   - Move things forward

4. **Friendly (WhatsApp)**
   - Should match existing tone
   - Maintain relationship
   - Natural conversation

### Test Edge Cases

1. **Very short conversation**
   ```
   You: Hey
   Them: Hi
   ```
   - Should still generate replies
   - May have lower confidence

2. **One-sided conversation**
   ```
   You: Hey how are you?
   You: Did you see my last message?
   You: Hello?
   ```
   - Should detect ghosting risk: HIGH
   - Bold reply might suggest moving on

3. **Emoji-heavy conversation**
   ```
   You: Hey! 😊
   Them: Hi!! 😄🎉
   You: How's it going? 🌟
   Them: Amazing!! 💯🔥
   ```
   - Replies should include emojis
   - Match their energy

4. **Mixed language** (if applicable)
   - Should handle gracefully
   - Or show error message

---

## Security Testing

### Test 1: Authentication

1. Try to access `/conversations` without token → 401 Unauthorized
2. Try with invalid token → 401 Unauthorized
3. Try with expired token → 401 Unauthorized
4. Try with valid token → 200 OK

### Test 2: Authorization

1. User A creates conversation
2. User B tries to access User A's conversation → 404 Not Found
3. User A can access their own conversation → 200 OK

### Test 3: SQL Injection

Try malicious inputs:
```
Contact Name: Robert'); DROP TABLE users;--
Platform: tinder
```

**Expected:** Should be safely escaped by SQLAlchemy

### Test 4: XSS

Try script injection:
```
Contact Name: <script>alert('xss')</script>
```

**Expected:** Should be safely rendered by React

---

## Troubleshooting Tests

### If Backend Won't Start

```bash
# Check PostgreSQL
pg_isready

# Check Python version
python3 --version  # Should be 3.8+

# Check dependencies
cd backend
source venv/bin/activate
pip list

# Check database connection
psql conversation_copilot -c "SELECT 1;"
```

### If Frontend Won't Start

```bash
# Check Node version
node --version  # Should be 16+

# Check dependencies
cd frontend
npm list

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### If AI Responses Fail

```bash
# Check OpenRouter API key
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# Check logs
# Backend terminal should show error messages
```

### If Database Errors

```bash
# Reset database
psql postgres -c "DROP DATABASE conversation_copilot;"
psql postgres -c "CREATE DATABASE conversation_copilot;"

# Restart backend (tables will be recreated)
cd backend
python main.py
```

---

## Success Criteria

✅ **All tests should pass:**

- [ ] User can signup and login
- [ ] User can paste conversations
- [ ] AI classifies conversations correctly
- [ ] AI generates 3 different reply styles
- [ ] Replies are contextually appropriate
- [ ] Copy functionality works
- [ ] Authentication protects routes
- [ ] Database stores data correctly
- [ ] No errors in console
- [ ] Response times are acceptable (<15s)

---

## Reporting Issues

If you find bugs, report with:

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots
5. Console errors
6. Backend logs

---

Happy Testing! 🧪
