"""
CreBot Backend — Authentication Routes
Signup and login via Supabase Auth.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import SignupRequest, LoginRequest, AuthResponse
from utils.supabase_client import supabase

router = APIRouter()


@router.post("/signup", response_model=AuthResponse)
async def signup(body: SignupRequest):
    """Create a new business account via Supabase Auth."""
    try:
        # 1. Create the user in Supabase Auth
        auth_response = supabase.auth.sign_up(
            {"email": body.email, "password": body.password}
        )

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Signup failed. Please try again.")

        user = auth_response.user

        # 2. Insert a corresponding row in the businesses table
        supabase.table("businesses").insert({
            "id": user.id,
            "email": body.email,
            "plan_type": "free",
        }).execute()

        return AuthResponse(
            access_token=auth_response.session.access_token if auth_response.session else "",
            user_id=user.id,
            email=body.email,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    """Authenticate an existing business and return a JWT."""
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": body.email, "password": body.password}
        )

        if not auth_response.user or not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        return AuthResponse(
            access_token=auth_response.session.access_token,
            user_id=auth_response.user.id,
            email=body.email,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
