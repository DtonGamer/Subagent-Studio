import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import AgentForm from '../components/AgentForm';
import { useStore } from '../store';

export default function CreatePage() {
  const navigate = useNavigate();
  const { loadDraft, saveDraft, agentConfig } = useStore();

  useEffect(() => {
    // Load draft when component mounts
    loadDraft();
  }, [loadDraft]);

  const handleNavigateToPreview = () => {
    saveDraft();
    navigate('/preview');
  };

  const handleNavigateToLibrary = () => {
    saveDraft();
    navigate('/');
  };

  const isValid = agentConfig.name && agentConfig.description && agentConfig.systemPrompt;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Subagent
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your subagent manually or use AI generation
            </p>
          </div>
          <button
            onClick={handleNavigateToLibrary}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Library</span>
          </button>
        </div>

        <AgentForm />

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNavigateToPreview}
            disabled={!isValid}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Preview & Export</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
