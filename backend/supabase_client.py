"""Supabase client for backend (using service role key)"""
from supabase import create_client, Client
from config import settings

# Initialize Supabase client with service role key (for admin operations)
supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_ROLE_KEY
)

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase
