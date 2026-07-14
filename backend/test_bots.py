import asyncio

from utils.supabase_client import supabase


async def main():
    try:
        result = supabase.table("bots").select("*").execute()
        print(f"TOTAL BOTS: {len(result.data)}")
        for b in result.data:
            print(f"Bot: {b['id']} - {b['name']} - WS: {b.get('workspace_id')}")
    except Exception as e:
        print(e)

asyncio.run(main())
