"""
CreBot Backend — Configuration
Loads environment variables and exposes them as typed settings.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application-wide settings sourced from environment variables."""

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # HuggingFace embedding model (loaded locally)
    EMBEDDING_MODEL: str = os.getenv(
        "EMBEDDING_MODEL", "all-MiniLM-L6-v2"
    )

    # Retrieval settings
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.35"))
    TOP_K_CHUNKS: int = int(os.getenv("TOP_K_CHUNKS", "5"))

    # CORS — dashboard origin(s)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Rate limiting
    RATE_LIMIT: str = os.getenv("RATE_LIMIT", "30/minute")


settings = Settings()
