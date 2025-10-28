import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Moon, Sun, Library, PenTool, Eye, FolderTree, Menu, LogOut, User as UserIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ darkMode, toggleDarkMode, isCollapsed, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const { setSettingsOpen } = useStore();

  const navItems = [
    { path: '/', label: 'Library', icon: Library },
    { path: '/create', label: 'Create', icon: PenTool },
    { path: '/preview', label: 'Preview', icon: Eye },
    { path: '/manage', label: 'Manage Agents', icon: FolderTree },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 flex flex-col ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-claude-orange to-claude-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    Subagent Studio
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    Claude Code Agents
                  </p>
                </div>
              </Link>
            )}
            {isCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-br from-claude-orange to-claude-purple rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-xl">S</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-claude-orange to-claude-purple text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {/* User Profile */}
          <UserProfile isCollapsed={isCollapsed} />

          <button
            onClick={toggleDarkMode}
            className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Toggle dark mode' : undefined}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0" />
            )}
            {!isCollapsed && <span className="font-medium">Dark Mode</span>}
          </button>
          
          <button
            onClick={() => setSettingsOpen(true)}
            className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Settings' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </button>

          <SignOutButton isCollapsed={isCollapsed} />
        </div>
      </aside>

      {/* Collapse/Expand Toggle Button - Desktop only */}
      <button
        onClick={toggleSidebar}
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 items-center justify-center w-6 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md ${
          isCollapsed 
            ? 'left-20 rounded-r-lg' 
            : 'left-64 rounded-r-lg'
        }`}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>
    </>
  );
}

// User Profile Component
function UserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={`flex items-center space-x-3 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg ${
      isCollapsed ? 'justify-center' : ''
    }`}>
      {user.user_metadata?.avatar_url ? (
        <img 
          src={user.user_metadata.avatar_url} 
          alt="Profile" 
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-claude-orange to-claude-purple flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
      )}
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.user_metadata?.user_name || user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
      )}
    </div>
  );
}

// Sign Out Button Component
function SignOutButton({ isCollapsed }: { isCollapsed: boolean }) {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 disabled:opacity-50 ${
        isCollapsed ? 'justify-center' : ''
      }`}
      title={isCollapsed ? 'Sign out' : undefined}
    >
      <LogOut className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span className="font-medium">{loading ? 'Signing out...' : 'Sign Out'}</span>}
    </button>
  );
}
