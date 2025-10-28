import { useState } from 'react';
import { Sparkles, AlertCircle, List, CheckCircle, Loader } from 'lucide-react';
import { useStore } from '../store';
import { AVAILABLE_TOOLS, MODELS } from '../types';
import { formatAgentName, generateWithAI, validateConfig, parseApiError } from '../utils';

export default function AgentForm() {
  const {
    agentConfig,
    setAgentConfig,
    generationMode,
    setGenerationMode,
    apiProvider,
    geminiApiKey,
    claudeApiKey,
    openRouterApiKey,
    selectedAiModel,
    isGenerating,
    setGenerating,
  } = useStore();

  const [aiDescription, setAiDescription] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchDescriptions, setBatchDescriptions] = useState('');
  const [batchProgress, setBatchProgress] = useState<{
    total: number;
    current: number;
    completed: string[];
    failed: string[];
  } | null>(null);

  const handleNameChange = (value: string) => {
    const formatted = formatAgentName(value);
    setAgentConfig({ name: formatted });
  };

  const handleToolToggle = (tool: string) => {
    const newTools = agentConfig.tools.includes(tool)
      ? agentConfig.tools.filter((t) => t !== tool)
      : [...agentConfig.tools, tool];
    setAgentConfig({ tools: newTools });
  };

  const handleGenerateWithAI = async () => {
    const apiKey = apiProvider === 'gemini' ? geminiApiKey : apiProvider === 'claude' ? claudeApiKey : openRouterApiKey;
    const providerName = apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : 'OpenRouter';
    
    if (!apiKey) {
      setErrors([`Please set your ${providerName} API key in settings`]);
      return;
    }

    if (!aiDescription.trim()) {
      setErrors(['Please enter a description for the AI to generate']);
      return;
    }

    setGenerating(true);
    setErrors([]);

    try {
      const generated = await generateWithAI(aiDescription, apiKey, apiProvider, selectedAiModel);
      setAgentConfig(generated);
      setGenerationMode('manual');
      setAiDescription('');
    } catch (error) {
      // Use the friendly error parser
      const friendlyError = parseApiError(error);
      setErrors([friendlyError]);
    } finally {
      setGenerating(false);
    }
  };

  const handleBatchGenerate = async () => {
    const apiKey = apiProvider === 'gemini' ? geminiApiKey : claudeApiKey;
    const providerName = apiProvider === 'gemini' ? 'Gemini' : 'Claude';
    
    if (!apiKey) {
      setErrors([`Please set your ${providerName} API key in settings`]);
      return;
    }

    // Split descriptions by newlines and filter empty lines
    const descriptions = batchDescriptions
      .split('\n')
      .map(d => d.trim())
      .filter(d => d.length > 0);

    if (descriptions.length === 0) {
      setErrors(['Please enter at least one agent description']);
      return;
    }

    if (descriptions.length > 10) {
      setErrors(['Maximum 10 agents per batch. Please reduce the number of descriptions.']);
      return;
    }

    setGenerating(true);
    setErrors([]);
    setBatchProgress({
      total: descriptions.length,
      current: 0,
      completed: [],
      failed: [],
    });

    const generatedAgents: any[] = [];

    for (let i = 0; i < descriptions.length; i++) {
      const description = descriptions[i];
      setBatchProgress(prev => prev ? { ...prev, current: i + 1 } : null);

      try {
        const generated = await generateWithAI(description, apiKey, apiProvider, selectedAiModel);
        generatedAgents.push(generated);
        setBatchProgress(prev => prev ? {
          ...prev,
          completed: [...prev.completed, generated.name],
        } : null);
      } catch (error) {
        const friendlyError = parseApiError(error);
        setBatchProgress(prev => prev ? {
          ...prev,
          failed: [...prev.failed, `Agent ${i + 1}: ${friendlyError}`],
        } : null);
      }

      // Small delay between requests to avoid rate limiting
      if (i < descriptions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setGenerating(false);

    // Show results
    if (generatedAgents.length > 0) {
      // Load the first generated agent into the form
      setAgentConfig(generatedAgents[0]);
      setGenerationMode('manual');
      setBatchDescriptions('');
      
      // Show success message
      const successMsg = `✅ Successfully generated ${generatedAgents.length} agent(s)!`;
      const failedMsg = batchProgress?.failed.length ? `\n\n⚠️ Failed: ${batchProgress.failed.length}` : '';
      setErrors([successMsg + failedMsg]);
    } else {
      setErrors(['❌ Failed to generate any agents. Please check your descriptions and try again.']);
    }

    // Clear progress after 3 seconds
    setTimeout(() => setBatchProgress(null), 3000);
  };

  const handleValidate = () => {
    const validationErrors = validateConfig(agentConfig);
    setErrors(validationErrors);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Agent Configuration
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a custom subagent or use AI to generate one
        </p>
      </div>

      {/* Generation Mode Toggle */}
      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setGenerationMode('manual')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              generationMode === 'manual'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setGenerationMode('ai')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
              generationMode === 'ai'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Generated</span>
          </button>
        </div>
      </div>

      {/* Error/Success Display */}
      {errors.length > 0 && (
        <div className={`mb-4 p-3 rounded-lg border ${
          errors[0].startsWith('✅') 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start space-x-2">
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              errors[0].startsWith('✅')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`} />
            <div className="flex-1">
              {errors.map((error, index) => (
                <p key={index} className={`text-sm whitespace-pre-line ${
                  errors[0].startsWith('✅')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {error}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Mode */}
      {generationMode === 'ai' ? (
        <div className="space-y-4">
          {/* Batch Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Batch Mode
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (Generate multiple agents)
              </span>
            </div>
            <button
              onClick={() => setBatchMode(!batchMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                batchMode ? 'bg-claude-orange' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  batchMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Single Agent Mode */}
          {!batchMode ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe your subagent
                </label>
                <textarea
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="E.g., I need a subagent that reviews Python code for security vulnerabilities and suggests improvements..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={6}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {aiDescription.length} characters
                </p>
              </div>
              <button
                onClick={handleGenerateWithAI}
                disabled={isGenerating || !aiDescription.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-claude-purple to-claude-orange text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </>
          ) : (
            /* Batch Mode */
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agent Descriptions (one per line, max 10)
                </label>
                <textarea
                  value={batchDescriptions}
                  onChange={(e) => setBatchDescriptions(e.target.value)}
                  placeholder="Code reviewer for Python with security focus
Debugger specialized in React applications
Data scientist for SQL query optimization
..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                  rows={8}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {batchDescriptions.split('\n').filter(d => d.trim()).length} agent(s) • Max 10
                </p>
              </div>

              {/* Batch Progress */}
              {batchProgress && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      Generating agents...
                    </span>
                    <span className="text-sm text-blue-700 dark:text-blue-400">
                      {batchProgress.current} / {batchProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    />
                  </div>
                  {batchProgress.completed.length > 0 && (
                    <div className="space-y-1">
                      {batchProgress.completed.map((name, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs text-green-700 dark:text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleBatchGenerate}
                disabled={isGenerating || !batchDescriptions.trim()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-claude-purple to-claude-orange text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating {batchProgress?.current || 0} of {batchProgress?.total || 0}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate All Agents</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      ) : (
        /* Manual Entry Mode */
        <div className="space-y-4">
          {/* Agent Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={agentConfig.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="my-agent-name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Lowercase letters, numbers, and hyphens only
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={agentConfig.description}
              onChange={(e) => setAgentConfig({ description: e.target.value })}
              placeholder="Clear description of when this subagent should be invoked..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {agentConfig.description.length} / 20 min characters
            </p>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              System Prompt *
            </label>
            <textarea
              value={agentConfig.systemPrompt}
              onChange={(e) => setAgentConfig({ systemPrompt: e.target.value })}
              placeholder="Detailed instructions for the agent..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={8}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {agentConfig.systemPrompt.length} / 50 min characters
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <select
              value={agentConfig.model}
              onChange={(e) => setAgentConfig({ model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {MODELS.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Tools Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tools
            </label>
            <div className="mb-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agentConfig.inheritAllTools}
                  onChange={(e) => setAgentConfig({ inheritAllTools: e.target.checked, tools: [] })}
                  className="rounded border-gray-300 text-claude-orange focus:ring-claude-orange"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Inherit all tools (recommended)
                </span>
              </label>
            </div>
            {!agentConfig.inheritAllTools && (
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TOOLS.map((tool) => (
                  <label key={tool} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agentConfig.tools.includes(tool)}
                      onChange={() => handleToolToggle(tool)}
                      className="rounded border-gray-300 text-claude-orange focus:ring-claude-orange"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{tool}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Validate Button */}
          <button
            onClick={handleValidate}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Validate Configuration
          </button>
        </div>
      )}
    </div>
  );
}
