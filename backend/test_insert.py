from dotenv import load_dotenv

load_dotenv()
import uuid  # noqa: E402

from utils.supabase_client import supabase  # noqa: E402

file_id = str(uuid.uuid4())
row = {
    "id": file_id,
    "bot_id": "",
    "user_id": "test",
    "file_name": "test.txt",
    "file_type": "TXT",
    "file_size": 10,
    "status": "pending",
}

try:
    print("Trying with empty string bot_id...")
    res = supabase.table("knowledge_files").insert(row).execute()
    print("Success:", res)
except Exception as e:
    print("Failed with empty string:", str(e))

row["id"] = str(uuid.uuid4())
row["bot_id"] = None
try:
    print("\nTrying with None bot_id...")
    res = supabase.table("knowledge_files").insert(row).execute()
    print("Success:", res)
except Exception as e:
    print("Failed with None:", str(e))
