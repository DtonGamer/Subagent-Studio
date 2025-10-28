import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import PreviewPanel from '../components/PreviewPanel';
import { useStore } from '../store';

export default function PreviewPage() {
  const navigate = useNavigate();
  const { loadDraft, agentConfig } = useStore();

  useEffect(() => {
    // Load draft when component mounts
    loadDraft();
  }, [loadDraft]);

  const handleNavigateToCreate = () => {
    navigate('/create');
  };

  const handleNavigateToLibrary = () => {
    navigate('/');
  };

  const isValid = agentConfig.name && agentConfig.description && agentConfig.systemPrompt;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Preview & Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Review your subagent configuration and download the file
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNavigateToLibrary}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Library</span>
            </button>
            <button
              onClick={handleNavigateToCreate}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {isValid ? (
          <PreviewPanel />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No agent configuration to preview. Please create an agent first.
            </p>
            <button
              onClick={handleNavigateToCreate}
              className="px-6 py-3 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Go to Create Page
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
