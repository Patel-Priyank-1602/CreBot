"""
CreBot Backend — Embedding Service
Generates 384-dim vectors using sentence-transformers (all-MiniLM-L6-v2).
The model is loaded once on startup and kept in memory.
"""

from sentence_transformers import SentenceTransformer
from config import settings

# Load the model once — subsequent calls reuse the in-memory model
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    """Lazy-load the sentence-transformer model."""
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def embed_text(text: str) -> list[float]:
    """
    Convert a single text string into a 384-dimensional embedding vector.
    Returns a plain Python list of floats.
    """
    model = _get_model()
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Batch-embed multiple text strings.
    Returns a list of 384-dimensional vectors as Python lists.
    """
    model = _get_model()
    embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    return [e.tolist() for e in embeddings]
