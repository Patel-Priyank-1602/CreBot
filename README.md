# 🤖 CreBot — AI Customer Support Chatbot Builder

A self-serve SaaS platform where any business uploads its FAQ and gets an AI-powered chat widget — built on a **fully free tech stack** — that it can embed on its website within minutes.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-FF6B35?style=flat&logoColor=white)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFD21E?style=flat&logo=huggingface&logoColor=black)

---

## 🏗️ Architecture

```
Business Owner                    End Website Visitor
      │                                   │
      ▼                                   ▼
 [Next.js Dashboard]           [Embedded JS Widget]
      │                                   │
      │ upload FAQ / manage bots          │ asks questions
      ▼                                   ▼
      ──────────► [FastAPI Backend] ◄──────────
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
    [HuggingFace]  [Supabase]    [Groq LLM]
    (embeddings)   (DB + pgvector) (answers)
```

## 📁 Project Structure

```
CreBot/
├── schema.sql                    # Database schema (Supabase SQL)
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── config.py                 # Environment config
│   ├── requirements.txt          # Python dependencies
│   ├── models/
│   │   └── schemas.py            # Pydantic request/response models
│   ├── routes/
│   │   ├── auth.py               # Signup & login endpoints
│   │   ├── bots.py               # Bot CRUD, train, retrain, logs
│   │   └── widget.py             # Public chat endpoint
│   ├── services/
│   │   ├── chunking.py           # FAQ text → chunks
│   │   ├── embedding.py          # Text → 384-dim vectors
│   │   ├── retrieval.py          # pgvector similarity search
│   │   └── groq_service.py       # Groq LLM answer generation
│   └── utils/
│       └── supabase_client.py    # Supabase client singleton
├── frontend/                     # Next.js dashboard (TBD)
├── widget/
│   └── crebot-widget.js          # Embeddable chat widget
├── .env.example                  # Environment variable template
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### 1. Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Enable the **pgvector** extension (Database → Extensions → search "vector")
3. Open the **SQL Editor** and paste the contents of `schema.sql`
4. Run the SQL to create all tables, indexes, RLS policies, and the similarity search function

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy ..\.env.example .env    # Windows
# cp ../.env.example .env    # macOS/Linux
# Edit .env with your Supabase, Groq keys

# Run the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### 4. Widget Testing

Add this to any HTML file to test the widget:

```html
<script
  src="http://localhost:3000/widget/crebot-widget.js"
  data-widget-key="YOUR_BOT_WIDGET_KEY"
  data-api-url="http://localhost:8000"
  async>
</script>
```

## 🔌 API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/auth/signup` | Public | Create account |
| `POST` | `/api/auth/login` | Public | Login, get JWT |
| `POST` | `/api/bots/` | JWT | Create a bot |
| `GET` | `/api/bots/` | JWT | List your bots |
| `POST` | `/api/bots/{id}/train` | JWT | Train with FAQ text |
| `POST` | `/api/bots/{id}/retrain` | JWT | Replace FAQ content |
| `GET` | `/api/bots/{id}/embed-snippet` | JWT | Get embed code |
| `GET` | `/api/bots/{id}/logs` | JWT | View query logs |
| `POST` | `/api/widget/{key}/chat` | Public | Chat (from widget) |

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js | Dashboard UI |
| Backend | FastAPI (Python) | API + AI pipeline |
| Database | Supabase (Postgres) | Data + Auth |
| Vector Store | pgvector | Similarity search |
| Embeddings | sentence-transformers | Text → vectors (local) |
| LLM | Groq (Llama 3) | Answer generation |
| Widget | Vanilla JS | Embeddable chat |

## 📄 License

MIT License — see [LICENSE](./LICENSE)