export type AgentType = 'project' | 'user';

export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[];
  model: string;
  inheritAllTools: boolean;
  agentType?: AgentType;
  createdAt?: string;
  updatedAt?: string;
}

export type GenerationMode = 'manual' | 'ai';
export type ApiProvider = 'gemini' | 'claude' | 'openrouter';

// AI Models for generation
export const AI_MODELS = {
  gemini: [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', recommended: true },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  ],
  claude: [
    { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5', recommended: true },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    { id: 'claude-opus-4-1-20250805', name: 'Claude Opus 4.1' },
    { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
  ],
  openrouter: [
    { id: 'anthropic/claude-sonnet-4-5', name: 'Claude Sonnet 4.5', recommended: true },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder (Free)', recommended: true },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
    { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
  ],
} as const;

export interface AppState {
  agentConfig: AgentConfig;
  generationMode: GenerationMode;
  apiProvider: ApiProvider;
  geminiApiKey: string;
  claudeApiKey: string;
  openRouterApiKey: string;
  selectedAiModel: string;
  recentAgents: AgentConfig[];
  isSettingsOpen: boolean;
  isGenerating: boolean;
  draftAgent: AgentConfig | null;
  setAgentConfig: (config: Partial<AgentConfig>) => void;
  setGenerationMode: (mode: GenerationMode) => void;
  setApiProvider: (provider: ApiProvider) => void;
  setGeminiApiKey: (key: string) => void;
  setClaudeApiKey: (key: string) => void;
  setOpenRouterApiKey: (key: string) => void;
  setSelectedAiModel: (model: string) => void;
  addRecentAgent: (agent: AgentConfig) => void;
  loadAgent: (agent: AgentConfig) => void;
  resetAgent: () => void;
  setSettingsOpen: (open: boolean) => void;
  setGenerating: (generating: boolean) => void;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
}

export const AVAILABLE_TOOLS = [
  'Read',
  'Write',
  'Edit',
  'Bash',
  'Glob',
  'Grep',
  'Browser',
  'Computer',
  'ListDir',
  'Delete',
  'Move',
  'MCP'
];

export const MODELS = ['inherit', 'sonnet', 'opus', 'haiku', 'qwen-coder'];
