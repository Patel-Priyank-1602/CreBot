# CreBot Project Architecture and Understanding

This document provides a comprehensive overview of the CreBot project, detailing its architecture, authentication flow, frontend and backend structures, database schema, and embeddable widget.

---

## 1. Authentication Flow (Clerk Auth)
CreBot uses **Clerk** for seamless user authentication and identity management.

### How it works:
1. **Frontend:** 
   - The React app uses `@clerk/clerk-react` (`ClerkProvider` in `src/main.tsx`).
   - Users sign in/sign up via Clerk's UI components.
   - For every API request, the frontend fetches a JWT token from Clerk and attaches it as a `Bearer` token in the `Authorization` header (`src/lib/api.ts`).
2. **Backend:**
   - The FastAPI backend intercepts requests using `workspace_middleware` (`backend/middlewares/auth.py`).
   - It validates the JWT using Clerk's JWKS (JSON Web Key Set) in `backend/utils/clerk_auth.py`.
   - Once validated, the `clerk_user_id` is extracted.
   - The middleware checks if a `workspace` exists for this user in the Supabase database. If not, it creates a default "My Workspace" for them on the fly.
   - The user ID and workspace ID are injected into the request state for downstream routes to use.

### Key Files:
- **`frontend/src/main.tsx`**: Initializes `ClerkProvider`.
- **`frontend/src/lib/api.ts`**: Intercepts requests to inject the Clerk JWT token.
- **`backend/middlewares/auth.py`**: Middleware that protects API routes and assigns workspace context.
- **`backend/utils/clerk_auth.py`**: Handles decoding and validating the Clerk JWT using PyJWT.

---

## 2. Frontend Architecture
The frontend is built with **React, TypeScript, Vite, and Tailwind CSS**. It serves as the user dashboard to manage chatbots, view logs, and configure settings.

### How it works:
- **Routing:** Uses `react-router-dom` in `App.tsx` with lazy loading for performance.
- **State Management & Data Fetching:** Uses standard React hooks and a centralized API client (`src/lib/api.ts`).
- **Styling:** Tailwind CSS combined with standard CSS (`index.css`) for custom theming (e.g., dark/light mode managed by `ThemeContext.tsx`).

### Key Directories and Files:
- **`src/main.tsx`**: Application entry point, sets up Providers (Theme, Clerk).
- **`src/App.tsx`**: Main router configuration. Handles protected (`<SignedIn>`) and public (`<SignedOut>`) routes.
- **`src/index.css`**: Global styles, CSS variables, and Tailwind directives.
- **`src/lib/api.ts`**: Centralized API client using `fetch`. All backend calls are abstracted here.
- **`src/lib/clerkTheme.ts`**: Customizes the Clerk UI to match the application's theme.
- **`src/context/ThemeContext.tsx`**: Manages Light/Dark mode toggling.

#### Components (`src/components/`):
- **`layout/`**: Structural components (`DashboardLayout.tsx`, `Sidebar.tsx`, `Navbar.tsx`, `AuthLayout.tsx`).
- **`chatbots/`**: Chatbot specific UI (`ChatbotCard.tsx`, `CreateChatbotModal.tsx`, `UsageLimitBanner.tsx`).
- **`common/`**: Reusable UI elements (`Button.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`, `Select.tsx`).
- **`dashboard/`**: Dashboard widgets (`StatCard.tsx`, `RecentActivity.tsx`).
- **`knowledge/`**: Knowledge base management (`UploadDropzone.tsx`, `KnowledgeTable.tsx`).
- **`landing/`**: Public landing page sections (`HeroSection.tsx`, `FeatureGrid.tsx`, `FAQSection.tsx`).

#### Pages (`src/pages/`):
- **`LandingPage.tsx`**: Public marketing page.
- **`DashboardOverview.tsx`**: Main dashboard view with stats.
- **`ChatbotsPage.tsx`**: Lists user's chatbots.
- **`ChatbotDetail.tsx`**: Configure settings for a specific bot.
- **`KnowledgeBasePage.tsx`**: Upload and manage files/text for RAG (Retrieval-Augmented Generation).
- **`ChatLogsPage.tsx`**: View history of conversations users had with the bots.
- **`SettingsPage.tsx` & `BillingPage.tsx`**: Account, API keys, and subscription management.

---

## 3. Backend Architecture
The backend is built with **Python, FastAPI, and Supabase (PostgreSQL with pgvector)**. It handles API requests, text chunking, embeddings generation, vector search, and LLM communication.

### How it works:
- The FastAPI app initializes in `main.py`, setting up CORS and rate limiting (using `slowapi`).
- Routes are modularized under `backend/routes/`.
- Heavy lifting (database operations, calling LLMs, text processing) is done in `backend/services/`.

### Key Directories and Files:
- **`main.py`**: FastAPI application setup, router mounting, and static files configuration for the widget.
- **`config.py`**: Loads environment variables (`.env`) like Supabase keys, Groq API key, Clerk domain, etc.
- **`models/schemas.py`**: Pydantic models defining the expected request bodies and response structures for validation and OpenAPI docs.

#### Routes (`backend/routes/`):
- **`bots.py`**: CRUD operations for Chatbots.
- **`widget.py`**: Public, rate-limited endpoint hit by the embedded widget. Handles the core RAG chat logic.
- **`chat.py`**: Dashboard test chat endpoint.
- **`knowledge.py`**: File uploads, deletion, and reprocessing for the bot's knowledge base.
- **`chatlogs.py`**: Fetching conversation history for the dashboard.
- **`dashboard.py`**: Aggregates statistics (bot count, storage used) for the frontend dashboard.
- **`settings.py`**: Workspace settings and API Key management (BYOK - Bring Your Own Key).
- **`embed.py`**: Returns the widget script snippet.

#### Services (`backend/services/`):
- **`groq_service.py`**: Handles communication with the Groq API (Llama 3). Performs question reformulation and final answer generation based on retrieved context.
- **`knowledge_service.py`**: Manages file storage records and triggers chunking/embedding.
- **`chunking.py`**: Splits raw text into smaller, overlapping chunks suitable for embedding.
- **`embedding.py`**: Converts text chunks into vector embeddings using the HuggingFace model.
- **`retrieval.py`**: Performs semantic search (vector cosine similarity) in Supabase to find relevant chunks for a user's question.
- **`rate_limiter.py`**: Enforces usage limits based on user plans.
- **`settings_service.py`**: Logic for managing API keys and workspace configurations.

---

## 4. Database Schema
CreBot uses **Supabase (PostgreSQL)** heavily leveraging the `pgvector` extension for semantic search.

### Core Tables:
1. **`workspaces`**:
   - Represents a user's account/tenant. 
   - Fields: `id`, `clerk_user_id`, `name`, `plan`, limits (`chatbot_limit`, `storage_limit`).
2. **`bots`**:
   - Stores chatbot configurations.
   - Fields: `id`, `name`, `widget_key`, `workspace_id`, `clerk_user_id`, appearance settings (`theme`, `welcome_message`), access settings (`allowed_domains`, `strict_knowledge`).
3. **`knowledge_files`**:
   - Metadata for uploaded files serving as the bot's brain.
   - Fields: `id`, `bot_id`, `file_name`, `status`, `chunks_count`.
4. **`knowledge_chunks`** & **`documents`**:
   - Stores the actual text segments and their vector embeddings.
   - Fields: `chunk_text`, `embedding` (VECTOR(384)), `bot_id`.
   - *Note: Uses a custom Postgres function `match_documents` to calculate cosine similarity.*
5. **`chat_logs`** & **`queries_log`**:
   - History of questions asked and answers generated.
   - Fields: `workspace_id`, `chatbot_id`, `user_question`, `bot_answer`, `sources` (JSON of used context).
6. **`bot_members`**:
   - For collaborative management of bots.
7. **`api_keys`**:
   - Allows users to generate API keys for programmatic access.

---

## 5. Embeddable Widget
The widget is the public-facing chat interface embedded on customer websites.

### Why it is needed:
Customers need a lightweight, frictionless way to put the chatbot on their own websites without configuring React or building a UI. A simple `<script>` tag is the standard solution.

### Folder: `widget/`
- **`crebot-widget.js`**: 
  - A self-contained, dependency-free vanilla JavaScript file.
  - **Functionality**:
    - Injects custom CSS directly into the host webpage's `<head>`.
    - Creates the DOM elements for the floating chat bubble and the chat panel.
    - Handles UI states (opening/closing, typing animations, copy buttons).
    - Communicates with the backend (`API_URL/api/widget/{id}/chat`) using the `bot_id` or `widget_key` passed via `data-` attributes on the script tag.
    - Maintains temporary chat history for context-aware follow-up questions.

---

## 6. External APIs & Services
*Note: Hugging Face API is excluded as requested.*

1. **Clerk (Authentication):**
   - Used for user registration, login, session management, and securing API endpoints via JWT.
2. **Supabase (Database & Vector Store):**
   - Provides the PostgreSQL database.
   - Uses `pgvector` for storing and querying high-dimensional vector embeddings to enable RAG.
3. **Groq API (LLM Inference):**
   - Used for fast Large Language Model inference (typically Llama 3).
   - Responsible for reformulating user questions (with history) and synthesizing the final answer using the context retrieved from the database.
   - CreBot supports **BYOK (Bring Your Own Key)**, allowing users to input their own Groq API key to bypass platform rate limits.
