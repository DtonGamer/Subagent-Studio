import { useState } from 'react';
import { Download, Copy, Check, Eye, Info, Save, Folder, User } from 'lucide-react';
import { useStore } from '../store';
import { generateMarkdown, downloadMarkdown, copyToClipboard } from '../utils';
import { agentService } from '../services/agentService';
import { AgentType } from '../types';

export default function PreviewPanel() {
  const { agentConfig, addRecentAgent, setAgentConfig } = useStore();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const markdown = generateMarkdown(agentConfig);
  const isValid = agentConfig.name && agentConfig.description && agentConfig.systemPrompt;

  const handleDownload = () => {
    if (!isValid) return;
    downloadMarkdown(agentConfig);
    addRecentAgent(agentConfig);
  };

  const handleCopy = async () => {
    if (!isValid) return;
    await copyToClipboard(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDatabase = async (type: AgentType) => {
    if (!isValid) return;
    
    try {
      setSaving(true);
      const agentToSave = { ...agentConfig, agentType: type };
      
      if (agentConfig.id) {
        await agentService.update(agentConfig.id, agentToSave);
      } else {
        const created = await agentService.create(agentToSave);
        setAgentConfig({ id: created.id });
      }
      
      addRecentAgent(agentToSave);
      setSaved(true);
      setShowTypeSelector(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Failed to save agent to database');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Preview
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Live preview of your markdown file
        </p>
      </div>

      {/* Preview Content */}
      <div className="mb-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
        <pre className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {markdown || '// Your configuration will appear here...'}
        </pre>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Save to Database */}
        {showTypeSelector ? (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select agent type:
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSaveToDatabase('project')}
                disabled={saving}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Folder className="w-4 h-4" />
                <span>Project</span>
              </button>
              <button
                onClick={() => handleSaveToDatabase('user')}
                disabled={saving}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <User className="w-4 h-4" />
                <span>User</span>
              </button>
            </div>
            <button
              onClick={() => setShowTypeSelector(false)}
              className="w-full mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowTypeSelector(true)}
            disabled={!isValid || saving}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                <span>Saved to Database!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{agentConfig.id ? 'Update in Database' : 'Save to Database'}</span>
              </>
            )}
          </button>
        )}

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={!isValid}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>Download {agentConfig.name || 'agent'}.md</span>
        </button>

        <button
          onClick={handleCopy}
          disabled={!isValid}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Where to save:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                  .claude/agents/
                </code>{' '}
                (project-specific)
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-900/40 px-1 py-0.5 rounded">
                  ~/.claude/agents/
                </code>{' '}
                (global)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
