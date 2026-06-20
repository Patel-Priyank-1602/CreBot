"""
CreBot Backend — Retrieval Service
Searches Supabase/pgvector for the most relevant FAQ chunks.
"""

from utils.supabase_client import supabase
from services.embedding import embed_text
from config import settings


def retrieve_relevant_chunks(
    bot_id: str,
    question: str,
    top_k: int | None = None,
    threshold: float | None = None,
) -> list[dict]:
    """
    Embed the visitor's question, then run a cosine-similarity search
    against the stored FAQ chunks for the given bot.

    Returns a list of dicts: [{"chunk_text": str, "similarity": float}, ...]
    sorted by similarity descending.  Empty list if nothing passes threshold.
    """
    top_k = top_k or settings.TOP_K_CHUNKS
    threshold = threshold or settings.SIMILARITY_THRESHOLD

    # 1. Embed the question
    question_vector = embed_text(question)

    # 2. Call the Supabase RPC function for similarity search
    result = supabase.rpc(
        "match_documents",
        {
            "query_embedding": question_vector,
            "match_bot_id": bot_id,
            "match_count": top_k,
            "match_threshold": threshold,
        },
    ).execute()

    if result.data:
        return [
            {"chunk_text": row["chunk_text"], "similarity": row["similarity"]}
            for row in result.data
        ]

    return []
