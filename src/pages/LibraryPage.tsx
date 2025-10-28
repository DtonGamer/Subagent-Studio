import React from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateLibrary from '../components/TemplateLibrary';
import { useStore } from '../store';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { saveDraft } = useStore();

  const handleNavigateToCreate = () => {
    saveDraft();
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Subagent Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose from templates or recent agents, or create a new one from scratch
          </p>
        </div>

        <TemplateLibrary />

        <div className="mt-8 text-center">
          <button
            onClick={handleNavigateToCreate}
            className="px-6 py-3 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Start Creating →
          </button>
        </div>
      </main>
    </div>
  );
}
