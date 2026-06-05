-- Medical News Agent - Supabase Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  source_icon TEXT DEFAULT '📰',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  original_content TEXT DEFAULT '',
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS articles_source_idx ON articles(source);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles(created_at DESC);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view articles)
CREATE POLICY "Public read access" ON articles
  FOR SELECT USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Service role write access" ON articles
  FOR ALL USING (auth.role() = 'service_role');
