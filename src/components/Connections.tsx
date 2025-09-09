import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Ticket, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Loader2,
  Calendar,
  Users,
  Cloud,
  FileText,
  Video,
  Share2,
  BookOpen,
  Database,
  Monitor
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ConnectionStatus {
  connected: boolean;
  email?: string;
  expiresAt?: string;
  lastSync?: string;
  error?: string;
}

interface Provider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  customIcon?: string; // Path to custom icon image
  color: string;
  bgColor: string;
  hoverColor: string;
  services: string[];
  description: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: Mail,
    customIcon: '/images/gmail-icon.png',
    color: 'red',
    bgColor: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    services: ['Emails', 'Labels', 'Filters'],
    description: 'Access and manage your Gmail emails with this'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: Cloud,
    customIcon: '/images/google-drive-icon.png',
    color: 'blue',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    services: ['Files', 'Folders', 'Sharing'],
    description: 'Access and manage your Google Drive files with this'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    icon: FileText,
    customIcon: '/images/google-docs-icon.png',
    color: 'green',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    services: ['Documents', 'Collaboration', 'Templates'],
    description: 'Create and edit Google Docs documents with this'
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: Database,
    customIcon: '/images/google-sheets-icon.png',
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    services: ['Spreadsheets', 'Formulas', 'Charts'],
    description: 'Create and manage Google Sheets spreadsheets with this'
  },
  {
    id: 'google-chat',
    name: 'Google Chat',
    icon: MessageSquare,
    customIcon: '/images/google-chat-icon.png',
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    services: ['Chats', 'Rooms', 'Direct Messages'],
    description: 'Connect to Google Chat conversations with this'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    icon: Calendar,
    customIcon: '/images/google-calendar-icon.png',
    color: 'green',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    services: ['Events', 'Scheduling', 'Meetings'],
    description: 'Access and manage your Google Calendar events with this'
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: Mail,
    customIcon: '/images/outlook-icon.png',
    color: 'blue',
    bgColor: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    services: ['Email', 'Calendar', 'Contacts'],
    description: 'Access Outlook emails and calendar with this'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: Video,
    customIcon: '/images/teams-icon.png',
    color: 'indigo',
    bgColor: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    services: ['Chats', 'Channels', 'Meetings'],
    description: 'Connect to Teams chats and channels with this'
  },
  {
    id: 'sharepoint',
    name: 'SharePoint',
    icon: Share2,
    customIcon: '/images/sharepoint-icon.png',
    color: 'cyan',
    bgColor: 'bg-cyan-500',
    hoverColor: 'hover:bg-cyan-600',
    services: ['Documents', 'Lists', 'Sites'],
    description: 'Access SharePoint documents and sites with this'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    customIcon: '/images/slack-icon.png',
    color: 'green',
    bgColor: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    services: ['Channels', 'Messages', 'Users'],
    description: 'Connect to Slack workspaces and channels'
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: Ticket,
    customIcon: '/images/jira-icon.png',
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    services: ['Issues', 'Projects', 'Boards'],
    description: 'Manage projects, issues, and workflows with this'
  },
  {
    id: 'confluence',
    name: 'Confluence',
    icon: BookOpen,
    customIcon: '/images/confluence-icon.png',
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    hoverColor: 'hover:bg-emerald-600',
    services: ['Pages', 'Spaces', 'Content'],
    description: 'Access Confluence documentation and spaces'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: FileText,
    customIcon: '/images/notion-icon.png',
    color: 'gray',
    bgColor: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-700',
    services: ['Pages', 'Databases', 'Workspaces'],
    description: 'Connect to Notion workspaces and databases'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Users,
    customIcon: '/images/github-icon.png',
    color: 'slate',
    bgColor: 'bg-slate-600',
    hoverColor: 'hover:bg-slate-700',
    services: ['Repositories', 'Issues', 'Actions'],
    description: 'Access GitHub repositories and workflows'
  }
];

const API_BASE_URL = 'http://127.0.0.1:8081';

export function Connections() {
  const { resolvedTheme } = useTheme();
  const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [error, setError] = useState('');
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  // Check authentication status for all providers
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/tokens/list`);
      if (!response.ok) {
        throw new Error('Failed to fetch auth status');
      }
      
      const data = await response.json();
      const users = data.users || [];
      
      const connected: Record<string, ConnectionStatus> = {};
      
      users.forEach((user: any) => {
        const provider = user.provider;
        if (provider === 'google') {
          // Google OAuth enables all Google services
          connected.gmail = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected['google-drive'] = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected['google-docs'] = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected['google-sheets'] = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected['google-chat'] = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected['google-calendar'] = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
        } else if (provider === 'atlassian') {
          connected.jira = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          // Also enable Confluence since it uses the same Atlassian OAuth
          connected.confluence = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
        } else if (provider === 'slack') {
          connected.slack = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
        } else if (provider === 'microsoft') {
          // Microsoft OAuth enables all three Microsoft services
          connected.outlook = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected.teams = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
          connected.sharepoint = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
        } else if (provider === 'notion') {
          connected.notion = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
        } else if (provider === 'github') {
          connected.github = { 
            connected: true, 
            email: user.user_email, 
            expiresAt: user.expires_at,
            lastSync: user.updated_at
          };
        }
      });
      
      setConnectionStatus(connected);
    } catch (error) {
      console.log('No authenticated users found or error occurred');
      setConnectionStatus({});
    }
  };

  // Handle OAuth for any provider
  const handleProviderAuth = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    setIsAuthenticating(true);
    setAuthMessage(`Connecting to ${PROVIDERS.find(p => p.id === provider)?.name}...`);
    setError('');
    
    try {
      // Map frontend provider IDs to backend OAuth endpoints
      let oauthEndpoint = provider;
      
      if (provider === 'outlook' || provider === 'teams' || provider === 'sharepoint') {
        oauthEndpoint = 'microsoft';
      } else if (provider === 'confluence') {
        oauthEndpoint = 'atlassian';
      } else if (provider === 'gmail' || provider === 'google-drive' || provider === 'google-docs' || provider === 'google-sheets' || provider === 'google-chat' || provider === 'google-calendar') {
        oauthEndpoint = 'google';
      }
      
      // Fetch OAuth URL from backend
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/${oauthEndpoint}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get OAuth URL: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.auth_url) {
        throw new Error('No OAuth URL received from backend');
      }
      
      // Redirect to the actual OAuth provider URL
      window.location.href = data.auth_url;
      
    } catch (error: any) {
      console.error('OAuth error:', error);
      setError(`Failed to connect to ${provider}. ${error.message || 'Unknown error'}`);
      setIsLoading(prev => ({ ...prev, [provider]: false }));
      setIsAuthenticating(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Map frontend provider IDs to backend provider names
      let backendProvider = provider;
      
      if (provider === 'outlook' || provider === 'teams' || provider === 'sharepoint') {
        backendProvider = 'microsoft';
      } else if (provider === 'confluence') {
        backendProvider = 'atlassian';
      } else if (provider === 'gmail' || provider === 'google-drive' || provider === 'google-docs' || provider === 'google-sheets' || provider === 'google-chat' || provider === 'google-calendar') {
        backendProvider = 'google';
      }
      
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/clear-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: backendProvider }),
      });

      if (response.ok) {
        // If disconnecting Microsoft, clear all Microsoft services
        if (backendProvider === 'microsoft') {
          setConnectionStatus(prev => ({
            ...prev,
            outlook: { connected: false },
            teams: { connected: false },
            sharepoint: { connected: false }
          }));
        } else if (backendProvider === 'atlassian') {
          // If disconnecting Atlassian, clear both Jira and Confluence
          setConnectionStatus(prev => ({
            ...prev,
            jira: { connected: false },
            confluence: { connected: false }
          }));
        } else if (backendProvider === 'google') {
          // If disconnecting Google, clear all Google services
          setConnectionStatus(prev => ({
            ...prev,
            gmail: { connected: false },
            'google-drive': { connected: false },
            'google-docs': { connected: false },
            'google-sheets': { connected: false },
            'google-chat': { connected: false },
            'google-calendar': { connected: false }
          }));
        } else {
          setConnectionStatus(prev => ({
            ...prev,
            [provider]: { connected: false }
          }));
        }
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      setError(`Failed to disconnect from ${provider}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // Check for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      setAuthMessage('Authentication completed successfully!');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Check auth status immediately
      checkAuthStatus();
      setIsAuthenticating(false);
      setAuthMessage('');
    } else if (authStatus === 'error') {
      setError('Authentication failed. Please try again.');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsAuthenticating(false);
    }
  }, []);

  // Initial auth status check
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const renderProviderCard = (provider: Provider) => {
    const status = connectionStatus[provider.id];
    const loading = isLoading[provider.id];
    const Icon = provider.icon;

    return (
      <div 
        key={provider.id}
        className={`relative p-6 rounded-xl border transition-all duration-300 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
            : 'bg-white border-gray-200 hover:border-gray-300'
        } ${status?.connected ? 'ring-2 ring-green-500/20' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg bg-white border border-gray-200 dark:border-gray-600 transition-colors duration-200 mt-1`}>
              {provider.customIcon ? (
                <img 
                  src={provider.customIcon} 
                  alt={`${provider.name} icon`}
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {provider.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {provider.description}
              </p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            {status?.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Services:
          </p>
          <div className="flex flex-wrap gap-2">
            {provider.services.map((service) => (
              <span 
                key={service}
                className={`px-2 py-1 text-xs rounded-md ${
                  resolvedTheme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Connection details */}
        {status?.connected && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Connected
              </span>
              {status.email && (
                <span className="text-sm text-green-600 dark:text-green-400 truncate">
                  • {status.email}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          {status?.connected ? (
            <button
              onClick={() => handleDisconnect(provider.id)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => handleProviderAuth(provider.id)}
              disabled={loading || isAuthenticating}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                resolvedTheme === 'dark' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white disabled:opacity-50`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                'Connect'
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Connections
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure your application connections and manage OAuth access
            </p>
          </div>
          <button
            onClick={checkAuthStatus}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              resolvedTheme === 'dark' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white`}
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Authentication status */}
        {isAuthenticating && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-blue-700 dark:text-blue-300">{authMessage}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Connection overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROVIDERS.map(renderProviderCard)}
          </div>
        </div>

        {/* Database Status */}
        <div className="mt-8">
          <div className={`p-6 rounded-xl border transition-all duration-300 ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg bg-white border border-gray-200 dark:border-gray-600`}>
                <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                SQLite Database Status
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Local SQLite database for token storage and management
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Connection:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Database:</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">oauth_tokens.db</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Active tokens:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Object.values(connectionStatus).filter(s => s.connected).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 