"""
CreBot Backend — Groq Answer Generation Service

Enhanced with:
- Conversational memory (chat history)
- Question reformulation for follow-up questions
- Chain-of-thought reasoning for tricky questions
- General knowledge fallback when FAQ context is insufficient
- BYOK: Users can bring their own Groq API key
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


def _get_client_for_key(api_key: str | None) -> Groq:
    """Return a Groq client. If a user-provided key is given, create a
    temporary client with that key; otherwise fall back to the default."""
    if api_key:
        return Groq(api_key=api_key)
    return _get_client()


def validate_groq_api_key(api_key: str) -> tuple[bool, str]:
    """Validate a Groq API key by making a minimal test call.
    Returns (is_valid, error_message)."""
    try:
        client = Groq(api_key=api_key)
        client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": "Hi"}],
            max_tokens=5,
        )
        return True, ""
    except Exception as e:
        return False, str(e)


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
    question: str, chat_history: list[dict],
    user_groq_api_key: str | None = None,
) -> str:
    """
    If chat history exists, rewrite the user's latest message into a
    complete standalone question so that retrieval and answering work
    correctly even on vague follow-ups like "when was that?" or "who won?".
    """
    if not chat_history:
        return question

    client = _get_client_for_key(user_groq_api_key)

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
SYSTEM_PROMPT = """You are an advanced, highly intelligent, and authoritative AI assistant.
Your primary goal is to provide direct, comprehensive, and accurate answers immediately.

================================================================
KNOWLEDGE SOURCES
================================================================
1. Provided Context: This is retrieved from a knowledge base and should be prioritized if it contains the answer.
2. Internal Knowledge: If the provided context is irrelevant, incomplete, or missing, you MUST instantly seamlessly fallback to your own vast internal knowledge base. 

================================================================
CORE DIRECTIVES (STRICTLY ENFORCED)
================================================================
- DIRECT ANSWERS ONLY: Never use conversational filler like "Based on the provided context..." or "I could not find the answer in the reference." Answer the question as if you inherently know it.
- NO APOLOGIES FOR MISSING DATA: If the context lacks the answer, DO NOT apologize or mention the lack of data. Just answer the question using your internal knowledge.
- NO FALSE REFUSALS: If a user asks a factual question (e.g., historical events, sports, science), answer it. You are a powerful AI; do not feign ignorance.
- CONFIDENCE & AUTHORITY: Speak with authority. If a premise in the user's question is false (e.g., "Which team beat India in the final of 2019"), politely and directly correct the premise ("India did not play in the final. New Zealand defeated them in the semi-final...").
- BE CONCISE BUT COMPLETE: Do not ramble. Give the exact information requested, cleanly formatted.

================================================================
Remember: You are a state-of-the-art AI. Provide the absolute best, most accurate, and most direct answer possible without exposing your internal mechanics or retrieval process."""


def generate_answer(
    question: str,
    context_chunks: list[str],
    chat_history: list[dict] | None = None,
    user_groq_api_key: str | None = None,
    strict_knowledge: bool = True,
) -> tuple[str, str]:
    """
    Send the question + retrieved context + chat history to Groq and
    return (answer, source_type).

    source_type is one of: "faq", "general", "hybrid"
    """
    client = _get_client_for_key(user_groq_api_key)

    context = "\n\n---\n\n".join(context_chunks) if context_chunks else ""

    # Adjust system prompt based on strict_knowledge flag
    if strict_knowledge:
        sys_prompt = """You are an advanced, highly intelligent AI assistant.
Your primary goal is to provide direct, comprehensive, and accurate answers.

================================================================
KNOWLEDGE SOURCES
================================================================
1. Provided Context: This is retrieved from a knowledge base. You MUST ONLY use this context to answer the question.

================================================================
CORE DIRECTIVES
================================================================
- DIRECT ANSWERS ONLY: Never use conversational filler like "Based on the provided context...".
- NO FALSE KNOWLEDGE: If the answer cannot be found in the provided context, you MUST state that you do not know. DO NOT use your internal general knowledge to answer.
- BE CONCISE BUT COMPLETE: Do not ramble. Give the exact information requested."""
    else:
        sys_prompt = """You are an advanced, highly intelligent AI assistant.
Your primary goal is to provide direct, comprehensive, and accurate answers.

================================================================
KNOWLEDGE SOURCES
================================================================
1. Provided Context: This is retrieved from a knowledge base and should be prioritized if it contains the answer.
2. Internal Knowledge: If the provided context is irrelevant, incomplete, or missing, you MUST instantly seamlessly fallback to your own vast internal knowledge base. 

================================================================
CORE DIRECTIVES
================================================================
- DIRECT ANSWERS ONLY: Never use conversational filler like "Based on the provided context...".
- NO APOLOGIES FOR MISSING DATA: If the context lacks the answer, DO NOT apologize. Just answer using internal knowledge.
- NO FALSE REFUSALS: If a user asks a factual question, answer it. You are a powerful AI; do not feign ignorance.
- BE CONCISE BUT COMPLETE: Do not ramble. Give the exact information requested."""

    # Build the message list
    messages = [{"role": "system", "content": sys_prompt}]

    # Add chat history (last 8 messages max to stay within token limits)
    if chat_history:
        for msg in chat_history[-8:]:
            messages.append(
                {"role": msg["role"], "content": msg["content"]}
            )

    # Build the user message with context
    if context:
        if strict_knowledge:
            user_message = f"""Here is the reference information you must use:
{context}

Question: {question}

Answer the question STRICTLY using the reference information above. If the information does not answer the question, state that you do not have enough information."""
        else:
            user_message = f"""Here is some reference information that MAY be relevant:
{context}

Question: {question}

Answer the question. If the reference information above answers it, use that.
If the reference information is NOT relevant to this specific question, ignore it
completely and answer using your own vast internal knowledge. Do NOT say you cannot find the answer."""
    else:
        if strict_knowledge:
            user_message = f"""Question: {question}

No reference information was provided. State that you do not have enough information to answer."""
        else:
            user_message = f"""Question: {question}

Answer this question using your own general knowledge. Be helpful and accurate."""

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
