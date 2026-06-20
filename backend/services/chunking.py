"""
CreBot Backend — Chunking Service
Splits raw FAQ text into retrievable chunks.
"""

import re


def chunk_faq_text(raw_text: str, max_chunk_size: int = 500) -> list[str]:
    """
    Split FAQ text into chunks suitable for embedding.

    Strategy:
    1. First try to split by Q&A pairs (lines starting with Q: / A: patterns).
    2. If no Q&A pattern is detected, split by double-newline paragraphs.
    3. If any resulting chunk exceeds max_chunk_size tokens (approx. by chars),
       further split it at sentence boundaries.

    Returns a list of non-empty text chunks.
    """
    raw_text = raw_text.strip()
    if not raw_text:
        return []

    # ── Attempt 1: Split by Q&A pairs ─────────────────────────────────────
    qa_pattern = re.compile(
        r"(?:^|\n)(?:Q[:.\s]|Question[:.\s]|\d+[.)]\s)",
        re.IGNORECASE,
    )
    qa_splits = qa_pattern.split(raw_text)
    qa_splits = [s.strip() for s in qa_splits if s.strip()]

    if len(qa_splits) >= 2:
        chunks = qa_splits
    else:
        # ── Attempt 2: Split by paragraph blocks ─────────────────────────
        chunks = [p.strip() for p in re.split(r"\n\s*\n", raw_text) if p.strip()]

    # ── Post-process: break any over-sized chunk at sentence boundaries ───
    final_chunks: list[str] = []
    for chunk in chunks:
        if len(chunk) <= max_chunk_size:
            final_chunks.append(chunk)
        else:
            sentences = re.split(r"(?<=[.!?])\s+", chunk)
            current = ""
            for sentence in sentences:
                if len(current) + len(sentence) + 1 > max_chunk_size and current:
                    final_chunks.append(current.strip())
                    current = sentence
                else:
                    current = f"{current} {sentence}".strip()
            if current:
                final_chunks.append(current.strip())

    return final_chunks
