"""
CreBot Backend — Embedding Service
Uses fastembed (ONNX Runtime) to generate embeddings locally.
No PyTorch, no API calls, no internet needed after first model download.
"""

from fastembed import TextEmbedding

_model: TextEmbedding | None = None


def _get_model() -> TextEmbedding:
    """Lazy-load the embedding model (downloads ~50MB on first run)."""
    global _model
    if _model is None:
        _model = TextEmbedding("BAAI/bge-small-en-v1.5")
    return _model


def embed_text(text: str) -> list[float]:
    """Convert a single text string into a 384-dim embedding vector."""
    model = _get_model()
    embeddings = list(model.embed([text]))
    return embeddings[0].tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Batch-embed multiple text strings."""
    model = _get_model()
    embeddings = list(model.embed(texts))
    return [e.tolist() for e in embeddings]
