-- Create mood_history table to store users' mood history data
CREATE TABLE IF NOT EXISTS mood_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood VARCHAR(2) NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS mood_history_user_id_idx ON mood_history(user_id);
CREATE INDEX IF NOT EXISTS mood_history_created_at_idx ON mood_history(created_at);

-- Enable RLS
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own mood history" ON mood_history;
CREATE POLICY "Users can view their own mood history"
  ON mood_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own mood history" ON mood_history;
CREATE POLICY "Users can insert their own mood history"
  ON mood_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table mood_history;
