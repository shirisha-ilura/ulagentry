import React, { useState } from 'react';
import { Mail, MessageSquare, Calendar, Briefcase, Users, Database, Plus, Check } from 'lucide-react';

export function IntegrationPanel() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['gmail', 'slack']);

  const integrations = [
    { id: 'gmail', name: 'Gmail', icon: Mail, description: 'Email management and automation', color: 'text-red-500' },
    { id: 'slack', name: 'Slack', icon: MessageSquare, description: 'Team communication and notifications', color: 'text-purple-500' },
    { id: 'outlook', name: 'Outlook', icon: Mail, description: 'Microsoft email and calendar', color: 'text-blue-500' },
    { id: 'calendar', name: 'Google Calendar', icon: Calendar, description: 'Schedule management', color: 'text-green-500' },
    { id: 'jira', name: 'Jira', icon: Briefcase, description: 'Project management and issue tracking', color: 'text-blue-600' },
    { id: 'salesforce', name: 'Salesforce', icon: Users, description: 'CRM and sales automation', color: 'text-cyan-500' },
    { id: 'hubspot', name: 'HubSpot', icon: Users, description: 'Marketing and sales platform', color: 'text-orange-500' },
    { id: 'trello', name: 'Trello', icon: Database, description: 'Project organization and tracking', color: 'text-blue-400' }
  ];

  const handleToggleIntegration = (integrationId: string) => {
    setConnectedIntegrations(prev =>
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  return (
    <div className="h-full p-6 overflow-y-auto bg-gray-900">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Integrations</h3>
        <p className="text-gray-300">Connect your AI agent to external platforms and services.</p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => {
          const isConnected = connectedIntegrations.includes(integration.id);
          return (
            <div
              key={integration.id}
              className="border border-gray-700 bg-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <integration.icon className={`h-8 w-8 ${integration.color}`} />
                  <div>
                    <h4 className="font-medium text-white">{integration.name}</h4>
                    <p className="text-sm text-gray-300">{integration.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleIntegration(integration.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
              
              {isConnected && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Status</label>
                      <span className="text-emerald-400">Active</span>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-medium mb-1">Last Sync</label>
                      <span className="text-gray-400">2 minutes ago</span>
                    </div>
                  </div>
                  <button className="mt-3 text-sm text-cyan-400 hover:text-cyan-300">
                    Configure settings →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <h4 className="font-medium text-white mb-2">Custom Integration</h4>
        <p className="text-sm text-gray-300 mb-3">
          Need a custom integration? Add your own API endpoints.
        </p>
        <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-purple-500/25">
          Add Custom API
        </button>
      </div>
    </div>
  );
}