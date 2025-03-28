-- Create connection_requests table
CREATE TABLE IF NOT EXISTS connection_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sender_id, recipient_id)
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, connection_id)
);

-- Create RLS policies for connection_requests
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

-- Users can see their own sent or received requests
DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;
CREATE POLICY "Users can view their own connection requests"
  ON connection_requests FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can insert their own requests
DROP POLICY IF EXISTS "Users can insert their own connection requests" ON connection_requests;
CREATE POLICY "Users can insert their own connection requests"
  ON connection_requests FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update requests they've received
DROP POLICY IF EXISTS "Users can update connection requests they've received" ON connection_requests;
CREATE POLICY "Users can update connection requests they've received"
  ON connection_requests FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Create RLS policies for connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Users can see their own connections
DROP POLICY IF EXISTS "Users can view their own connections" ON connections;
CREATE POLICY "Users can view their own connections"
  ON connections FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own connections
DROP POLICY IF EXISTS "Users can insert their own connections" ON connections;
CREATE POLICY "Users can insert their own connections"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own connections
DROP POLICY IF EXISTS "Users can delete their own connections" ON connections;
CREATE POLICY "Users can delete their own connections"
  ON connections FOR DELETE
  USING (auth.uid() = user_id);

-- Tables are already part of the realtime publication
