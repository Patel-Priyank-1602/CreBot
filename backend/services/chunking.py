"""
CreBot Backend — Chunking Service
Splits raw text into retrievable chunks with markdown-awareness and overlap.
"""

import re


def chunk_faq_text(raw_text: str, max_chunk_size: int = 800, overlap: int = 50) -> list[str]:
    """
    Split text into chunks suitable for embedding.
    1. Try markdown heading boundaries first.
    2. Try Q&A pairs.
    3. Fall back to paragraph splitting.
    4. Break oversized chunks at sentence boundaries with overlap.
    """
    raw_text = raw_text.strip()
    if not raw_text:
        return []

    chunks: list[str] = []

    # Attempt 1: Split by markdown headings
    heading_pattern = re.compile(r"(?:^|\n)(?=#{1,6}\s)", re.MULTILINE)
    heading_splits = heading_pattern.split(raw_text)
    heading_splits = [s.strip() for s in heading_splits if s.strip()]

    if len(heading_splits) >= 2:
        chunks = heading_splits
    else:
        # Attempt 2: Split by page separators (from PDF extraction)
        if "--- Page " in raw_text:
            page_splits = re.split(r"\n*---\s*Page\s+\d+\s*---\n*", raw_text)
            page_splits = [s.strip() for s in page_splits if s.strip()]
            if len(page_splits) >= 2:
                chunks = page_splits

    if not chunks:
        # Attempt 3: Split by Q&A pairs
        qa_pattern = re.compile(
            r"(?:^|\n)(?:Q[:.\s]|Question[:.\s]|\d+[.)]\s)",
            re.IGNORECASE,
        )
        qa_splits = qa_pattern.split(raw_text)
        qa_splits = [s.strip() for s in qa_splits if s.strip()]

        if len(qa_splits) >= 2:
            chunks = qa_splits
        else:
            # Attempt 4: Split by paragraph blocks
            chunks = [p.strip() for p in re.split(r"\n\s*\n", raw_text) if p.strip()]

    # Post-process: break oversized chunks at sentence boundaries with overlap
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
                    # Add overlap: keep last N chars from previous chunk
                    if overlap > 0:
                        overlap_text = current.strip()[-overlap:]
                        current = overlap_text + " " + sentence
                    else:
                        current = sentence
                else:
                    current = f"{current} {sentence}".strip()
            if current:
                final_chunks.append(current.strip())

    return final_chunks
