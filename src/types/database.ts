export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          system_prompt: string
          tools: string[]
          model: string
          inherit_all_tools: boolean
          agent_type: 'project' | 'user'
          user_id: string | null
          project_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          system_prompt: string
          tools?: string[]
          model?: string
          inherit_all_tools?: boolean
          agent_type: 'project' | 'user'
          user_id?: string | null
          project_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          system_prompt?: string
          tools?: string[]
          model?: string
          inherit_all_tools?: boolean
          agent_type?: 'project' | 'user'
          user_id?: string | null
          project_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
