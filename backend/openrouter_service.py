import httpx
import json
from typing import Dict, Any, List
from config import settings

class OpenRouterService:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://replai.app",
            "X-Title": "Replai"
        }
    
    async def analyze_conversation_state(self, chat_log: str, current_profile: str = None) -> Dict[str, Any]:
        """
        OPTIMIZED: Combines classification and memory update in ONE LLM call
        Uses Claude Haiku for speed and cost efficiency
        Returns: {classification: {...}, memory: {...}}
        """
        current_info = f"\nCurrent tone profile: {current_profile}" if current_profile else ""
        
        prompt = f"""You are an expert in social dynamics and communication analysis.

Analyze this conversation and return TWO things in ONE JSON response:

1. CLASSIFICATION - The relationship state:
   - attraction_score: number from -100 to 100
   - stage: one of "cold", "warm", "flirting", "rapport", "intimate", "dying"
   - dominant_tone: describe the tone (e.g., "playful", "formal", "dry", "teasing", "romantic")
   - ghosting_risk: one of "low", "medium", "high"

2. MEMORY - The contact's communication profile:
   - emoji_usage: "none", "low", "medium", or "high"
   - humor: describe their humor style (e.g., "sarcastic", "playful", "dry", "wholesome", "none")
   - formality: "very_formal", "formal", "casual", "very_casual"
   - response_speed: "very_slow", "slow", "medium", "fast", "very_fast"
   - topics_that_work: array of topics they engaged with positively
   - topics_that_failed: array of topics they ignored or responded negatively to
   - communication_patterns: brief description of their texting style
{current_info}

Conversation:
{chat_log}

Return ONLY this JSON structure:
{{
  "classification": {{
    "attraction_score": 0,
    "stage": "warm",
    "dominant_tone": "...",
    "ghosting_risk": "low"
  }},
  "memory": {{
    "emoji_usage": "medium",
    "humor": "...",
    "formality": "casual",
    "response_speed": "medium",
    "topics_that_work": [],
    "topics_that_failed": [],
    "communication_patterns": "..."
  }}
}}

No other text."""

        payload = {
            "model": "anthropic/claude-3.5-haiku",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.base_url, headers=self.headers, json=payload)
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                return json.loads(content)
    
    async def analyze_profile(self, profile_text: str) -> Dict[str, Any]:
        """
        Analyze a user or contact profile using Claude Sonnet
        Returns: personality, interests, communication_style, intent
        """
        prompt = f"""You are an expert in personality and communication analysis.

Analyze this profile/bio and extract key information about the person.

Return ONLY a valid JSON object with these exact fields:
- personality: brief description of their personality traits
- interests: array of their main interests/hobbies
- communication_style: how they communicate (formal, casual, playful, etc.)
- intent: what they're looking for (dating, networking, friendship, etc.)

Profile:
{profile_text}

Return only the JSON object, no other text."""

        payload = {
            "model": "anthropic/claude-3.5-sonnet",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.4
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.base_url, headers=self.headers, json=payload)
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                return json.loads(content)
    
    async def generate_replies(
        self,
        chat_log: str,
        user_style: str = None,
        contact_tone: str = None,
        user_profile: str = None,
        contact_profile: str = None,
        stage: str = "warm",
        attraction_score: float = 0
    ) -> Dict[str, str]:
        """
        Generate 3 replies: Safe, Flirty, Bold using Claude Sonnet
        Now considers user and contact profiles for highly personalized replies
        """
        user_info = f"\nUser's communication style: {user_style}" if user_style else ""
        contact_info = f"\nOther person's tone profile: {contact_tone}" if contact_tone else ""
        user_profile_info = f"\nUser's profile/personality: {user_profile}" if user_profile else ""
        contact_profile_info = f"\nOther person's profile/personality: {contact_profile}" if contact_profile else ""
        
        prompt = f"""You are generating a message on behalf of a real human in an active 1-to-1 conversation.

Your job is to protect the user's dignity, increase attraction when possible, and avoid mistakes.
This is high-stakes. One bad message can end the conversation.

Context:
- Relationship stage: {stage}
- Attraction score: {attraction_score}/100
{user_info}
{contact_info}
{user_profile_info}
{contact_profile_info}

Conversation:
{chat_log}

CORE PRINCIPLES:

1) DIGNITY ABOVE ALL
Never generate a message that:
- apologizes for existing
- frames the user as a nuisance
- asks permission to talk
- sounds needy or insecure

BANNED PHRASES:
- "I'll stop bugging you"
- "sorry to bother"
- "if you want to talk"
- "no worries if not"
- "just checking"

If a reply reduces the user's perceived value, discard it.

2) MATCH ENERGY, DO NOT CHASE
Your reply must MATCH the other person's energy, not exceed it.
- High energy → playful / warm
- Medium energy → grounded / curious
- Low energy → calm / non-demanding
- Fading energy → reframe or disengage gracefully

Never escalate when interest is low.

3) ESCALATION RULES (CRITICAL)
Escalation is allowed ONLY when:
- Interest is medium or high
- Responses are engaged
- The other person is contributing

If interest is LOW or ghosting risk is HIGH:
- DO NOT suggest dates
- DO NOT suggest meeting
- DO NOT suggest plans

Bold ≠ escalation.
Bold = clarity, honesty, or frame shift.

4) HUMAN LANGUAGE ONLY
Messages must sound:
- typed, not crafted
- natural, not clever
- spontaneous, not polished

Rules:
- 1–2 sentences max
- Slight imperfection is good
- Ellipses are allowed
- Emojis only if already used
- No poetic language
- No therapist tone

5) SITUATIONAL SPECIFICITY
Always ground the message in:
- something already said
- a shared detail
- the current emotional moment

Bad: "We should grab coffee sometime"
Good: "There's a café near where you mentioned that's quiet on weekday mornings"

6) FAILURE-STATE BEHAVIOR
When conversation is dying or ghosting risk is high:
- Goal is NOT to save the conversation at all costs
- Goal is to preserve dignity and leave a positive impression
- Graceful disengagement is a success

THREE RESPONSE TYPES:

SAFE:
- Low risk
- Preserves dignity
- Keeps door open without pressure

FLIRTY:
- Light reframe
- Playful but restrained
- Never needy
- Never sexual

BOLD:
- Honest
- Direct
- Frame-shifting
- NEVER logistical unless interest is clearly high

FINAL CHECK (MANDATORY):
1) Would a confident but slightly nervous human send this?
2) Does this preserve the user's perceived value?
3) Does this match the current energy level?

If any answer is NO → rewrite.

Return ONLY a valid JSON object:
{{
  "safe": "the safe reply text",
  "flirty": "the flirty reply text",
  "bold": "the bold reply text"
}}

No other text, just the JSON."""

        payload = {
            "model": "anthropic/claude-3.5-sonnet",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.base_url, headers=self.headers, json=payload)
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                return json.loads(content)

openrouter_service = OpenRouterService()
