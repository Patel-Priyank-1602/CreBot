import asyncio

from utils.supabase_client import supabase


async def main():
    try:
        # Check documents schema
        res = supabase.table("documents").select("*").limit(1).execute()
        print("Documents keys:", res.data[0].keys() if res.data else "No rows")
        
        # We can't easily read RPC source code via REST, but we can look for schema files.
    except Exception as e:
        print(e)

asyncio.run(main())
