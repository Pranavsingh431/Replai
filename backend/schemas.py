from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    display_name: Optional[str]
    credits: int
    profile_text: Optional[str]
    profile_analysis_json: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfileUpdate(BaseModel):
    profile_text: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Contact schemas
class ContactCreate(BaseModel):
    name: str
    platform: str
    profile_text: Optional[str] = None

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    platform: Optional[str] = None
    profile_text: Optional[str] = None

class BulkConversationUpdate(BaseModel):
    """Parse and update conversation from bulk chat log"""
    contact_id: int
    chat_log: str  # Format: "You: ...\nThem: ...\nYou: ..."

class ContactResponse(BaseModel):
    id: int
    name: str
    platform: str
    interest_score: float
    stage: str
    tone_profile_json: Optional[str]
    profile_text: Optional[str]
    profile_analysis_json: Optional[str]
    last_seen: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Message schemas
class MessageCreate(BaseModel):
    sender: str  # "user" or "contact"
    text: str

class MessageResponse(BaseModel):
    id: int
    sender: str
    text: str
    timestamp: datetime
    sentiment: Optional[str]
    is_generated: bool
    
    class Config:
        from_attributes = True

# Conversation schemas
class ConversationCreate(BaseModel):
    contact_id: int
    messages: List[MessageCreate]

class ConversationResponse(BaseModel):
    id: int
    contact_id: int
    platform: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse]
    
    class Config:
        from_attributes = True

class ConversationWithContact(BaseModel):
    id: int
    contact: ContactResponse
    platform: str
    created_at: datetime
    updated_at: datetime
    last_message: Optional[MessageResponse]
    message_count: int
    
    class Config:
        from_attributes = True

# Classification schemas
class ClassificationResult(BaseModel):
    attraction_score: float
    stage: str
    dominant_tone: str
    ghosting_risk: str

# Reply generation schemas
class ReplyRequest(BaseModel):
    conversation_id: int

class ReplyResponse(BaseModel):
    safe: str
    flirty: str
    bold: str
    credits_remaining: int
    recommendation: Optional[str] = None  # "safe", "flirty", "bold", or "no_reply"
    no_reply_reason: Optional[str] = None  # Explanation when no_reply is recommended

class OutcomeTracking(BaseModel):
    conversation_id: int
    reply_type: str  # "safe", "flirty", "bold", or "no_reply"
    outcome: str  # "continued", "revived", "no_response", "ended"

# Conversation paste (legacy support)
class ConversationPasteRequest(BaseModel):
    contact_id: int
    chat_text: str  # Raw pasted conversation

# Stripe/Payment schemas
class CreateCheckoutSession(BaseModel):
    product_type: str  # "20_credits", "100_credits", "unlimited_7d"

class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str

class PaymentResponse(BaseModel):
    id: int
    amount: int
    currency: str
    credits_purchased: int
    product_type: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Credits
class CreditsResponse(BaseModel):
    credits: int
    
# Profile analysis
class ProfileAnalysisResponse(BaseModel):
    personality: Optional[str]
    interests: List[str]
    communication_style: Optional[str]
    intent: Optional[str]
