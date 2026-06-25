# CreBot Project Summary

CreBot is an AI Customer Support Chatbot Builder. It enables users to upload documentation (knowledge base) and automatically generates an AI chatbot that answers questions based *strictly* on the provided documentation (Zero-speculation RAG). It provides an embeddable widget that can be placed on any website.

## 🚀 Key Features

1. **Intelligent Chatbot Creation (RAG)**
   - Create chatbots grounded entirely in user-provided documents.
   - Prevents AI hallucinations by limiting responses to known data or responding with "I don't know."
   
2. **Knowledge Base Management**
   - Upload text, markdown, or documentation files.
   - Converts files into vector embeddings for accurate context retrieval.

3. **Embeddable Chat Widget**
   - A dependency-free JavaScript widget (`crebot-widget.js`) that can be embedded into any external website.
   - Communicates securely with the CreBot backend API.

4. **Chat Logs & History**
   - Full conversational tracking.
   - Admins/owners can review how the AI answers customer questions in real-time.

5. **API Access & Export**
   - Generate secure API keys to integrate CreBot programmatically.
   - Export all account data (JSON format).

6. **Authentication & Security**
   - Clerk authentication for secure sign-up, sign-in, and session management.
   - Isolated accounts ensuring no cross-contamination of knowledge base data between users.

---

## 💻 Tech Stack

### Frontend
- **React + TypeScript**: Built with Vite.
- **TailwindCSS**: For rapid, highly customized UI styling.
- **Framer Motion**: For smooth animations (e.g., in the mock chat UI).
- **Clerk React**: User authentication and session management.
- **Lucide React**: Iconography.
- **React Router**: Frontend routing.

### Backend
- **FastAPI (Python)**: High-performance backend API.
- **Supabase**: PostgreSQL database for storing user data, bot configs, logs, and API keys.
- **Vector Database/Embeddings**: For RAG (Retrieval-Augmented Generation) document search.
- **Groq API**: High-speed LLM inference for generating the chatbot responses.
- **SlowAPI**: Rate limiting for API endpoints.

---

## 📂 Project Structure & Files

### Frontend (`frontend/src/`)

**Pages (`src/pages/`)**
- `LandingPage.tsx`: The marketing homepage showcasing features, hero section, and pricing.
- `DashboardOverview.tsx`: The main user dashboard summarizing bot counts, files uploaded, and recent chat activity.
- `ChatbotsPage.tsx` & `ChatbotDetail.tsx`: Manage existing bots or create new ones.
- `BotDetail.tsx`: Detailed view for configuring a specific bot's prompt, name, and appearance.
- `KnowledgeBasePage.tsx`: Interface for uploading and managing source documents for the bots.
- `EmbedPage.tsx`: Provides the script tags and settings for embedding the widget on external sites.
- `ChatLogsPage.tsx`: View histories of conversations end-users have had with the bots.
- `SettingsPage.tsx`: Manage API keys, export data, and dangerous actions (deletions).
- `SignInPage.tsx` & `SignUpPage.tsx`: Authentication wrappers around Clerk components.
- `BillingPage.tsx`: Stripe/subscription management.
- `UserProfilePage.tsx`: User account configuration.
- `AdminPage.tsx`: System administrator dashboard.
- `JoinBotPage.tsx`: Functionality to join an existing bot using a share code.

**Components (`src/components/`)**
- `layout/Navbar.tsx`: Top navigation bar (styled with black background and custom logo).
- `layout/Sidebar.tsx`: Dashboard side navigation.
- `landing/HeroSection.tsx`: Features an animated mock chat demonstrating the AI's capability.
- `landing/SecuritySection.tsx`: Explains the data privacy and isolated account architecture.

### Backend (`backend/`)

**Core**
- `main.py`: The FastAPI application entry point. Handles middleware, rate limiting, and router inclusion. Mounts the static widget directory.
- `config.py`: Environment variable and application configuration management.

**Routers (`backend/routes/`)**
- `bots.py`: CRUD operations for chatbots.
- `knowledge.py`: Document upload, parsing, and embedding generation.
- `chat.py` & `widget.py`: Handles incoming chat queries, performs vector retrieval, and calls the Groq LLM.
- `embed.py`: API for fetching widget settings.
- `settings.py`: API key generation, revocation, and data exports.
- `dashboard.py`: Aggregates statistics for the frontend dashboard.
- `chatlogs.py`: Retrieves historical conversation data.

**Services (`backend/services/`)**
- Contains the core business and database logic separating it from the HTTP routing layer (e.g., `settings_service.py`, `dashboard_service.py`, `chatlog_service.py`).

### Widget (`widget/`)
- `crebot-widget.js`: The vanilla JavaScript widget script that gets injected into client websites. It renders the chat bubble, maintains conversational history, and sends API requests to the FastAPI backend.
