from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class StageEnum(str, enum.Enum):
    COLD = "cold"
    WARM = "warm"
    FLIRTING = "flirting"
    RAPPORT = "rapport"
    INTIMATE = "intimate"
    DYING = "dying"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String)
    style_profile_json = Column(Text)  # JSON string of how this user talks
    profile_text = Column(Text)  # User's own bio/profile
    profile_analysis_json = Column(Text)  # AI analysis of user's profile
    credits = Column(Integer, default=10)  # Reply credits (10 free to start)
    stripe_customer_id = Column(String)  # Stripe customer ID
    created_at = Column(DateTime, default=datetime.utcnow)
    
    contacts = relationship("Contact", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    platform = Column(String)  # tinder, bumble, linkedin, whatsapp, twitter
    tone_profile_json = Column(Text)  # JSON string of how this person talks
    profile_text = Column(Text)  # Their bio/profile
    profile_analysis_json = Column(Text)  # AI analysis of their profile
    interest_score = Column(Float, default=0)  # -100 to +100
    stage = Column(String, default="cold")  # cold, warm, flirting, rapport, intimate, dying
    last_seen = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="contacts")
    conversations = relationship("Conversation", back_populates="contact", cascade="all, delete-orphan")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=False, index=True)
    platform = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="conversations")
    contact = relationship("Contact", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.timestamp")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False, index=True)
    sender = Column(String, nullable=False)  # "user" or "contact"
    text = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sentiment = Column(String)
    is_generated = Column(Boolean, default=False)  # Track if this was AI-generated
    
    conversation = relationship("Conversation", back_populates="messages")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Stripe fields
    stripe_payment_intent_id = Column(String, unique=True)
    stripe_session_id = Column(String, unique=True)
    
    # Razorpay fields
    razorpay_order_id = Column(String, unique=True)
    razorpay_payment_id = Column(String, unique=True)
    
    # Common fields
    amount = Column(Float)  # Amount in rupees/dollars
    currency = Column(String, default="INR")  # INR or USD
    credits_purchased = Column(Integer)
    product_type = Column(String)  # "small", "medium", "weekly"
    status = Column(String, default="pending")  # pending, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    user = relationship("User")
