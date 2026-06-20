-- ============================================================
-- CreBot — AI Customer Support Chatbot Builder
-- Database Schema  (Supabase Postgres + pgvector)
-- Run this in your Supabase SQL Editor to bootstrap the DB.
-- ============================================================

-- 1. Enable the pgvector extension for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Businesses table — one row per signed-up business
CREATE TABLE businesses (
    id         uuid        PRIMARY KEY REFERENCES auth.users(id),
    email      text        UNIQUE NOT NULL,
    plan_type  text        NOT NULL DEFAULT 'free',   -- free | basic | pro
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Bots table — one row per chatbot a business creates
CREATE TABLE bots (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name        text        NOT NULL,
    widget_key  text        UNIQUE NOT NULL,           -- long random public token
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. Documents table — one row per FAQ chunk with its embedding vector
CREATE TABLE documents (
    id         uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id     uuid          NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    chunk_text text          NOT NULL,
    embedding  vector(384),  -- all-MiniLM-L6-v2 output dimension
    created_at timestamptz   NOT NULL DEFAULT now()
);

-- 5. Queries log table — one row per visitor question
CREATE TABLE queries_log (
    id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id     uuid        NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    question   text        NOT NULL,
    answer     text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

-- Fast widget-key lookup on every visitor chat request
CREATE INDEX idx_bots_widget_key      ON bots        (widget_key);

-- Speed up "all rows for this bot" queries
CREATE INDEX idx_documents_bot_id     ON documents   (bot_id);
CREATE INDEX idx_queries_log_bot_id   ON queries_log (bot_id);

-- Approximate nearest-neighbor index for cosine similarity search
CREATE INDEX idx_documents_embedding
    ON documents
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- ============================================================
-- Row-Level Security (RLS) — optional but recommended
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE businesses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bots        ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries_log ENABLE ROW LEVEL SECURITY;

-- Businesses: users can only read/update their own row
CREATE POLICY "businesses_select_own" ON businesses
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "businesses_update_own" ON businesses
    FOR UPDATE USING (auth.uid() = id);

-- Bots: users can CRUD only their own bots
CREATE POLICY "bots_select_own" ON bots
    FOR SELECT USING (business_id = auth.uid());

CREATE POLICY "bots_insert_own" ON bots
    FOR INSERT WITH CHECK (business_id = auth.uid());

CREATE POLICY "bots_delete_own" ON bots
    FOR DELETE USING (business_id = auth.uid());

-- Documents: users can CRUD only documents belonging to their bots
CREATE POLICY "documents_select_own" ON documents
    FOR SELECT USING (
        bot_id IN (SELECT id FROM bots WHERE business_id = auth.uid())
    );

CREATE POLICY "documents_insert_own" ON documents
    FOR INSERT WITH CHECK (
        bot_id IN (SELECT id FROM bots WHERE business_id = auth.uid())
    );

CREATE POLICY "documents_delete_own" ON documents
    FOR DELETE USING (
        bot_id IN (SELECT id FROM bots WHERE business_id = auth.uid())
    );

-- Queries log: users can read logs only for their own bots
CREATE POLICY "queries_log_select_own" ON queries_log
    FOR SELECT USING (
        bot_id IN (SELECT id FROM bots WHERE business_id = auth.uid())
    );

-- Allow the service role (backend) to insert query logs for any bot
-- (visitor chat doesn't have a user JWT — the backend uses the service key)
CREATE POLICY "queries_log_insert_service" ON queries_log
    FOR INSERT WITH CHECK (true);

-- ============================================================
-- Similarity search function (called by the backend)
-- ============================================================

CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(384),
    match_bot_id    uuid,
    match_count     int DEFAULT 5,
    match_threshold float DEFAULT 0.7
)
RETURNS TABLE (
    id         uuid,
    chunk_text text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.chunk_text,
        1 - (d.embedding <=> query_embedding) AS similarity
    FROM documents d
    WHERE d.bot_id = match_bot_id
      AND 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
