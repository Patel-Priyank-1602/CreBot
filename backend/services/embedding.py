"""
CreBot Backend — Embedding Service
Uses fastembed (ONNX Runtime) to generate embeddings locally.
No PyTorch, no API calls, no internet needed after first model download.

Memory-optimized for low-RAM environments (Render Free/Starter 512MB).
"""

from __future__ import annotations

import gc
import os

# ── Lock down ONNX Runtime threads BEFORE any import ──────────────
# These MUST be set before fastembed / onnxruntime initializes.
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")

# pyrefly: ignore [missing-import]
from fastembed import TextEmbedding

_model: TextEmbedding | None = None

# Small batch size to cap peak memory during embedding.
# Default fastembed batch_size=256 creates huge numpy arrays — OOM on 512MB.
_BATCH_SIZE = 16


def _get_model() -> TextEmbedding:
    """Lazy-load the embedding model (downloads ~50MB on first run)."""
    global _model
    if _model is None:
        _model = TextEmbedding("BAAI/bge-small-en-v1.5", threads=1)
    return _model


def embed_text(text: str) -> list[float]:
    """Convert a single text string into a 384-dim embedding vector."""
    model = _get_model()
    # embed() returns a generator — consume just the first item
    for emb in model.embed([text]):
        return emb.tolist()
    return []


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Batch-embed multiple text strings with memory-safe small batches."""
    model = _get_model()
    results: list[list[float]] = []
    # Process in small batches to cap peak memory
    for i in range(0, len(texts), _BATCH_SIZE):
        batch = texts[i : i + _BATCH_SIZE]
        for emb in model.embed(batch):
            results.append(emb.tolist())
    # Explicitly free any lingering numpy arrays
    gc.collect()
    return results
