"""
CreBot Backend — Memory-Optimized Embedding Service

Supports:
1. HuggingFace Inference API (Zero RAM — used when HF_API_TOKEN is set or remote API is reachable)
2. Fastembed Local Fallback using quantized 'sentence-transformers/all-MiniLM-L6-v2' (22MB ONNX model, ~45MB RAM footprint vs 133MB BAAI model)

Both generate 384-dimensional embeddings compatible with Supabase pgvector.
"""

from __future__ import annotations

import gc
import logging
import os

# Lock down ONNX Runtime threads BEFORE fastembed import
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")

import httpx

from config import settings

logger = logging.getLogger(__name__)

_model = None
_BATCH_SIZE = 16


def _get_hf_headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    if settings.HF_API_TOKEN:
        headers["Authorization"] = f"Bearer {settings.HF_API_TOKEN}"
    return headers


def _try_hf_api(texts: list[str]) -> list[list[float]] | None:
    """Attempt to embed texts via Hugging Face Inference API (0 MB local RAM)."""
    model_name = settings.EMBEDDING_MODEL or "sentence-transformers/all-MiniLM-L6-v2"
    url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{model_name}"
    headers = _get_hf_headers()

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(
                url,
                json={"inputs": texts, "options": {"wait_for_model": True}},
                headers=headers,
            )
            if resp.status_code == 200:
                data = resp.json()
                if isinstance(data, list) and len(data) == len(texts):
                    # Check if items are 1D float arrays (384 dimensions)
                    if isinstance(data[0], list) and isinstance(data[0][0], (float, int)):
                        return data
                    # If 3D token embeddings were returned, mean pool them
                    if isinstance(data[0], list) and isinstance(data[0][0], list):
                        pooled = []
                        for seq in data:
                            dim = len(seq[0])
                            avg = [sum(tok[i] for tok in seq) / len(seq) for i in range(dim)]
                            pooled.append(avg)
                        return pooled
    except Exception as e:
        logger.warning(f"HF Inference API call failed: {e}. Falling back to local fastembed.")
    return None


def _get_local_model():
    """Lazy-load lightweight 22MB quantized fastembed model."""
    global _model
    if _model is None:
        from fastembed import TextEmbedding
        model_name = settings.EMBEDDING_MODEL or "sentence-transformers/all-MiniLM-L6-v2"
        _model = TextEmbedding(model_name, threads=1)
    return _model


def embed_text(text: str) -> list[float]:
    """Convert a single text string into a 384-dim embedding vector."""
    res = embed_texts([text])
    return res[0] if res else []


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Batch-embed multiple text strings."""
    if not texts:
        return []

    # 1. Try zero-RAM HF Remote API if token configured or available
    if settings.HF_API_TOKEN:
        remote_res = _try_hf_api(texts)
        if remote_res is not None:
            return remote_res

    # 2. Local fallback using lightweight fastembed model
    model = _get_local_model()
    results: list[list[float]] = []

    for i in range(0, len(texts), _BATCH_SIZE):
        batch = texts[i : i + _BATCH_SIZE]
        for emb in model.embed(batch):
            results.append(emb.tolist())

    gc.collect()
    return results
