import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, User, Trash2, Edit, Download, Plus } from 'lucide-react';
import { agentService } from '../services/agentService';
import { AgentConfig } from '../types';
import { useStore } from '../store';
import { generateMarkdown } from '../utils';

export default function ManageAgentsPage() {
  const navigate = useNavigate();
  const { loadAgent } = useStore();
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'project' | 'user'>('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await agentService.getAll();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      await agentService.delete(id);
      setAgents(agents.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Failed to delete agent');
    }
  };

  const handleEdit = (agent: AgentConfig) => {
    loadAgent(agent);
    navigate('/create');
  };

  const handleDownload = (agent: AgentConfig) => {
    const markdown = generateMarkdown(agent);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAgents = agents.filter(agent => {
    if (filter === 'all') return true;
    return agent.agentType === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Manage Agents
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              View, edit, and organize your subagents
            </p>
          </div>
          <button
            onClick={() => navigate('/create')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Agent</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gradient-to-r from-claude-orange to-claude-purple text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Agents ({agents.length})
          </button>
          <button
            onClick={() => setFilter('project')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'project'
                ? 'bg-gradient-to-r from-claude-orange to-claude-purple text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <Folder className="w-4 h-4" />
              <span>Project ({agents.filter(a => a.agentType === 'project').length})</span>
            </span>
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === 'user'
                ? 'bg-gradient-to-r from-claude-orange to-claude-purple text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center justify-center space-x-2">
              <User className="w-4 h-4" />
              <span>User ({agents.filter(a => a.agentType === 'user').length})</span>
            </span>
          </button>
        </div>

        {/* Agents List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-claude-orange"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading agents...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filter === 'all' 
                ? 'No agents found. Create your first agent to get started!'
                : `No ${filter} agents found.`}
            </p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-3 bg-gradient-to-r from-claude-orange to-claude-purple text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Create Agent
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {agent.name}
                      </h3>
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agent.agentType === 'project'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {agent.agentType === 'project' ? (
                          <><Folder className="w-3 h-3" /> <span>Project</span></>
                        ) : (
                          <><User className="w-3 h-3" /> <span>User</span></>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {agent.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                      <span>Model: {agent.model}</span>
                      <span>•</span>
                      <span>
                        {agent.inheritAllTools 
                          ? 'All tools' 
                          : `${agent.tools.length} tools`}
                      </span>
                      {agent.updatedAt && (
                        <>
                          <span>•</span>
                          <span>Updated {new Date(agent.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleDownload(agent)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleEdit(agent)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => agent.id && deleteAgent(agent.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
