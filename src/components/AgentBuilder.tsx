import React, { useState } from 'react';
import { Play, Save, Download, Share } from 'lucide-react';

interface AgentBuilderProps {
  isBuilding: boolean;
  onStartBuilding: (building: boolean) => void;
  onProgressUpdate: (progress: number) => void;
  onAgentReady: () => void;
}

export function AgentBuilder({ isBuilding, onStartBuilding, onProgressUpdate, onAgentReady }: AgentBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [agentName, setAgentName] = useState('');

  const handleBuild = async () => {
    if (!prompt.trim()) return;
    
    onStartBuilding(true);
    
    // Fast building process without artificial delays
    const steps = [
      'Parsing user prompt...',
      'Identifying required capabilities...',
      'Setting up integrations...',
      'Generating agent logic...',
      'Configuring workflows...',
      'Finalizing deployment...'
    ];
    
    // Update progress quickly through all steps
    for (let i = 0; i < steps.length; i++) {
      onProgressUpdate(((i + 1) / steps.length) * 100);
      // Small delay just for visual feedback
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Complete immediately
    onStartBuilding(false);
    onProgressUpdate(0);
    onAgentReady();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-6 space-y-6">
        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="e.g., Customer Support Assistant"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Agent Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your AI agent's functionality, integrations, and features in natural language..."
            className="w-full h-48 p-4 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 rounded-lg resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>

        {/* Build Button */}
        <button
          onClick={handleBuild}
          disabled={!prompt.trim() || isBuilding}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-500/25"
        >
          <Play className="h-5 w-5" />
          <span>{isBuilding ? 'Building...' : 'Build Agent'}</span>
        </button>

        {/* Agent Configuration */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deployment Environment
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Response Time
              </label>
              <select className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                <option>Real-time</option>
                <option>5 seconds</option>
                <option>30 seconds</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="analytics"
                className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="analytics" className="text-sm text-gray-300">
                Enable analytics and monitoring
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-700 p-6 mt-auto bg-gray-800">
        <div className="flex space-x-3">
          <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-500/25">
            <Download className="h-4 w-4" />
            <span>Deploy</span>
          </button>
          <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/25">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}