-- ============================================================
-- CreBot — New Tables Migration
-- Adds workspaces, knowledge_files, knowledge_chunks, chat_logs, api_keys
-- Run in Supabase SQL Editor
-- ============================================================

-- Enable pgvector extension (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Workspaces (one per Clerk user)
CREATE TABLE IF NOT EXISTS workspaces (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_user_id text        UNIQUE NOT NULL,
    name          text        NOT NULL DEFAULT 'My Workspace',
    email         text,
    role          text        NOT NULL DEFAULT 'user',
    plan          text        NOT NULL DEFAULT 'free',
    chatbot_limit integer     NOT NULL DEFAULT 5,
    storage_limit bigint      NOT NULL DEFAULT 52428800,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspaces_clerk_user_id ON workspaces (clerk_user_id);

-- Knowledge files
CREATE TABLE IF NOT EXISTS public.knowledge_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id UUID,
  user_id TEXT,
  file_name TEXT NOT NULL,
  original_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  storage_path TEXT,
  status TEXT DEFAULT 'pending',
  chunks_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_files_bot_id ON public.knowledge_files (bot_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_files_user_id ON public.knowledge_files (user_id);

-- Knowledge chunks (embedded text segments)
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES public.knowledge_files(id) ON DELETE CASCADE,
  bot_id UUID,
  user_id TEXT,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding VECTOR(384),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_bot_id ON public.knowledge_chunks (bot_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_file_id ON public.knowledge_chunks (file_id);

-- Chat logs (comprehensive)
CREATE TABLE IF NOT EXISTS chat_logs (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id  uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    chatbot_id    uuid        NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    user_question text        NOT NULL,
    bot_answer    text,
    sources       jsonb,
    status        text        NOT NULL DEFAULT 'answered',
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_logs_workspace ON chat_logs (workspace_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_chatbot   ON chat_logs (chatbot_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created   ON chat_logs (created_at DESC);

-- API keys
CREATE TABLE IF NOT EXISTS api_keys (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id uuid        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    key_hash     text        NOT NULL,
    key_preview  text        NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz,
    status       text        NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_api_keys_workspace ON api_keys (workspace_id);

-- Add workspace_id to existing bots table
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL;

-- Add workspace_id and sources to existing queries_log
ALTER TABLE queries_log
  ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE queries_log
  ADD COLUMN IF NOT EXISTS sources jsonb;
ALTER TABLE queries_log
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'answered';

-- Bot metadata columns
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS strict_knowledge boolean NOT NULL DEFAULT true;
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS total_files integer NOT NULL DEFAULT 0;
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS total_chats integer NOT NULL DEFAULT 0;
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS embed_id text;
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS allowed_domains jsonb DEFAULT '[]'::jsonb;
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS welcome_message text DEFAULT 'Hi! How can I help you today?';
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'dark';
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS position text NOT NULL DEFAULT 'bottom-right';
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_bots_workspace ON bots (workspace_id);

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
