import React, { useState } from 'react';
import { AgentBuilder } from './AgentBuilder';
import { LiveProgress } from './LiveProgress';
import { AgentPreview } from './AgentPreview';
import { IntegrationPanel } from './IntegrationPanel';
import { TemplateLibrary } from './TemplateLibrary';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { PreviewModal } from './PreviewModal';

interface MainLayoutProps {
  onAgentReady: () => void;
  showPreviewModal: boolean;
  onClosePreview: () => void;
}

export function MainLayout({ onAgentReady, showPreviewModal, onClosePreview }: MainLayoutProps) {
  const [activeTab, setActiveTab] = useState<'builder' | 'integrations' | 'templates' | 'analytics'>('builder');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  const tabs = [
    { id: 'builder' as const, label: 'Agent Builder' },
    { id: 'integrations' as const, label: 'Integrations' },
    { id: 'templates' as const, label: 'Templates' },
    { id: 'analytics' as const, label: 'Analytics' }
  ];

  return (
    <>
    <div className="flex-1 flex bg-gray-900">
      {/* Left Panel */}
      <div className="w-1/2 border-r border-gray-700 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-700 px-6 py-3 bg-gray-800">
          <nav className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'builder' && (
            <AgentBuilder
              isBuilding={isBuilding}
              onStartBuilding={setIsBuilding}
              onProgressUpdate={setBuildProgress}
              onAgentReady={onAgentReady}
            />
          )}
          {activeTab === 'integrations' && <IntegrationPanel />}
          {activeTab === 'templates' && <TemplateLibrary />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        <div className="h-1/3 border-b border-gray-700">
          <LiveProgress isBuilding={isBuilding} progress={buildProgress} />
        </div>
        <div className="flex-1">
          <AgentPreview />
        </div>
      </div>
    </div>
    
    {/* Preview Modal */}
    <PreviewModal 
      isOpen={showPreviewModal} 
      onClose={onClosePreview} 
    />
    </>
  );
}