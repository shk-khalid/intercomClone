/*
  # Initial schema setup for chat application

  1. New Tables
    - chats: Stores chat conversations
    - messages: Stores individual messages
    - chat_analysis: Stores AI analysis results
    - suggestions: Stores copilot suggestions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar text,
  last_message text,
  unread integer DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  online boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  text text NOT NULL,
  sender text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

-- Create chat_analysis table
CREATE TABLE IF NOT EXISTS chat_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sentiment text,
  topics jsonb,
  action_items jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  text text NOT NULL,
  context text,
  used_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read analysis"
  ON chat_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read suggestions"
  ON suggestions
  FOR SELECT
  TO authenticated
  USING (true);