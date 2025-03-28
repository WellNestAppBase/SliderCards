-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_settings JSONB DEFAULT '{"emailNotifications": true, "pushNotifications": true, "moodUpdates": false, "urgentAlerts": true, "connectionRequests": true, "enableWidget": true, "prioritizeUrgent": true}'::jsonb,
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create mood_history table
CREATE TABLE IF NOT EXISTS mood_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can see their own settings
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own settings
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policies for mood_history
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;

-- Users can see their own mood history
DROP POLICY IF EXISTS "Users can view their own mood history" ON mood_history;
CREATE POLICY "Users can view their own mood history"
  ON mood_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own mood history
DROP POLICY IF EXISTS "Users can insert their own mood history" ON mood_history;
CREATE POLICY "Users can insert their own mood history"
  ON mood_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own mood history
DROP POLICY IF EXISTS "Users can delete their own mood history" ON mood_history;
CREATE POLICY "Users can delete their own mood history"
  ON mood_history FOR DELETE
  USING (auth.uid() = user_id);

-- Tables are already part of the realtime publication
