import asyncio

from utils.supabase_client import supabase


async def main():
    try:
        # Find files with no bot_id
        files = supabase.table("knowledge_files").select("*").is_("bot_id", "null").execute()
        if not files.data:
            print("No files to fix.")
            return

        print(f"Found {len(files.data)} files with no bot_id.")
        for f in files.data:
            user_id = f["user_id"]
            # Find the first bot for this user
            bots = supabase.table("bots").select("id").eq("clerk_user_id", user_id).limit(1).execute()
            if bots.data:
                bot_id = bots.data[0]["id"]
                # Update file
                supabase.table("knowledge_files").update({"bot_id": bot_id}).eq("id", f["id"]).execute()
                print(f"Assigned file {f['file_name']} to bot {bot_id}")
                
                # We also need to trigger reprocess because embeddings weren't created!
                from services.knowledge_service import reprocess_file
                try:
                    reprocess_file(f["id"], user_id)
                    print(f"Successfully reprocessed file {f['file_name']} for bot {bot_id}")
                except Exception as e:
                    print(f"Failed to reprocess file {f['file_name']}: {e}")
            else:
                print(f"No bots found for user {user_id}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
