import asyncio

from utils.supabase_client import supabase


async def main():
    try:
        # Get all workspaces
        res = supabase.table("workspaces").select("id, clerk_user_id, role").execute()
        for w in res.data:
            supabase.table("workspaces").update({"role": "admin"}).eq("id", w["id"]).execute()
            print(f"Updated {w['id']} to admin.")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
