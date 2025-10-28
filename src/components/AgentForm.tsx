import { useState } from 'react';
import { Sparkles, AlertCircle, List, CheckCircle, Loader } from 'lucide-react';
import { useStore } from '../store';
import { AVAILABLE_TOOLS, MODELS } from '../types';
import { formatAgentName, generateWithAI, validateConfig, parseApiError, generateAgentsIntelligently } from '../utils';

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
  const [generationStrategy, setGenerationStrategy] = useState<'intelligent' | 'single' | 'manual-batch'>('intelligent');
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
      if (generationStrategy === 'intelligent') {
        // AI decides: one agent or multiple?
        const generatedAgents = await generateAgentsIntelligently(aiDescription, apiKey, apiProvider, selectedAiModel);
        
        if (generatedAgents.length === 1) {
          // Single agent - load it into the form
          setAgentConfig(generatedAgents[0]);
          setGenerationMode('manual');
          setErrors([`✅ Created 1 agent: ${generatedAgents[0].name}`]);
        } else {
          // Multiple agents - show success message
          setErrors([
            `✅ Created ${generatedAgents.length} specialized agents:`,
            ...generatedAgents.map(a => `  • ${a.name}`),
            '',
            'The first agent has been loaded. Save it, then create the others from the list above.'
          ]);
          setAgentConfig(generatedAgents[0]);
          setGenerationMode('manual');
          
          // Store other agents for later (you could save to database here)
          console.log('Generated agents:', generatedAgents);
        }
      } else if (generationStrategy === 'single') {
        // Force single agent generation
        const generated = await generateWithAI(aiDescription, apiKey, apiProvider, selectedAiModel);
        setAgentConfig(generated);
        setGenerationMode('manual');
        setErrors([`✅ Created 1 agent: ${generated.name}`]);
      }
      setAiDescription('');
    } catch (error) {
      const friendlyError = parseApiError(error);
      setErrors([friendlyError]);
    } finally {
      setGenerating(false);
    }
  };

  const handleBatchGenerate = async () => {
    const apiKey = apiProvider === 'gemini' ? geminiApiKey : apiProvider === 'claude' ? claudeApiKey : openRouterApiKey;
    const providerName = apiProvider === 'gemini' ? 'Gemini' : apiProvider === 'claude' ? 'Claude' : 'OpenRouter';
    
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

      // Add delay between requests to avoid rate limiting
      if (i < descriptions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setGenerating(false);

    // Show results
    if (generatedAgents.length > 0) {
      setErrors([
        `✅ Successfully generated ${generatedAgents.length} / ${descriptions.length} agents`,
        ...generatedAgents.map(a => `  • ${a.name}`),
        '',
        batchProgress?.failed.length ? '❌ Failed:' : '',
        ...(batchProgress?.failed || []),
      ].filter(Boolean));
      
      // Load first agent
      setAgentConfig(generatedAgents[0]);
      setGenerationMode('manual');
      console.log('All generated agents:', generatedAgents);
    } else {
      setErrors(['❌ Failed to generate any agents. Please check your API key and try again.']);
    }

    // Keep progress visible for 3 seconds
    setTimeout(() => setBatchProgress(null), 3000);
  };

  const handleValidate = () => {
    const validationErrors = validateConfig(agentConfig);
    setErrors(validationErrors);
  };

  return (
    <div className="space-y-6">
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
          {/* Generation Strategy Selection */}
          <div className="p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg border border-purple-200 dark:border-purple-800">
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
              How should AI generate agents?
            </label>
            <div className="space-y-2">
              {/* Intelligent Mode */}
              <label className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-white/50 dark:hover:bg-gray-700/50 ${
                generationStrategy === 'intelligent'
                  ? 'border-purple-500 bg-white dark:bg-gray-800 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600'
              }`}>
                <input
                  type="radio"
                  name="generation-strategy"
                  value="intelligent"
                  checked={generationStrategy === 'intelligent'}
                  onChange={(e) => setGenerationStrategy(e.target.value as any)}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">🧠 Intelligent (Recommended)</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    AI analyzes your description and decides whether to create 1 comprehensive agent or multiple specialized agents
                  </div>
                </div>
              </label>

              {/* Single Agent Mode */}
              <label className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-white/50 dark:hover:bg-gray-700/50 ${
                generationStrategy === 'single'
                  ? 'border-purple-500 bg-white dark:bg-gray-800 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600'
              }`}>
                <input
                  type="radio"
                  name="generation-strategy"
                  value="single"
                  checked={generationStrategy === 'single'}
                  onChange={(e) => setGenerationStrategy(e.target.value as any)}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">📄 Single Agent</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Always create just 1 comprehensive agent, regardless of complexity
                  </div>
                </div>
              </label>

              {/* Manual Batch Mode */}
              <label className={`flex items-start space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-white/50 dark:hover:bg-gray-700/50 ${
                generationStrategy === 'manual-batch'
                  ? 'border-purple-500 bg-white dark:bg-gray-800 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600'
              }`}>
                <input
                  type="radio"
                  name="generation-strategy"
                  value="manual-batch"
                  checked={generationStrategy === 'manual-batch'}
                  onChange={(e) => setGenerationStrategy(e.target.value as any)}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white flex items-center">
                    <List className="w-4 h-4 mr-1" />
                    Multiple Agents (Manual List)
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Provide separate descriptions (one per line, max 10) - each becomes its own agent
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Description Input - changes based on strategy */}
          {generationStrategy === 'manual-batch' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agent Descriptions (one per line)
              </label>
              <textarea
                value={batchDescriptions}
                onChange={(e) => setBatchDescriptions(e.target.value)}
                placeholder="Python code reviewer&#10;JavaScript debugger&#10;SQL query optimizer&#10;..."  
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                rows={8}
                disabled={isGenerating}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {batchDescriptions.split('\n').filter(d => d.trim()).length} / 10 agents
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Describe what you want the agent(s) to do
              </label>
              <textarea
                value={aiDescription}
                onChange={(e) => setAiDescription(e.target.value)}
                placeholder={generationStrategy === 'intelligent' 
                  ? "Describe your project or task in detail. AI will decide if you need 1 agent or multiple specialized agents...\n\nExample: 'Complete my RAG Book project with edge functions, worker stability, payment integration, and admin panel'" 
                  : "Describe the agent you want to create...\n\nExample: 'A code reviewer that checks Python code for security issues and best practices'"
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={8}
                disabled={isGenerating}
              />
            </div>
          )}

          {/* Batch Progress */}
          {batchProgress && generationStrategy === 'manual-batch' && (
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

          {/* Generate Button */}
          <button
            onClick={generationStrategy === 'manual-batch' ? handleBatchGenerate : handleGenerateWithAI}
            disabled={isGenerating || (generationStrategy === 'manual-batch' ? !batchDescriptions.trim() : !aiDescription.trim())}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-claude-purple to-claude-orange text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  {generationStrategy === 'manual-batch' ? 'Generate All Agents' : 'Generate with AI'}
                </span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Manual Mode */
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
              placeholder="my-agent"
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
              placeholder="When should this agent be invoked?"
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

          {/* Tools */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tools
              </label>
              <button
                onClick={() => setAgentConfig({ inheritAllTools: !agentConfig.inheritAllTools })}
                className="text-xs text-claude-orange hover:underline"
              >
                {agentConfig.inheritAllTools ? 'Select specific tools' : 'Inherit all tools'}
              </button>
            </div>
            {!agentConfig.inheritAllTools && (
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_TOOLS.map((tool) => (
                  <label
                    key={tool}
                    className="flex items-center space-x-2 p-2 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={agentConfig.tools.includes(tool)}
                      onChange={() => handleToolToggle(tool)}
                      className="rounded text-claude-orange focus:ring-claude-orange"
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Validate Configuration
          </button>
        </div>
      )}
    </div>
  );
}
