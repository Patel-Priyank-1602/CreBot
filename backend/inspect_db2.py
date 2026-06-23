import asyncio
from utils.supabase_client import supabase

async def main():
    try:
        res = supabase.table("knowledge_files").select("*").limit(1).execute()
        print("knowledge_files keys:", res.data[0].keys() if res.data else "No rows")
        
        # also let's look at the rpc definition
    except Exception as e:
        print(e)

asyncio.run(main())
