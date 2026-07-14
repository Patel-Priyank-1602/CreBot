"""
CreBot Backend — Supabase Client
Initializes the Supabase client for use across the application.
"""

from supabase import Client, create_client

from config import settings

supabase: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_SERVICE_KEY,
)
