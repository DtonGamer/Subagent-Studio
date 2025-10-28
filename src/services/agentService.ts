import { supabase } from '../lib/supabase';
import { AgentConfig } from '../types';

// Helper to get current user ID
async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
}

export interface DbAgent {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  system_prompt: string;
  tools: string[];
  model: string;
  inherit_all_tools: boolean;
  agent_type: 'project' | 'user';
  user_id: string | null;
  project_id: string | null;
}

export const agentService = {
  async getAll(): Promise<AgentConfig[]> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return (data as DbAgent[] || []).map(this.mapFromDb);
  },

  async getById(id: string): Promise<AgentConfig | null> {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? this.mapFromDb(data as DbAgent) : null;
  },

  async create(agent: AgentConfig): Promise<AgentConfig> {
    const userId = await getCurrentUserId();
    const dbAgent = { ...this.mapToDb(agent), user_id: userId };
    const { data, error } = await supabase
      .from('agents')
      .insert([dbAgent as any])
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data as DbAgent);
  },

  async update(id: string, agent: Partial<AgentConfig>): Promise<AgentConfig> {
    const dbAgent = this.mapToDb(agent as AgentConfig);
    const updateData = { ...dbAgent, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from('agents')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapFromDb(data as DbAgent);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  mapFromDb(dbAgent: DbAgent): AgentConfig {
    return {
      id: dbAgent.id,
      name: dbAgent.name,
      description: dbAgent.description,
      systemPrompt: dbAgent.system_prompt,
      tools: dbAgent.tools,
      model: dbAgent.model,
      inheritAllTools: dbAgent.inherit_all_tools,
      agentType: dbAgent.agent_type,
      createdAt: dbAgent.created_at,
      updatedAt: dbAgent.updated_at,
    };
  },

  mapToDb(agent: AgentConfig): Partial<DbAgent> {
    return {
      name: agent.name,
      description: agent.description,
      system_prompt: agent.systemPrompt,
      tools: agent.tools,
      model: agent.model,
      inherit_all_tools: agent.inheritAllTools,
      agent_type: agent.agentType || 'user',
    };
  },
};
