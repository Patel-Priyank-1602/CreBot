-- ============================================================
-- CreBot — User Groq API Key Migration
-- Adds groq_api_key column to workspaces table
-- Run in Supabase SQL Editor
-- ============================================================

ALTER TABLE workspaces
  ADD COLUMN IF NOT EXISTS groq_api_key TEXT DEFAULT NULL;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
