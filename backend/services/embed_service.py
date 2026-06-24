from utils.supabase_client import supabase
from config import settings
from fastapi import HTTPException


def _get_bot_safe(chatbot_id: str, workspace_id: str):
    try:
        result = supabase.table("bots").select("*").eq("id", chatbot_id).eq("workspace_id", workspace_id).execute()
        if result.data:
            return result.data[0]
    except Exception:
        pass
    try:
        result = supabase.table("bots").select("*").eq("id", chatbot_id).execute()
        if result.data:
            return result.data[0]
    except Exception:
        pass
    return None


from routes.bots import _get_bot_for_user
def get_embed_settings(workspace_id: str, chatbot_id: str, user_id: str):
    b = _get_bot_for_user(chatbot_id, user_id, workspace_id, require_edit=True)

    embed_id = b.get("embed_id") or b.get("widget_key", "")

    return {
        "chatbot_id": b["id"],
        "embed_id": embed_id,
        "name": b["name"],
        "welcome_message": b.get("welcome_message", "Hi! How can I help you today?"),
        "theme": b.get("theme", "dark"),
        "position": b.get("position", "bottom-right"),
        "allowed_domains": b.get("allowed_domains", []),
    }


def update_embed_settings(workspace_id: str, chatbot_id: str, data: dict, user_id: str):
    get_embed_settings(workspace_id, chatbot_id, user_id)

    update_data = {}
    if "welcome_message" in data:
        update_data["welcome_message"] = data["welcome_message"]
    if "theme" in data:
        update_data["theme"] = data["theme"]
    if "position" in data:
        update_data["position"] = data["position"]
    if "allowed_domains" in data:
        update_data["allowed_domains"] = data["allowed_domains"]

    if update_data:
        update_data["updated_at"] = "now()"
        try:
            supabase.table("bots").update(update_data).eq("id", chatbot_id).execute()
        except Exception:
            pass

    return get_embed_settings(workspace_id, chatbot_id, user_id)


def get_embed_script(workspace_id: str, chatbot_id: str, user_id: str):
    embed_settings = get_embed_settings(workspace_id, chatbot_id, user_id)

    snippet = f"""<!-- CreBot Chat Widget -->
<script
  src="{settings.FRONTEND_URL}/widget/crebot-widget.js"
  data-bot-id="{chatbot_id}"
  data-api-url="{settings.FRONTEND_URL}"
  async>
</script>"""

    return {
        "snippet": snippet,
        "embed_id": embed_settings["embed_id"],
        "bot_id": chatbot_id,
        "settings": embed_settings,
    }
