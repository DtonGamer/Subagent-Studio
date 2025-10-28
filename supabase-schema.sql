-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  tools TEXT[] DEFAULT '{}',
  model TEXT DEFAULT 'inherit',
  inherit_all_tools BOOLEAN DEFAULT false,
  agent_type TEXT CHECK (agent_type IN ('project', 'user')) DEFAULT 'user',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID
);

-- Create index on agent_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_agents_type ON agents(agent_type);

-- Create index on updated_at for sorting
CREATE INDEX IF NOT EXISTS idx_agents_updated ON agents(updated_at DESC);

-- Create index on user_id for user-specific queries
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow all operations on agents" ON agents;
DROP POLICY IF EXISTS "Users can view their own agents" ON agents;
DROP POLICY IF EXISTS "Users can insert their own agents" ON agents;
DROP POLICY IF EXISTS "Users can update their own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete their own agents" ON agents;

-- RLS Policies: Users can only access their own agents
CREATE POLICY "Users can view their own agents" ON agents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" ON agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" ON agents
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" ON agents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
