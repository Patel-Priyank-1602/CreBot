"""
CreBot Backend — Per-Bot Rate Limiter

Enforces a 10 requests/minute limit PER BOT when using CreBot's
shared Groq API key. Users who bring their own key (BYOK) bypass
this limiter entirely.

Uses an in-memory sliding-window approach (no external dependencies).
"""

import threading
import time
from collections import defaultdict

from fastapi import HTTPException

# ── Configuration ────────────────────────────────────────────────
CREBOT_KEY_LIMIT = 10         # max requests per window per bot
WINDOW_SECONDS = 60          # sliding window size (1 minute)

# ── Internal State ───────────────────────────────────────────────
# {bot_id: [timestamp, timestamp, ...]}
_request_log: dict[str, list[float]] = defaultdict(list)
_lock = threading.Lock()


def check_bot_rate_limit(bot_id: str, uses_crebot_key: bool) -> None:
    """
    Call this BEFORE making a Groq API request.

    - If the bot owner has their own Groq key (uses_crebot_key=False),
      this function does nothing.
    - If the bot relies on CreBot's shared key (uses_crebot_key=True),
      it enforces 10 requests per minute per bot.

    Raises HTTPException(429) when the limit is exceeded.
    """
    if not uses_crebot_key:
        return  # BYOK users — no CreBot-side limit

    now = time.time()
    window_start = now - WINDOW_SECONDS

    with _lock:
        # Prune expired timestamps
        _request_log[bot_id] = [
            ts for ts in _request_log[bot_id] if ts > window_start
        ]

        if len(_request_log[bot_id]) >= CREBOT_KEY_LIMIT:
            retry_after = int(_request_log[bot_id][0] + WINDOW_SECONDS - now) + 1
            raise HTTPException(
                status_code=429,
                detail=(
                    f"Rate limit exceeded: this bot is limited to "
                    f"{CREBOT_KEY_LIMIT} requests per minute on the shared "
                    f"CreBot API key. Please try again in {retry_after}s, "
                    f"or add your own Groq API key to remove this limit."
                ),
            )

        # Record the current request
        _request_log[bot_id].append(now)
