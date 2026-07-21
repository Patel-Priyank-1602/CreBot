"""
CreBot Backend — Retrieval Service
Searches Supabase/pgvector for the most relevant FAQ/knowledge chunks.

Multi-stage retrieval strategy:
1. High-precision vector cosine similarity match (threshold ~0.15)
2. Low-threshold fallback (threshold 0.01) for broad/abstract queries (e.g. "what is this bot about?")
3. Direct chunk sample fallback if vector search returns no results but documents exist
"""

from __future__ import annotations

import logging
from config import settings
from services.embedding import embed_text
from utils.supabase_client import supabase

logger = logging.getLogger(__name__)


def retrieve_relevant_chunks(
    bot_id: str,
    question: str,
    top_k: int | None = None,
    threshold: float | None = None,
) -> list[dict]:
    """
    Embed the visitor's question, then run multi-stage similarity search
    against stored knowledge chunks for the given bot.
    """
    top_k = top_k if top_k is not None else settings.TOP_K_CHUNKS
    threshold = threshold if threshold is not None else settings.SIMILARITY_THRESHOLD

    question_vector = embed_text(question)
    chunks: list[dict] = []

    # 1. Primary Vector Similarity Search
    try:
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
    except Exception as e:
        logger.warning(f"Primary vector match failed: {e}")

    # 2. Low-threshold Fallback (helps for broad summary questions like "what is this bot about?")
    try:
        result = supabase.rpc(
            "match_documents",
            {
                "query_embedding": question_vector,
                "match_bot_id": bot_id,
                "match_count": top_k,
                "match_threshold": 0.01,
            },
        ).execute()

        if result.data:
            return [
                {"chunk_text": row["chunk_text"], "similarity": row["similarity"]}
                for row in result.data
            ]
    except Exception as e:
        logger.warning(f"Low-threshold vector match failed: {e}")

    # 3. Direct Sample Fallback (return top document chunks for bot if vector search yields nothing)
    try:
        doc_res = (
            supabase.table("documents")
            .select("chunk_text")
            .eq("bot_id", bot_id)
            .limit(top_k)
            .execute()
        )
        if doc_res.data:
            return [
                {"chunk_text": row["chunk_text"], "similarity": 0.05}
                for row in doc_res.data
            ]
    except Exception as e:
        logger.warning(f"Direct chunk fallback failed: {e}")

    return []
