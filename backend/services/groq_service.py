"""
CreBot Backend — Groq Answer Generation Service
Uses Groq's Llama 3 model to generate a natural-language answer
from retrieved FAQ chunks.
"""

from groq import Groq
from config import settings

_client: Groq | None = None


def _get_client() -> Groq:
    """Lazy-initialize the Groq client."""
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


SYSTEM_PROMPT = """You are a helpful customer support assistant for a business.
You MUST answer the customer's question using ONLY the provided FAQ context below.
If the context does not contain information relevant to the question, say exactly:
"I'm sorry, I don't have information about that. Please contact our support team for further assistance."

IMPORTANT RULES:
- Never invent or guess information not present in the context.
- Be concise, friendly, and professional.
- If the context partially answers the question, share what you know and indicate what you can't answer.
- Do not mention that you are reading from "context" or "FAQ chunks" — respond naturally."""


def generate_answer(question: str, context_chunks: list[str]) -> str:
    """
    Send the question + retrieved context to Groq and return the answer.

    Args:
        question:        The visitor's question.
        context_chunks:  List of relevant FAQ text chunks.

    Returns:
        The generated answer string.
    """
    client = _get_client()

    # Build the context block
    context = "\n\n---\n\n".join(context_chunks)

    user_message = f"""FAQ Context:
{context}

Customer Question: {question}

Please answer the customer's question based only on the FAQ context provided above."""

    try:
        chat_completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=512,
            top_p=0.9,
        )
        return chat_completion.choices[0].message.content.strip()

    except Exception as e:
        print(f"[Groq Error] {e}")
        raise


def generate_fallback_answer() -> str:
    """Return the standard 'I don't know' response without calling Groq."""
    return (
        "I'm sorry, I don't have information about that in our FAQ. "
        "Please contact our support team for further assistance."
    )
