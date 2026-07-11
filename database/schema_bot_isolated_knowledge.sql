-- ============================================================
-- CreBot — Bot-Isolated Knowledge Migration
-- Ensures knowledge_files and knowledge_chunks have bot_id
-- Adds indexes for bot-specific lookups
-- Run in Supabase SQL Editor
-- ============================================================

-- Ensure bot_id column exists on knowledge_files
ALTER TABLE public.knowledge_files
  ADD COLUMN IF NOT EXISTS bot_id UUID;

-- Ensure bot_id column exists on knowledge_chunks
ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS bot_id UUID;

-- Ensure existing indexes exist
CREATE INDEX IF NOT EXISTS idx_knowledge_files_bot_id
  ON public.knowledge_files (bot_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_files_user_id
  ON public.knowledge_files (user_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_bot_id
  ON public.knowledge_chunks (bot_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_file_id
  ON public.knowledge_chunks (file_id);

-- Create a match_documents function for knowledge_chunks
-- (for future use — retrieval currently uses the documents table)
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
    query_embedding vector(384),
    match_bot_id    uuid,
    match_count     int DEFAULT 8,
    match_threshold float DEFAULT 0.20
)
RETURNS TABLE (
    id         uuid,
    content    text,
    similarity float,
    file_id    uuid,
    chunk_index int
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kc.id,
        kc.content,
        1 - (kc.embedding <=> query_embedding) AS similarity,
        kc.file_id,
        kc.chunk_index
    FROM knowledge_chunks kc
    WHERE kc.bot_id = match_bot_id
      AND kc.embedding IS NOT NULL
      AND 1 - (kc.embedding <=> query_embedding) > match_threshold
    ORDER BY kc.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
