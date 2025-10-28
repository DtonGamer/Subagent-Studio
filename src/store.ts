import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AgentConfig, AppState, GenerationMode, ApiProvider, AI_MODELS } from './types';

const defaultAgent: AgentConfig = {
  name: '',
  description: '',
  systemPrompt: '',
  tools: [],
  model: 'inherit',
  inheritAllTools: false,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      agentConfig: defaultAgent,
      generationMode: 'manual',
      apiProvider: 'gemini',
      geminiApiKey: '',
      claudeApiKey: '',
      openRouterApiKey: '',
      selectedAiModel: AI_MODELS.gemini[0].id, // Default to Gemini 2.5 Flash
      recentAgents: [],
      isSettingsOpen: false,
      isGenerating: false,
      draftAgent: null,

      setAgentConfig: (config) =>
        set((state) => ({
          agentConfig: { ...state.agentConfig, ...config },
        })),

      setGenerationMode: (mode: GenerationMode) =>
        set({ generationMode: mode }),

      setApiProvider: (provider: ApiProvider) =>
        set({ apiProvider: provider }),

      setGeminiApiKey: (key: string) =>
        set({ geminiApiKey: key }),

      setClaudeApiKey: (key: string) =>
        set({ claudeApiKey: key }),

      setOpenRouterApiKey: (key: string) =>
        set({ openRouterApiKey: key }),

      setSelectedAiModel: (model: string) =>
        set({ selectedAiModel: model }),

      addRecentAgent: (agent: AgentConfig) =>
        set((state) => {
          const filtered = state.recentAgents.filter(
            (a) => a.name !== agent.name
          );
          return {
            recentAgents: [agent, ...filtered].slice(0, 10),
          };
        }),

      loadAgent: (agent: AgentConfig) =>
        set({ agentConfig: { ...agent } }),

      resetAgent: () =>
        set({ agentConfig: defaultAgent }),

      setSettingsOpen: (open: boolean) =>
        set({ isSettingsOpen: open }),

      setGenerating: (generating: boolean) =>
        set({ isGenerating: generating }),

      saveDraft: () => {
        const { agentConfig } = get();
        set({ draftAgent: { ...agentConfig } });
      },

      loadDraft: () => {
        const { draftAgent } = get();
        if (draftAgent) {
          set({ agentConfig: { ...draftAgent } });
        }
      },

      clearDraft: () =>
        set({ draftAgent: null }),
    }),
    {
      name: 'claude-subagent-storage',
      partialize: (state) => ({
        apiProvider: state.apiProvider,
        geminiApiKey: state.geminiApiKey,
        claudeApiKey: state.claudeApiKey,
        openRouterApiKey: state.openRouterApiKey,
        selectedAiModel: state.selectedAiModel,
        recentAgents: state.recentAgents,
        draftAgent: state.draftAgent,
      }),
    }
  )
);
