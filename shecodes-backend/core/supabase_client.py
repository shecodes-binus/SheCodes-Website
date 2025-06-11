# /shecodes-backend/core/supabase_client.py (New File)

from supabase import create_client, Client
from core.config import settings

supabase_client: Client | None = None

if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    try:
        supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"ERROR: Failed to initialize Supabase client: {e}")
else:
    print("WARNING: SUPABASE_URL and SUPABASE_SERVICE_KEY are not set. Supabase integration is disabled.")

def get_supabase_client() -> Client:
    """Dependency to get the Supabase client."""
    if supabase_client is None:
        raise RuntimeError("Supabase client has not been initialized. Check your .env file.")
    return supabase_client