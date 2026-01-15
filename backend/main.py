from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import timedelta, datetime
import json

# Legacy database imports - no longer needed with Supabase
# from database import engine, get_db, Base
# from models import User, Contact, Conversation, Message, Payment

# Dummy imports for compatibility with legacy endpoints
# These endpoints will return errors if called, but won't crash on import
def get_db():
    """Dummy get_db for compatibility - should not be called"""
    raise HTTPException(status_code=501, detail="Legacy database endpoints not supported")

class Session:
    """Dummy Session class for compatibility"""
    pass

class User:
    """Dummy User class for compatibility"""
    pass
from schemas import (
    UserCreate, UserLogin, UserResponse, Token, UserProfileUpdate,
    ContactCreate, ContactUpdate, ContactResponse,
    ConversationCreate, ConversationResponse, ConversationWithContact,
    MessageCreate, MessageResponse,
    ReplyRequest, ReplyResponse, OutcomeTracking,
    ClassificationResult, ConversationPasteRequest, BulkConversationUpdate,
    CreditsResponse, ProfileAnalysisResponse,
    CreateCheckoutSession, CheckoutSessionResponse, PaymentResponse
)
from auth import (
    get_password_hash, verify_password, create_access_token, get_current_user
)
from openrouter_service import openrouter_service
from stripe_service import stripe_service
from razorpay_service import razorpay_service
from config import settings

# Legacy database setup - no longer needed with Supabase
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="Replai API", description="AI-powered conversation assistant")

# CORS middleware - must be configured before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://replai-sandy.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
def read_root():
    return {"message": "Replai API", "status": "running", "version": "2.0"}

# ============================================================================
# AUTHENTICATION
# ============================================================================

@app.post("/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account with 10 free credits"""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        display_name=user_data.display_name,
        credits=10  # 10 free credits for new users
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@app.get("/credits", response_model=CreditsResponse)
def get_credits(current_user: User = Depends(get_current_user)):
    """Get user's current credit balance"""
    return {"credits": current_user.credits}

# ============================================================================
# USER PROFILE
# ============================================================================

@app.put("/profile", response_model=UserResponse)
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's profile and analyze it with AI"""
    current_user.profile_text = profile_data.profile_text
    
    # Analyze profile with AI
    try:
        analysis = await openrouter_service.analyze_profile(profile_data.profile_text)
        current_user.profile_analysis_json = json.dumps(analysis)
    except Exception as e:
        print(f"Profile analysis error: {e}")
        # Continue even if analysis fails
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/profile/analysis", response_model=ProfileAnalysisResponse)
def get_profile_analysis(current_user: User = Depends(get_current_user)):
    """Get AI analysis of user's profile"""
    if not current_user.profile_analysis_json:
        raise HTTPException(status_code=404, detail="No profile analysis available")
    
    analysis = json.loads(current_user.profile_analysis_json)
    return analysis

# ============================================================================
# CONTACTS
# ============================================================================

@app.post("/contacts", response_model=ContactResponse)
async def create_contact(
    contact_data: ContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new contact"""
    # Check if contact already exists
    existing = db.query(Contact).filter(
        Contact.user_id == current_user.id,
        Contact.name == contact_data.name,
        Contact.platform == contact_data.platform
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact already exists"
        )
    
    contact = Contact(
        user_id=current_user.id,
        name=contact_data.name,
        platform=contact_data.platform,
        profile_text=contact_data.profile_text
    )
    
    # Analyze profile if provided
    if contact_data.profile_text:
        try:
            analysis = await openrouter_service.analyze_profile(contact_data.profile_text)
            contact.profile_analysis_json = json.dumps(analysis)
        except Exception as e:
            print(f"Profile analysis error: {e}")
    
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@app.get("/contacts", response_model=List[ContactResponse])
def get_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all contacts for current user"""
    contacts = db.query(Contact).filter(
        Contact.user_id == current_user.id
    ).order_by(desc(Contact.last_seen)).all()
    return contacts

@app.get("/contacts/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific contact"""
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return contact

@app.put("/contacts/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    contact_data: ContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a contact"""
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    if contact_data.name is not None:
        contact.name = contact_data.name
    if contact_data.platform is not None:
        contact.platform = contact_data.platform
    if contact_data.profile_text is not None:
        contact.profile_text = contact_data.profile_text
        # Re-analyze profile
        try:
            analysis = await openrouter_service.analyze_profile(contact_data.profile_text)
            contact.profile_analysis_json = json.dumps(analysis)
        except Exception as e:
            print(f"Profile analysis error: {e}")
    
    db.commit()
    db.refresh(contact)
    return contact

@app.delete("/contacts/{contact_id}")
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a contact and all associated conversations"""
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(contact)
    db.commit()
    return {"message": "Contact deleted successfully"}

# ============================================================================
# CONVERSATIONS & MESSAGES
# ============================================================================

@app.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    data: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new conversation with messages"""
    # Verify contact belongs to user
    contact = db.query(Contact).filter(
        Contact.id == data.contact_id,
        Contact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Create conversation
    conversation = Conversation(
        user_id=current_user.id,
        contact_id=data.contact_id,
        platform=contact.platform
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Add messages
    for msg_data in data.messages:
        message = Message(
            conversation_id=conversation.id,
            sender=msg_data.sender,
            text=msg_data.text
        )
        db.add(message)
    
    db.commit()
    
    # Get messages for response
    messages = db.query(Message).filter(
        Message.conversation_id == conversation.id
    ).order_by(Message.timestamp).all()
    
    # Build chat log for AI
    chat_log = "\n".join([f"{m.sender}: {m.text}" for m in messages])
    
    # Classify conversation
    try:
        classification = await openrouter_service.classify_conversation(chat_log)
        contact.interest_score = classification.get("attraction_score", 0)
        contact.stage = classification.get("stage", "warm")
        contact.last_seen = conversation.created_at
        
        # Update memory
        memory_update = await openrouter_service.update_memory(chat_log, contact.tone_profile_json)
        contact.tone_profile_json = json.dumps(memory_update)
        
        db.commit()
    except Exception as e:
        print(f"Error in classification: {e}")
    
    db.refresh(conversation)
    return conversation

@app.get("/conversations", response_model=List[ConversationWithContact])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for current user with contact info"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(desc(Conversation.updated_at)).all()
    
    result = []
    for conv in conversations:
        # Get last message
        last_message = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(desc(Message.timestamp)).first()
        
        # Get message count
        message_count = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).count()
        
        result.append({
            "id": conv.id,
            "contact": conv.contact,
            "platform": conv.platform,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
            "last_message": last_message,
            "message_count": message_count
        })
    
    return result

@app.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific conversation with all messages"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@app.get("/contacts/{contact_id}/conversations", response_model=List[ConversationResponse])
def get_contact_conversations(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for a specific contact"""
    # Verify contact belongs to user
    contact = db.query(Contact).filter(
        Contact.id == contact_id,
        Contact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    conversations = db.query(Conversation).filter(
        Conversation.contact_id == contact_id,
        Conversation.user_id == current_user.id
    ).order_by(desc(Conversation.created_at)).all()
    
    return conversations

@app.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def add_message(
    conversation_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a new message to a conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    message = Message(
        conversation_id=conversation_id,
        sender=message_data.sender,
        text=message_data.text
    )
    db.add(message)
    
    # Update conversation timestamp
    from datetime import datetime
    conversation.updated_at = datetime.utcnow()
    
    # Update contact last_seen
    contact = conversation.contact
    contact.last_seen = datetime.utcnow()
    
    db.commit()
    db.refresh(message)
    
    # Re-analyze conversation if needed
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).all()
    chat_log = "\n".join([f"{m.sender}: {m.text}" for m in messages])
    
    try:
        classification = await openrouter_service.classify_conversation(chat_log)
        contact.interest_score = classification.get("attraction_score", 0)
        contact.stage = classification.get("stage", "warm")
        
        memory_update = await openrouter_service.update_memory(chat_log, contact.tone_profile_json)
        contact.tone_profile_json = json.dumps(memory_update)
        
        db.commit()
    except Exception as e:
        print(f"Error in classification: {e}")
    
    return message

@app.post("/conversations/update")
async def bulk_update_conversation(
    data: BulkConversationUpdate,
    current_user = Depends(get_current_user)
):
    """
    OPTIMIZED: Parse and update conversation from bulk chat log
    Format: "You: ...\nThem: ...\nYou: ..."
    
    This endpoint:
    1. Parses the chat log into individual messages
    2. Creates or updates the conversation
    3. Runs ONE combined LLM call for classification + memory
    4. Returns the updated conversation
    """
    from supabase_client import get_supabase
    supabase = get_supabase()
    
    # Verify contact belongs to user
    contact_response = supabase.table('contacts').select('*').eq('id', data.contact_id).eq('user_id', current_user.id).execute()
    
    if not contact_response.data or len(contact_response.data) == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact = contact_response.data[0]
    
    # Parse chat log into messages
    lines = data.chat_log.strip().split('\n')
    parsed_messages = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Try to parse "You: ..." or "Them: ..." format
        if line.lower().startswith('you:'):
            sender = 'user'
            text = line[4:].strip()
        elif line.lower().startswith('them:'):
            sender = 'contact'
            text = line[5:].strip()
        elif ':' in line:
            # Try to detect sender from first word
            parts = line.split(':', 1)
            sender_name = parts[0].strip().lower()
            text = parts[1].strip()
            
            if sender_name in ['you', 'me', 'user']:
                sender = 'user'
            else:
                sender = 'contact'
        else:
            # Skip lines without clear sender
            continue
        
        if text:
            parsed_messages.append({'sender': sender, 'content': text})
    
    if not parsed_messages:
        raise HTTPException(status_code=400, detail="No valid messages found in chat log")
    
    # Find or create conversation
    conv_response = supabase.table('conversations').select('*').eq('contact_id', data.contact_id).order('last_updated', desc=True).limit(1).execute()
    
    if conv_response.data and len(conv_response.data) > 0:
        conversation = conv_response.data[0]
        conversation_id = conversation['id']
        
        # Delete existing messages
        supabase.table('messages').delete().eq('conversation_id', conversation_id).execute()
    else:
        # Create new conversation
        new_conv = {
            'contact_id': data.contact_id,
            'raw_chat_log': data.chat_log,
            'attraction_score': 0,
            'stage': 'initial',
            'dominant_tone': 'neutral',
            'ghosting_risk': 'low',
            'last_updated': datetime.utcnow().isoformat()
        }
        conv_insert = supabase.table('conversations').insert(new_conv).execute()
        conversation = conv_insert.data[0]
        conversation_id = conversation['id']
    
    # Add messages
    for msg_data in parsed_messages:
        msg_data['conversation_id'] = conversation_id
        msg_data['timestamp'] = datetime.utcnow().isoformat()
    
    if parsed_messages:
        supabase.table('messages').insert(parsed_messages).execute()
    
    # Update conversation raw_chat_log and last_updated
    supabase.table('conversations').update({
        'raw_chat_log': data.chat_log,
        'last_updated': datetime.utcnow().isoformat()
    }).eq('id', conversation_id).execute()
    
    # OPTIMIZED: Run ONE combined LLM call for classification + memory
    try:
        result = await openrouter_service.analyze_conversation_state(
            data.chat_log,
            contact.get('tone_profile_json')
        )
        
        # Update classification
        classification = result.get('classification', {})
        
        # Update contact with interest score and stage
        contact_updates = {
            'interest_score': classification.get('attraction_score', 0),
            'stage': classification.get('stage', 'initial')
        }
        
        # Update memory
        memory = result.get('memory', {})
        contact_updates['tone_profile_json'] = json.dumps(memory)
        
        supabase.table('contacts').update(contact_updates).eq('id', data.contact_id).execute()
        
        # Update conversation with classification results
        conversation_updates = {
            'attraction_score': classification.get('attraction_score', 0),
            'stage': classification.get('stage', 'initial'),
            'dominant_tone': classification.get('dominant_tone', 'neutral'),
            'ghosting_risk': classification.get('ghosting_risk', 'low')
        }
        
        supabase.table('conversations').update(conversation_updates).eq('id', conversation_id).execute()
    except Exception as e:
        print(f"Error in conversation analysis: {e}")
        # Don't fail the request if AI analysis fails
    
    # Return updated conversation
    final_conv = supabase.table('conversations').select('*').eq('id', conversation_id).execute()
    return final_conv.data[0]

# ============================================================================
# AI FEATURES
# ============================================================================

@app.post("/generate-replies")
async def generate_replies(
    data: ReplyRequest,
    current_user = Depends(get_current_user)
):
    """Generate 3 reply options (costs 1 credit)"""
    from supabase_client import get_supabase
    supabase = get_supabase()
    
    # Get user from Supabase
    user_response = supabase.table('users').select('*').eq('id', current_user.id).single().execute()
    
    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_response.data
    
    # Check credits
    if user_data.get('credits', 0) < 1:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Insufficient credits. Please purchase more credits."
        )
    
    # Get conversation with messages
    conversation_response = supabase.table('conversations').select('*, messages(*)').eq('id', data.conversation_id).single().execute()
    
    if not conversation_response.data:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation = conversation_response.data
    messages = conversation.get('messages', [])
    
    if not messages:
        raise HTTPException(status_code=400, detail="No messages in conversation")
    
    # Build chat log
    chat_log = "\n".join([f"{'You' if m['sender'] == 'user' else 'Them'}: {m['content']}" for m in messages])
    
    # Get contact info
    contact_response = supabase.table('contacts').select('*').eq('id', conversation['contact_id']).single().execute()
    
    if not contact_response.data:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    contact = contact_response.data
    
    # Get profile analyses
    user_profile = user_data.get('profile_analysis_json')
    contact_profile = contact.get('profile_analysis_json')
    
    # DECISION LOGIC: Determine if we should recommend "no reply"
    stage = contact.get('stage', 'initial')
    interest_score = int(contact.get('interest_score', 0)) if contact.get('interest_score') else 0
    
    # Convert ghosting_risk to integer (it might be stored as string or text like "low"/"medium"/"high")
    ghosting_risk_raw = conversation.get('ghosting_risk', 0)
    if isinstance(ghosting_risk_raw, str):
        # If it's a text value, convert to numeric
        ghosting_risk_map = {'low': 20, 'medium': 50, 'high': 80, 'very_high': 90}
        ghosting_risk = ghosting_risk_map.get(ghosting_risk_raw.lower(), 0)
    else:
        ghosting_risk = int(ghosting_risk_raw) if ghosting_risk_raw else 0
    
    # Check last few messages for disengagement
    recent_messages = messages[-3:] if len(messages) >= 3 else messages
    their_messages = [m for m in recent_messages if m['sender'] != 'user']
    disengaged = len(their_messages) > 0 and all(len(m.get('content', '')) < 15 for m in their_messages)
    
    # Determine recommendation
    recommendation = None
    no_reply_reason = None
    
    # Log decision inputs for debugging
    print(f"DECISION ENGINE - Stage: {stage}, Interest: {interest_score}, Ghosting Risk: {ghosting_risk}, Disengaged: {disengaged}")
    
    # NO REPLY state: very high risk
    if ghosting_risk >= 80 and interest_score < 30 and disengaged:
        recommendation = "no_reply"
        no_reply_reason = "No reply recommended right now. Sending nothing preserves your position better than forcing a message."
        print(f"DECISION: NO_REPLY (ghosting_risk={ghosting_risk}, interest={interest_score}, disengaged={disengaged})")
    # SAFE highlight: high risk or dying stage
    elif ghosting_risk >= 60 or stage in ['dying', 'cold']:
        recommendation = "safe"
        print(f"DECISION: SAFE (ghosting_risk={ghosting_risk}, stage={stage})")
    else:
        print(f"DECISION: None (normal conversation)")
    
    # Generate replies
    try:
        replies = await openrouter_service.generate_replies(
            chat_log=chat_log,
            user_style=user_data.get('style_profile_json'),
            contact_tone=contact.get('tone_profile_json'),
            user_profile=user_profile,
            contact_profile=contact_profile,
            stage=stage,
            attraction_score=interest_score
        )
        
        # Deduct credit
        supabase.table('users').update({'credits': user_data['credits'] - 1}).eq('id', current_user.id).execute()
        
        return {
            "safe": replies.get("safe", "Hey! How's it going?"),
            "flirty": replies.get("flirty", "You're pretty interesting... tell me more"),
            "bold": replies.get("bold", "Let's grab coffee this week. When are you free?"),
            "credits_remaining": user_data['credits'] - 1,
            "recommendation": recommendation,
            "no_reply_reason": no_reply_reason
        }
    except Exception as e:
        print(f"Error generating replies: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating replies: {str(e)}")

@app.post("/track-outcome")
async def track_outcome(
    data: OutcomeTracking,
    current_user = Depends(get_current_user)
):
    """Track the outcome of a reply decision (for future recommendation improvements)"""
    from supabase_client import get_supabase
    supabase = get_supabase()
    
    try:
        # Store outcome in Supabase (anonymously, for system learning)
        # This is a simple table that tracks patterns for future improvements
        outcome_data = {
            'conversation_id': data.conversation_id,
            'user_id': current_user.id,
            'reply_type': data.reply_type,
            'outcome': data.outcome,
            'tracked_at': datetime.utcnow().isoformat()
        }
        
        # Note: You'll need to create an 'outcomes' table in Supabase
        # For now, we'll just log it (you can add the table later if needed)
        print(f"Outcome tracked: {outcome_data}")
        
        return {"status": "tracked", "message": "Thank you for the feedback"}
    except Exception as e:
        print(f"Error tracking outcome: {e}")
        # Don't fail if tracking fails - it's optional
        return {"status": "error", "message": "Tracking failed but that's okay"}

@app.post("/classify/{conversation_id}", response_model=ClassificationResult)
async def classify_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually trigger conversation classification"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(Message.conversation_id == conversation.id).all()
    chat_log = "\n".join([f"{m.sender}: {m.text}" for m in messages])
    
    try:
        classification = await openrouter_service.classify_conversation(chat_log)
        
        # Update contact
        contact = conversation.contact
        contact.interest_score = classification.get("attraction_score", 0)
        contact.stage = classification.get("stage", "warm")
        db.commit()
        
        return ClassificationResult(
            attraction_score=classification.get("attraction_score", 0),
            stage=classification.get("stage", "warm"),
            dominant_tone=classification.get("dominant_tone", "neutral"),
            ghosting_risk=classification.get("ghosting_risk", "medium")
        )
    except Exception as e:
        print(f"Error in classification: {e}")
        raise HTTPException(status_code=500, detail=f"Error in classification: {str(e)}")

# ============================================================================
# PAYMENTS & STRIPE
# ============================================================================

@app.post("/checkout/create-session", response_model=CheckoutSessionResponse)
def create_checkout_session(
    data: CreateCheckoutSession,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Stripe checkout session for purchasing credits"""
    try:
        # Validate product type
        product_info = stripe_service.get_product_info(data.product_type)
        if not product_info:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid product type: {data.product_type}"
            )
        
        # Create checkout session
        session = stripe_service.create_checkout_session(
            user_id=current_user.id,
            user_email=current_user.email,
            product_type=data.product_type,
            success_url="http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000/payment/cancel"
        )
        
        # Create payment record
        payment = Payment(
            user_id=current_user.id,
            stripe_session_id=session['session_id'],
            amount=product_info['amount'],
            currency=product_info['currency'],
            credits_purchased=product_info['credits'],
            product_type=data.product_type,
            status="pending"
        )
        db.add(payment)
        db.commit()
        
        return CheckoutSessionResponse(
            checkout_url=session['checkout_url'],
            session_id=session['session_id']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/webhook/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing signature")
    
    try:
        # Verify webhook signature
        event = stripe_service.construct_webhook_event(payload, sig_header)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Get payment record
        payment = db.query(Payment).filter(
            Payment.stripe_session_id == session['id']
        ).first()
        
        if payment:
            # Update payment status
            payment.status = "completed"
            payment.completed_at = datetime.utcnow()
            payment.stripe_payment_intent_id = session.get('payment_intent')
            
            # Add credits to user
            user = db.query(User).filter(User.id == payment.user_id).first()
            if user:
                user.credits += payment.credits_purchased
                
                # Update Stripe customer ID if not set
                if not user.stripe_customer_id and session.get('customer'):
                    user.stripe_customer_id = session['customer']
            
            db.commit()
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        
        # Find and update payment record
        payment = db.query(Payment).filter(
            Payment.stripe_payment_intent_id == payment_intent['id']
        ).first()
        
        if payment:
            payment.status = "failed"
            db.commit()
    
    return {"status": "success"}

@app.get("/payments", response_model=List[PaymentResponse])
def get_payment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's payment history"""
    payments = db.query(Payment).filter(
        Payment.user_id == current_user.id
    ).order_by(desc(Payment.created_at)).all()
    
    return payments

@app.get("/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific payment"""
    payment = db.query(Payment).filter(
        Payment.id == payment_id,
        Payment.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return payment

@app.get("/products")
def get_products():
    """Get available products for purchase (Stripe and Razorpay)"""
    from stripe_service import PRODUCTS as STRIPE_PRODUCTS
    
    # Get Razorpay pricing
    razorpay_pricing = razorpay_service.get_pricing()
    
    return {
        "stripe_products": [
            {
                "id": key,
                "name": value["name"],
                "description": value["description"],
                "credits": value["credits"],
                "amount": value["amount"],
                "currency": value["currency"],
                "price_display": f"${value['amount'] / 100:.2f}"
            }
            for key, value in STRIPE_PRODUCTS.items()
        ],
        "razorpay_products": [
            {
                "id": key,
                "name": value["name"],
                "description": value["description"],
                "credits": value["credits"],
                "amount": value["amount"],
                "currency": "INR",
                "price_display": f"₹{value['amount_inr']:.0f}"
            }
            for key, value in razorpay_pricing.items()
        ]
    }

# ============================================================================
# RAZORPAY PAYMENTS
# ============================================================================

@app.post("/razorpay/create-order")
async def create_razorpay_order(
    plan: str = Query(..., description="Plan type: small, medium, or weekly"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Razorpay order"""
    try:
        # Create order with Razorpay
        order_data = razorpay_service.create_order(plan, current_user.id)
        
        # Create payment record
        payment = Payment(
            user_id=current_user.id,
            amount=order_data["amount"] / 100,  # Convert paise to rupees
            currency="INR",
            status="pending",
            credits_purchased=order_data["credits"],
            product_type=plan,
            razorpay_order_id=order_data["order_id"]
        )
        db.add(payment)
        db.commit()
        db.refresh(payment)
        
        return {
            "order_id": order_data["order_id"],
            "amount": order_data["amount"],
            "currency": order_data["currency"],
            "key_id": settings.RAZORPAY_KEY_ID,
            "name": order_data["name"],
            "description": order_data["description"],
            "payment_id": payment.id
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@app.post("/razorpay/verify-payment")
async def verify_razorpay_payment(
    order_id: str,
    payment_id: str,
    signature: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify Razorpay payment and credit user"""
    # Verify signature
    if not razorpay_service.verify_payment_signature(order_id, payment_id, signature):
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    
    # Find payment record
    payment = db.query(Payment).filter(
        Payment.razorpay_order_id == order_id,
        Payment.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment.status == "completed":
        return {"status": "already_processed", "credits": current_user.credits}
    
    # Update payment
    payment.status = "completed"
    payment.completed_at = datetime.utcnow()
    payment.razorpay_payment_id = payment_id
    
    # Add credits to user
    current_user.credits += payment.credits_purchased
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "status": "success",
        "credits": current_user.credits,
        "credits_added": payment.credits_purchased
    }

@app.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Razorpay webhook events"""
    payload = await request.body()
    sig_header = request.headers.get('x-razorpay-signature')
    
    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing signature")
    
    # Verify webhook signature
    if not razorpay_service.verify_webhook_signature(payload, sig_header):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    try:
        event = json.loads(payload)
        event_type = event.get('event')
        
        if event_type == 'payment.captured':
            # Payment successful
            payment_entity = event['payload']['payment']['entity']
            order_id = payment_entity.get('order_id')
            payment_id = payment_entity.get('id')
            
            # Find payment record
            payment = db.query(Payment).filter(
                Payment.razorpay_order_id == order_id
            ).first()
            
            if payment and payment.status == "pending":
                payment.status = "completed"
                payment.completed_at = datetime.utcnow()
                payment.razorpay_payment_id = payment_id
                
                # Add credits to user
                user = db.query(User).filter(User.id == payment.user_id).first()
                if user:
                    user.credits += payment.credits_purchased
                
                db.commit()
        
        elif event_type == 'payment.failed':
            # Payment failed
            payment_entity = event['payload']['payment']['entity']
            order_id = payment_entity.get('order_id')
            
            # Find and update payment record
            payment = db.query(Payment).filter(
                Payment.razorpay_order_id == order_id
            ).first()
            
            if payment:
                payment.status = "failed"
                db.commit()
        
        return {"status": "success"}
    except Exception as e:
        print(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# LEGACY SUPPORT (for backward compatibility)
# ============================================================================

@app.post("/conversation/paste")
async def paste_conversation(
    data: ConversationPasteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Legacy endpoint: Paste conversation (auto-creates contact if needed)"""
    # Get or create contact
    contact = db.query(Contact).filter(
        Contact.id == data.contact_id,
        Contact.user_id == current_user.id
    ).first()
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Create conversation
    conversation = Conversation(
        user_id=current_user.id,
        contact_id=data.contact_id,
        platform=contact.platform
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    # Parse messages from chat_text
    lines = data.chat_text.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        sender = "contact"
        text = line
        
        if line.lower().startswith("you:") or line.lower().startswith("me:"):
            sender = "user"
            text = line.split(":", 1)[1].strip()
        elif line.lower().startswith("them:") or line.lower().startswith(contact.name.lower() + ":"):
            sender = "contact"
            text = line.split(":", 1)[1].strip()
        elif ":" in line:
            prefix = line.split(":", 1)[0].lower()
            if "you" in prefix or "me" in prefix:
                sender = "user"
                text = line.split(":", 1)[1].strip()
            else:
                sender = "contact"
                text = line.split(":", 1)[1].strip()
        
        message = Message(
            conversation_id=conversation.id,
            sender=sender,
            text=text
        )
        db.add(message)
    
    db.commit()
    
    # Get full chat log for AI processing
    messages = db.query(Message).filter(Message.conversation_id == conversation.id).all()
    chat_log = "\n".join([f"{m.sender}: {m.text}" for m in messages])
    
    # Classify conversation
    try:
        classification = await openrouter_service.classify_conversation(chat_log)
        contact.interest_score = classification.get("attraction_score", 0)
        contact.stage = classification.get("stage", "warm")
        
        memory_update = await openrouter_service.update_memory(chat_log, contact.tone_profile_json)
        contact.tone_profile_json = json.dumps(memory_update)
        
        db.commit()
        db.refresh(contact)
        
    except Exception as e:
        print(f"Error in AI processing: {e}")
    
    return {
        "conversation_id": conversation.id,
        "contact_id": contact.id,
        "message": "Conversation processed successfully",
        "classification": classification if 'classification' in locals() else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
