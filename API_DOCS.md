# Conversation Copilot API Documentation

Base URL: `http://localhost:8000`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "display_name": "John Doe"  // optional
}
```

**Response:**
```json
{
  "access_token": "your_jwt_token_here...",
  "token_type": "bearer"
}
```

#### POST /login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "your_jwt_token_here...",
  "token_type": "bearer"
}
```

#### GET /me
Get current user information (requires authentication).

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "display_name": "John Doe",
  "created_at": "2024-01-15T10:30:00"
}
```

---

### Conversations

#### POST /conversation/paste
Paste and analyze a conversation. This endpoint:
1. Creates/updates a contact
2. Stores the conversation
3. Classifies conversation state
4. Updates memory profile

**Request Body:**
```json
{
  "contact_name": "Sarah",
  "platform": "tinder",
  "chat_text": "You: Hey! How's it going?\nThem: Pretty good! Just got back from hiking\nYou: Nice! Where did you go?"
}
```

**Response:**
```json
{
  "conversation_id": 123,
  "contact_id": 45,
  "message": "Conversation processed successfully",
  "classification": {
    "attraction_score": 65,
    "stage": "flirting",
    "dominant_tone": "playful",
    "ghosting_risk": "low"
  }
}
```

#### GET /conversations
Get all conversations for the current user.

**Response:**
```json
[
  {
    "id": 123,
    "contact_id": 45,
    "platform": "tinder",
    "created_at": "2024-01-15T10:30:00",
    "messages": [
      {
        "id": 1,
        "sender": "user",
        "text": "Hey! How's it going?",
        "timestamp": "2024-01-15T10:30:00",
        "sentiment": null
      }
    ]
  }
]
```

#### GET /conversation/{conversation_id}
Get a specific conversation.

**Response:**
```json
{
  "id": 123,
  "contact_id": 45,
  "platform": "tinder",
  "created_at": "2024-01-15T10:30:00",
  "messages": [...]
}
```

---

### AI Features

#### POST /generate-replies
Generate 3 reply options (Safe, Flirty, Bold) for a conversation.

**Request Body:**
```json
{
  "conversation_id": 123
}
```

**Response:**
```json
{
  "safe": "That sounds amazing! I'd love to hear more about it.",
  "flirty": "Hiking, huh? You must be pretty adventurous... I like that 😊",
  "bold": "Let's grab coffee this week and you can tell me all about it. When are you free?"
}
```

#### POST /classify/{conversation_id}
Manually trigger conversation classification.

**Response:**
```json
{
  "attraction_score": 65,
  "stage": "flirting",
  "dominant_tone": "playful",
  "ghosting_risk": "low"
}
```

---

### Contacts

#### GET /contacts
Get all contacts with their profiles.

**Response:**
```json
[
  {
    "id": 45,
    "name": "Sarah",
    "platform": "tinder",
    "interest_score": 65,
    "stage": "flirting",
    "tone_profile_json": "{\"emoji_usage\":\"high\",\"humor\":\"playful\"}",
    "last_seen": "2024-01-15T10:30:00"
  }
]
```

---

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "display_name": "John Doe",
  "style_profile_json": "{\"formality\":\"casual\"}",
  "created_at": "2024-01-15T10:30:00"
}
```

### Contact
```json
{
  "id": 45,
  "user_id": 1,
  "name": "Sarah",
  "platform": "tinder",
  "tone_profile_json": "{\"emoji_usage\":\"high\",\"humor\":\"playful\"}",
  "interest_score": 65,
  "stage": "flirting",
  "last_seen": "2024-01-15T10:30:00"
}
```

### Conversation
```json
{
  "id": 123,
  "user_id": 1,
  "contact_id": 45,
  "platform": "tinder",
  "created_at": "2024-01-15T10:30:00"
}
```

### Message
```json
{
  "id": 1,
  "conversation_id": 123,
  "sender": "user",  // or "contact"
  "text": "Hey! How's it going?",
  "timestamp": "2024-01-15T10:30:00",
  "sentiment": "positive"
}
```

---

## Conversation Stages

- **cold**: No connection, initial contact
- **warm**: Friendly, some rapport
- **flirting**: Playful, showing interest
- **rapport**: Good connection, comfortable
- **intimate**: Close, personal topics
- **dying**: Losing interest, fading

---

## Platform Options

- tinder
- bumble
- hinge
- linkedin
- twitter
- whatsapp
- instagram

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Conversation not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error generating replies: <error message>"
}
```

---

## Rate Limits

Currently no rate limits are enforced. In production, consider:
- 100 requests per hour per user
- 10 reply generations per hour for free tier
- Unlimited for paid users

---

## OpenRouter Integration

The system uses three specialized models:

1. **Classification** (`anthropic/claude-3.5-haiku`)
   - Fast and cheap
   - Analyzes attraction, stage, tone, ghosting risk
   - ~$0.001 per request

2. **Memory Updates** (`anthropic/claude-3.5-sonnet`)
   - Pattern recognition
   - Updates tone profiles
   - ~$0.003 per request

3. **Reply Generation** (`anthropic/claude-3.5-sonnet`)
   - Creative and emotionally intelligent
   - Generates 3 reply options
   - ~$0.015 per request

Total cost per conversation: ~$0.02

---

## Example Usage (cURL)

### Signup
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","display_name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Paste Conversation
```bash
curl -X POST http://localhost:8000/conversation/paste \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "contact_name": "Sarah",
    "platform": "tinder",
    "chat_text": "You: Hey!\nThem: Hi there!"
  }'
```

### Generate Replies
```bash
curl -X POST http://localhost:8000/generate-replies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"conversation_id": 1}'
```

---

## WebSocket Support (Future)

Real-time conversation analysis coming soon:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/conversation/123');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time analysis:', data);
};
```

---

## Testing

Use the interactive API docs at `http://localhost:8000/docs` (Swagger UI)

Or visit `http://localhost:8000/redoc` for ReDoc documentation.
