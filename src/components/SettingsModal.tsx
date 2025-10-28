import { useState } from 'react';
import { X, Key, Save, Sparkles, Zap, Brain, Network } from 'lucide-react';
import { useStore } from '../store';
import { AI_MODELS } from '../types';

export default function SettingsModal() {
  const { 
    apiProvider, 
    geminiApiKey, 
    claudeApiKey,
    openRouterApiKey,
    selectedAiModel,
    setApiProvider,
    setGeminiApiKey, 
    setClaudeApiKey,
    setOpenRouterApiKey,
    setSelectedAiModel,
    setSettingsOpen 
  } = useStore();
  
  const [provider, setProvider] = useState(apiProvider);
  const [geminiKey, setGeminiKey] = useState(geminiApiKey);
  const [claudeKey, setClaudeKey] = useState(claudeApiKey);
  const [openRouterKey, setOpenRouterKey] = useState(openRouterApiKey);
  const [aiModel, setAiModel] = useState(selectedAiModel);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiProvider(provider);
    setGeminiApiKey(geminiKey);
    setClaudeApiKey(claudeKey);
    setOpenRouterApiKey(openRouterKey);
    setSelectedAiModel(aiModel);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSettingsOpen(false);
    }, 1000);
  };

  // Get available models for current provider
  const availableModels = AI_MODELS[provider] || [];

  // Update model when provider changes
  const handleProviderChange = (newProvider: typeof provider) => {
    setProvider(newProvider);
    // Set to first model of new provider
    const models = AI_MODELS[newProvider] || [];
    if (models.length > 0) {
      setAiModel(models[0].id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* API Provider Selection */}
          <div className="border-2 border-claude-orange/20 dark:border-claude-orange/30 rounded-lg p-4 bg-gradient-to-br from-orange-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-claude-orange" />
              Choose Your AI Provider
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Select which AI service to use for generating agents
            </p>
            <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => handleProviderChange('gemini')}
                className={`py-3 px-3 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  provider === 'gemini'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md ring-2 ring-claude-orange'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>Gemini</span>
              </button>
              <button
                onClick={() => handleProviderChange('claude')}
                className={`py-3 px-3 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  provider === 'claude'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md ring-2 ring-claude-orange'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Claude</span>
              </button>
              <button
                onClick={() => handleProviderChange('openrouter')}
                className={`py-3 px-3 rounded-md text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  provider === 'openrouter'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md ring-2 ring-claude-orange'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Network className="w-5 h-5" />
                <span>OpenRouter</span>
              </button>
            </div>
          </div>

          {/* AI Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              AI Model
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {'recommended' in model && model.recommended ? ' ⭐' : ''}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Model used for AI-generated agents
            </p>
          </div>

          {/* Gemini API Key */}
          {provider === 'gemini' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-claude-orange hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          )}

          {/* OpenRouter API Key */}
          {provider === 'openrouter' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Key className="w-4 h-4 mr-1" />
                OpenRouter API Key
              </label>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Get your key from{' '}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-claude-orange hover:underline"
                >
                  openrouter.ai/keys
                </a>
              </p>
            </div>
          )}

          {/* Claude API Key */}
          {provider === 'claude' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Key className="w-4 h-4 mr-2" />
                Claude API Key
              </label>
              <input
                type="password"
                value={claudeKey}
                onChange={(e) => setClaudeKey(e.target.value)}
                placeholder="Enter your Claude API key"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-claude-orange focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-claude-orange hover:underline"
                >
                  Anthropic Console
                </a>
              </p>
            </div>
          )}

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              Your API key is stored locally in your browser and only sent to the selected AI provider's API.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => setSettingsOpen(false)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
          >
            {saved ? (
              <>
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
