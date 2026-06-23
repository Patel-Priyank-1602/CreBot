"""
CreBot Backend — Members Sync Route
When a user logs in, this endpoint links their Clerk user ID
to any bot_members rows that were added by email (where clerk_user_id is NULL).
"""

from fastapi import APIRouter, Request
from models.schemas import SyncMembersRequest
from utils.supabase_client import supabase
from utils.clerk_auth import get_clerk_user_id

router = APIRouter()


@router.post("/sync")
async def sync_members(request: Request, body: SyncMembersRequest):
    """
    Link the current user's Clerk ID to any bot_members rows matching their email.
    Called silently by the Dashboard on every load.
    """
    user_id = get_clerk_user_id(request)
    email = body.email

    if not email:
        return {"synced": 0}

    # Find all bot_members rows for this email that don't have a clerk_user_id yet
    try:
        pending = (
            supabase.table("bot_members")
            .select("*")
            .eq("member_email", email)
            .is_("clerk_user_id", "null")
            .execute()
        )
        if not pending.data:
            return {"synced": 0}
    except Exception:
        return {"synced": 0}

    synced = 0
    for row in pending.data:
        try:
            supabase.table("bot_members").update(
                {"clerk_user_id": user_id}
            ).eq("id", row["id"]).execute()
            synced += 1
        except Exception as e:
            print(f"Failed to sync member row {row['id']}: {e}")

    return {"synced": synced}
