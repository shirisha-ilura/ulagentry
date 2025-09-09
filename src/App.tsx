import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BuildView } from './components/BuildView';
import { ChatModal } from './components/ChatModal';
import { Dashboard } from './components/Dashboard';
import { Connections } from './components/Connections';
import { BackendTemplateSearchResult } from './services/templateService';

type ViewType = 'welcome' | 'building' | 'dashboard' | 'connections';
type DashboardView = 'workflow-runs' | 'analytics' | 'embed';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('welcome');
  const [dashboardView, setDashboardView] = useState<DashboardView>('workflow-runs');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isAgentReady, setIsAgentReady] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [templateMatch, setTemplateMatch] = useState<BackendTemplateSearchResult | null>(null);

  // Navigate to Connections view after OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    const view = params.get('view');
    if (auth === 'success' || view === 'connections') {
      setCurrentView('connections');
      // Clean up query string for a nicer URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStartBuilding = (prompt: string) => {
    setUserPrompt(prompt);
    setTemplateMatch(null); // Clear any template match
    setCurrentView('building');
    setIsBuilding(false); // Don't start building immediately
    setBuildProgress(0);
    setIsAgentReady(false);
  };

  const handleTemplateMatch = (match: BackendTemplateSearchResult, prompt: string) => {
    setUserPrompt(prompt);
    setTemplateMatch(match);
    setCurrentView('building');
    setIsBuilding(false);
    setBuildProgress(0);
    setIsAgentReady(false);
  };

  const handleProgressUpdate = (progress: number) => {
    setBuildProgress(progress);
    // Start building when progress is reset to 0 (after architecture)
    if (progress === 0 && !isBuilding) {
      setIsBuilding(true);
    }
  };

  const handleBuildComplete = () => {
    setIsBuilding(false);
    setIsAgentReady(true);
  };

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    // Reset building state when navigating away from building view
    if (view !== 'building') {
      setIsBuilding(false);
      setBuildProgress(0);
      setIsAgentReady(false);
    }
  };

  const handleDashboardViewChange = (view: DashboardView) => {
    setDashboardView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeScreen onStartBuilding={handleStartBuilding} onTemplateMatch={handleTemplateMatch} />;
      case 'building':
        return (
          <BuildView
            userPrompt={userPrompt}
            isBuilding={isBuilding}
            buildProgress={buildProgress}
            isAgentReady={isAgentReady}
            onProgressUpdate={handleProgressUpdate}
            onBuildComplete={handleBuildComplete}
            onOpenChat={() => setShowChatModal(true)}
            templateMatch={templateMatch}
          />
        );
      case 'dashboard':
        return <Dashboard currentView={dashboardView} />;
      case 'connections':
        return <Connections />;
      default:
        return <WelcomeScreen onStartBuilding={handleStartBuilding} onTemplateMatch={handleTemplateMatch} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
        <Header 
          currentView={currentView} 
          onNavigate={handleNavigate}
          dashboardView={dashboardView}
          onDashboardViewChange={handleDashboardViewChange}
        />
        
        {renderCurrentView()}

        <ChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          agentName="Your AI Agent"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;