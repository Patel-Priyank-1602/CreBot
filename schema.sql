-- ============================================================
-- CreBot — Database Schema (Supabase Postgres + pgvector)
-- No Auth Version — Run in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE bots (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text        NOT NULL,
    widget_key  text        UNIQUE NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE documents (
    id         uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id     uuid          NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    chunk_text text          NOT NULL,
    embedding  vector(384),
    created_at timestamptz   NOT NULL DEFAULT now()
);

CREATE TABLE queries_log (
    id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id     uuid        NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    question   text        NOT NULL,
    answer     text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_bots_widget_key    ON bots        (widget_key);
CREATE INDEX idx_documents_bot_id   ON documents   (bot_id);
CREATE INDEX idx_queries_log_bot_id ON queries_log (bot_id);

-- Similarity search function
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
