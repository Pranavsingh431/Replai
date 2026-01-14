from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings
from supabase_client import get_supabase

# Legacy imports - no longer needed with Supabase
# from sqlalchemy.orm import Session
# from database import get_db
# from models import User

security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hashed password using bcrypt"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

class SupabaseUser:
    """Simple user class to maintain compatibility with existing endpoints"""
    def __init__(self, user_id: str, email: str, metadata: dict):
        self.id = user_id  # UUID string
        self.email = email
        self.user_metadata = metadata

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> SupabaseUser:
    """
    Validate Supabase JWT token and return user info.
    Returns a SupabaseUser object with .id property for compatibility.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        supabase = get_supabase()
        
        # Verify the token by getting the user
        response = supabase.auth.get_user(token)
        
        if not response or not response.user:
            raise credentials_exception
        
        user = response.user
        
        # Return user object with .id property
        return SupabaseUser(
            user_id=user.id,
            email=user.email,
            metadata=user.user_metadata or {}
        )
        
    except Exception as e:
        print(f"Auth error: {e}")
        raise credentials_exception
