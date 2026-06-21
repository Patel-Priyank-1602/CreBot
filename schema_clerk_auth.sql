-- ============================================================
-- CreBot — Clerk Auth Migration
-- Adds user_id (Clerk user ID) to bots table
-- Run this in Supabase SQL Editor AFTER the base schema.sql
-- ============================================================

-- Add clerk_user_id column to bots table
-- This links each bot to the Clerk user who created it
ALTER TABLE bots
  ADD COLUMN IF NOT EXISTS clerk_user_id text;

-- Index for fast lookups by user
CREATE INDEX IF NOT EXISTS idx_bots_clerk_user_id
  ON bots (clerk_user_id);

-- Optional: backfill existing bots with a default user ID
-- UPDATE bots SET clerk_user_id = 'your_clerk_user_id' WHERE clerk_user_id IS NULL;
