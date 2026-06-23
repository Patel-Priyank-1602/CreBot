-- ============================================================
-- CreBot — Bot Members Schema
-- Run this in Supabase SQL Editor AFTER the base schema.sql
-- ============================================================

-- Table: bot_members
-- Stores users who have been added to a bot (directly by the owner).
-- clerk_user_id is NULL until the invited user logs in for the first time.
CREATE TABLE IF NOT EXISTS bot_members (
    id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id        uuid        NOT NULL REFERENCES bots(id) ON DELETE CASCADE,
    clerk_user_id text,
    member_email  text        NOT NULL,
    joined_at     timestamptz NOT NULL DEFAULT now(),
    UNIQUE(bot_id, member_email)
);

-- Index for fast lookups by user ID (for Dashboard)
CREATE INDEX IF NOT EXISTS idx_bot_members_user_id
  ON bot_members (clerk_user_id);

-- Index for fast lookups by email (for syncing on login)
CREATE INDEX IF NOT EXISTS idx_bot_members_email
  ON bot_members (member_email);
