# Verified Codebase Metrics for Resume

Here are the verified metrics extracted directly from the codebase.

### 1. File types supported by the ingestion pipeline

**METRIC:** File types supported by the ingestion pipeline
**VERIFIED COUNT:** 6
**EVIDENCE:** 
The backend explicitly lists and handles exactly 6 file types. In `backend/services/knowledge_service.py`, the `ALLOWED_TYPES` dictionary explicitly defines `.pdf`, `.txt`, `.md`, `.docx`, `.csv`, and `.json`. 
The `_extract_text()` function implements actual executable parsing logic for every single one of these:
*   **PDF**: Uses `fitz` (PyMuPDF) to extract text page by page.
*   **DOCX**: Uses `docx` (python-docx) to extract paragraphs and tables.
*   **MD**: Uses a custom regex function (`_strip_markdown`) to remove markdown syntax while preserving structure.
*   **CSV**: Uses Python's native `csv` module to convert rows into readable key-value strings.
*   **JSON**: Uses a recursive function to traverse nested JSON and collect all string values.
*   **TXT**: Uses a raw UTF-8 fallback reader.

Additionally, the frontend UI `UploadDropzone.tsx` strictly validates these exact formats via the `ALLOWED_EXTS` array.

**FILES:** `backend/services/knowledge_service.py`, `frontend/src/components/knowledge/UploadDropzone.tsx`
**COUNTING METHOD:** Counted unique file extensions that are explicitly validated in the backend/frontend allow-lists AND possess dedicated extraction logic in the `_extract_text` service.
**SAFE TO USE ON RESUME:** YES
**SUGGESTED RESUME WORDING:** Engineered a versatile RAG ingestion pipeline supporting 6 complex file formats (PDF, DOCX, CSV, JSON, MD, TXT) with custom extraction algorithms for high-fidelity vector embedding.

---

### 2. Tenant roles and RBAC permission levels

**METRIC:** Tenant roles and RBAC permission levels
**VERIFIED COUNT:** 5 Roles, 4 Permission Levels
**EVIDENCE:** 
The system implements Role-Based Access Control (RBAC) at two distinct levels: Global (Workspace) and Resource (Chatbot).

*   **Global Workspace Roles (2)**: Defined in `schema_new_tables.sql` (defaulting to `'user'`). The `workspace_middleware` in `auth.py` reads this role. A `require_admin` dependency explicitly guards admin routes (e.g., in `admin.py`).
    *   `admin`
    *   `user`
*   **Resource/Bot-level Roles (3)**: Access to specific chatbots is governed by the `_get_bot_for_user` function in `routes/bots.py`. It distinguishes:
    *   `owner` (Verified by checking if the bot's `clerk_user_id` matches the requester).
    *   `edit` (Verified by checking if the user exists in `bot_members` and their encoded access string contains `[edit]`).
    *   `view` (Verified by checking if the user exists in `bot_members` with a `[view]` string).
*   **Permission Enforcement Levels (4)**: 
    *   `require_admin=True` (Guards global stats/users)
    *   `require_owner=True` (Guards bot deletion)
    *   `require_edit=True` (Guards bot updates, member invites)
    *   Implicit view access (Guards reading bot details)

**FILES:** `backend/middlewares/auth.py`, `backend/routes/bots.py`, `backend/routes/admin.py`, `schema_new_tables.sql`
**COUNTING METHOD:** Counted 2 workspace roles + 3 bot access roles (Total: 5 Roles). Counted 4 distinct enforcement guardrails in the backend logic (Total: 4 Permission levels).
**SAFE TO USE ON RESUME:** YES
**SUGGESTED RESUME WORDING:** Implemented secure multi-tenant RBAC featuring 5 distinct roles across workspace and resource levels, strictly enforced via FastAPI middleware with 4 hierarchical permission tiers (Admin, Owner, Edit, View).

---

### Summary Table

| Metric | Verified Count | Safe for Resume? | Evidence Files |
| :--- | :--- | :--- | :--- |
| File types supported | 6 | YES | `knowledge_service.py`, `UploadDropzone.tsx` |
| Tenant Roles | 5 | YES | `auth.py`, `bots.py`, `schema_new_tables.sql` |
| Permission Levels | 4 | YES | `auth.py`, `bots.py`, `admin.py` |
