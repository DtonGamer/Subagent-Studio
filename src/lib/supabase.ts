import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Using generic client without strict typing to avoid type conflicts
// The agentService handles type mapping between DB and app types
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
