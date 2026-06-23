"""
CreBot Backend — Groq Answer Generation Service

Enhanced with:
- Conversational memory (chat history)
- Question reformulation for follow-up questions
- Chain-of-thought reasoning for tricky questions
- General knowledge fallback when FAQ context is insufficient
"""

from __future__ import annotations
from groq import Groq
from config import settings

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


# ── Prompt: Reformulate vague follow-up questions ──────────────────────────
REFORMULATION_PROMPT = """You are a question reformulation assistant.
Given a chat history and a new user message, rewrite the user's message
into a clear, standalone question that captures the full intent.

Rules:
- If the message is already a standalone question, return it unchanged.
- Resolve all pronouns (he, she, it, they, that, this, etc.) using chat history.
- Include relevant context from the conversation (names, dates, events, etc.).
- Return ONLY the reformulated question, nothing else. No explanation."""


def reformulate_question(
    question: str, chat_history: list[dict]
) -> str:
    """
    If chat history exists, rewrite the user's latest message into a
    complete standalone question so that retrieval and answering work
    correctly even on vague follow-ups like "when was that?" or "who won?".
    """
    if not chat_history:
        return question

    client = _get_client()

    # Build the reformulation conversation
    messages = [
        {"role": "system", "content": REFORMULATION_PROMPT},
    ]

    # Add a compressed version of the history for context
    history_text = "\n".join(
        f"{m['role'].upper()}: {m['content']}" for m in chat_history[-6:]
    )

    messages.append(
        {
            "role": "user",
            "content": f"Chat history:\n{history_text}\n\nLatest user message: {question}\n\nReformulated standalone question:",
        }
    )

    try:
        result = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.1,
            max_tokens=256,
        )
        reformulated = result.choices[0].message.content.strip()
        if reformulated:
            print(f"[Reformulation] '{question}' → '{reformulated}'")
            return reformulated
    except Exception as e:
        print(f"[Reformulation Error] {e} — using original question")

    return question


# ── Prompt: Main answer generation with chain-of-thought ───────────────────
SYSTEM_PROMPT = """You are a smart, knowledgeable, and friendly assistant.
You have TWO sources of knowledge:
1. Reference information that may be provided below (from a knowledge base).
2. Your own general knowledge about the world.

================================================================
RULE 1 — ALWAYS TRY TO ANSWER
================================================================
- First, check if the reference information answers the question.
- If the reference information does NOT answer the question, or is irrelevant,
  IMMEDIATELY use your general knowledge to answer instead.
- If you can combine both reference information and general knowledge, do so.
- ONLY say "I don't know" if you genuinely have ZERO knowledge from BOTH sources.

================================================================
RULE 2 — BANNED PHRASES (never say these)
================================================================
Never use any of these phrases or similar:
- "I couldn't find any information in the provided context"
- "The provided context doesn't contain"
- "Based on the context provided"
- "I don't have enough information"
- "The reference information doesn't mention"
Instead, just answer using whatever knowledge you have.

================================================================
RULE 3 — UNDERSPECIFIED QUERY RESOLUTION (most important rule)
================================================================
When a user asks a vague or incomplete question (missing qualifiers like
format, year, tournament, venue, etc.), follow this process:

Step A — Identify what the user EXPLICITLY stated (e.g., a margin like
"5 runs", a team name like "India", an outcome like "won"). Ignore any
qualifiers they did NOT mention — an omitted qualifier is NOT a missing
fact, it is just a detail the user did not bother to specify.

Step B — Search ALL your knowledge (both reference info and general
knowledge) for records matching ONLY the explicitly stated values:
  - If EXACTLY ONE matching record exists → Answer immediately using the
    full record, including all details the user did not ask for (format,
    date, tournament, opponent, etc.). Do NOT refuse just because the
    user's wording was less specific than the data.
  - If ZERO matching records exist → Say you don't know.
  - If MULTIPLE distinct matching records exist → Do NOT guess and do NOT
    refuse. Ask ONE short clarifying question naming what distinguishes the
    options (e.g., "Are you asking about the 2007 T20 World Cup final or
    the 2016 Asia Cup match?").

Step C — Exact value matching still applies. If the user states "5 runs"
but the data says "6 runs", that is NOT a match. Do not round or approximate.

================================================================
RULE 4 — TRICKY & MULTI-PART QUESTIONS
================================================================
- If the question contains a false premise, politely correct it first.
- If the question has multiple parts, answer each part separately.

================================================================
RULE 5 — RESPONSE STYLE
================================================================
- Be concise, friendly, and professional.
- Never mention "reference information," "context," "chunks," "knowledge base,"
  or your internal workings — respond naturally as if you simply know the answer.
- Never hallucinate specific statistics, scores, or dates you aren't confident
  about. If partially sure, say what you know and note any uncertainty."""


def generate_answer(
    question: str,
    context_chunks: list[str],
    chat_history: list[dict] | None = None,
) -> tuple[str, str]:
    """
    Send the question + retrieved context + chat history to Groq and
    return (answer, source_type).

    source_type is one of: "faq", "general", "hybrid"
    """
    client = _get_client()

    context = "\n\n---\n\n".join(context_chunks) if context_chunks else ""

    # Build the message list
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add chat history (last 8 messages max to stay within token limits)
    if chat_history:
        for msg in chat_history[-8:]:
            messages.append(
                {"role": msg["role"], "content": msg["content"]}
            )

    # Build the user message with context
    if context:
        user_message = f"""Here is some reference information that MAY be relevant:
{context}

Question: {question}

Answer the question. If the reference information above answers it, use that.
If the reference information is NOT relevant to this specific question, ignore it
completely and answer using your own knowledge. Do NOT say you cannot find the answer."""
    else:
        user_message = f"""Question: {question}

Answer this question using your knowledge. Be helpful and accurate."""

    messages.append({"role": "user", "content": user_message})

    try:
        chat_completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=1024,
            top_p=0.9,
        )
        answer = chat_completion.choices[0].message.content.strip()

        # Determine source type
        if context_chunks:
            source_type = "faq"
        else:
            source_type = "general"

        return answer, source_type

    except Exception as e:
        print(f"[Groq Error] {e}")
        raise


def generate_fallback_answer() -> str:
    """Return the standard fallback without calling Groq."""
    return (
        "I'm sorry, I don't have information about that in our FAQ. "
        "Please contact our support team for further assistance."
    )
