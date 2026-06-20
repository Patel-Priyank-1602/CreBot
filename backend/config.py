"""
CreBot Backend — Configuration
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # HuggingFace API (free, for embeddings)
    HF_API_TOKEN: str = os.getenv("HF_API_TOKEN", "")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

    # Retrieval
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.20"))
    TOP_K_CHUNKS: int = int(os.getenv("TOP_K_CHUNKS", "8"))

    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Rate limiting
    RATE_LIMIT: str = os.getenv("RATE_LIMIT", "30/minute")


settings = Settings()
