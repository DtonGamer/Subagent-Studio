import React from 'react';
import { FileText, Plus, Clock } from 'lucide-react';
import { useStore } from '../store';
import { templates } from '../templates';

export default function TemplateLibrary() {
  const { loadAgent, resetAgent, recentAgents } = useStore();

  return (
    <div className="space-y-4">
      {/* New Agent Button */}
      <button
        onClick={resetAgent}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        <Plus className="w-5 h-5" />
        <span>New Agent</span>
      </button>

      {/* Templates Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Templates
        </h2>
        <div className="space-y-2">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() => loadAgent(template)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-claude-orange transition-colors">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {template.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Agents Section */}
      {recentAgents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent
          </h2>
          <div className="space-y-2">
            {recentAgents.slice(0, 5).map((agent, index) => (
              <button
                key={`${agent.name}-${index}`}
                onClick={() => loadAgent(agent)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-claude-orange transition-colors">
                  {agent.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {agent.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
