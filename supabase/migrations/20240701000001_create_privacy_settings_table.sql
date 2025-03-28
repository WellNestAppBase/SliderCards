-- Create privacy_settings table
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  global_visibility TEXT NOT NULL DEFAULT 'all',
  hidden_moods INTEGER[] DEFAULT '{5}',
  connection_settings JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS privacy_settings_user_id_idx ON privacy_settings(user_id);

-- Enable row level security
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only view their own privacy settings
DROP POLICY IF EXISTS "Users can view own privacy settings" ON privacy_settings;
CREATE POLICY "Users can view own privacy settings"
  ON privacy_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own privacy settings
DROP POLICY IF EXISTS "Users can update own privacy settings" ON privacy_settings;
CREATE POLICY "Users can update own privacy settings"
  ON privacy_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only insert their own privacy settings
DROP POLICY IF EXISTS "Users can insert own privacy settings" ON privacy_settings;
CREATE POLICY "Users can insert own privacy settings"
  ON privacy_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own privacy settings
DROP POLICY IF EXISTS "Users can delete own privacy settings" ON privacy_settings;
CREATE POLICY "Users can delete own privacy settings"
  ON privacy_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table privacy_settings;
