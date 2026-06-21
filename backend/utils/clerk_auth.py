"""
CreBot Backend — Clerk JWT Authentication Utility

Validates the Clerk JWT from the Authorization header.
Uses PyJWT to decode and verify the token against Clerk's JWKS.
"""

import jwt
from jwt import PyJWKClient
from fastapi import HTTPException, Request
from config import settings

# Clerk JWKS endpoint
_jwks_client = None


def _get_jwks_client() -> PyJWKClient:
    """Lazily initialize the JWKS client."""
    global _jwks_client
    if _jwks_client is None:
        # Handle both "suitable-rooster-67.clerk.accounts.dev"
        # and "https://suitable-rooster-67.clerk.accounts.dev"
        api_domain = settings.CLERK_FRONTEND_API.strip()
        if api_domain.startswith("https://"):
            base_url = api_domain.rstrip("/")
        elif api_domain.startswith("http://"):
            base_url = api_domain.rstrip("/")
        else:
            base_url = f"https://{api_domain}"

        jwks_url = f"{base_url}/.well-known/jwks.json"
        print(f"[Clerk Auth] JWKS URL: {jwks_url}")
        _jwks_client = PyJWKClient(jwks_url, cache_keys=True)
    return _jwks_client


def get_clerk_user_id(request: Request) -> str:
    """
    Extract and verify the Clerk JWT from the Authorization header.
    Returns the Clerk user ID (sub claim).
    Raises HTTPException 401 if the token is missing or invalid.
    """
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header."
        )

    token = auth_header[7:]  # Strip "Bearer "

    try:
        jwks_client = _get_jwks_client()
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={
                "verify_exp": True,
                "verify_aud": False,  # Clerk tokens don't always include aud
            },
        )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: no user ID.")

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired. Please sign in again.")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        print(f"[Clerk Auth Error] {e}")
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
