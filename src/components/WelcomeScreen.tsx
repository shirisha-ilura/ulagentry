import React, { useState } from 'react';
import { Link, Image, ArrowRight } from 'lucide-react';
import { PreConfiguredAgents } from './PreConfiguredAgents';
import { useTheme } from '../contexts/ThemeContext';
// import { templateService, BackendTemplateSearchResult } from '../services/templateService';

interface WelcomeScreenProps {
  onStartBuilding: (prompt: string) => void;
  // onTemplateMatch: (templateMatch: BackendTemplateSearchResult, prompt: string) => void;
}

export function WelcomeScreen({ onStartBuilding }: WelcomeScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setIsSearching(true);
      
      try {
        // No more template search, go directly to building
        console.log('🚀 [WELCOME SCREEN] Starting custom agent build for:', prompt.trim());
        onStartBuilding(prompt.trim());
      } catch (error) {
        console.error('❌ [WELCOME SCREEN] Build initiation failed:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        setIsSearching(true);
        
        try {
          // No more template search, go directly to building
          console.log('🚀 [WELCOME SCREEN] Starting custom agent build for:', prompt.trim());
          onStartBuilding(prompt.trim());
        } catch (error) {
          console.error('❌ [WELCOME SCREEN] Build initiation failed:', error);
        } finally {
          setIsSearching(false);
        }
      }
    }
  };

  const handleLaunchAgent = (agentId: string) => {
    // Map agent IDs to appropriate prompts
    const agentPrompts: Record<string, string> = {
      'l1-operations': 'Create an L1 operations agent that can automate routine operational tasks and workflows',
      'customer-support': 'Build a customer support agent that can handle customer inquiries and provide instant support',
      'debt-collection': 'Design a debt collection agent that can manage payment reminders and collection processes',
      'personal-assistant': 'Create a personal assistant agent that can schedule meetings and manage daily tasks',
      'team-coordinator': 'Build a team coordinator agent that can facilitate team collaboration and project coordination',
      'scheduler': 'Design a scheduling assistant that can optimize calendar management and meeting scheduling'
    };
    
    const agentPrompt = agentPrompts[agentId] || `Launch the ${agentId} agent`;
    onStartBuilding(agentPrompt);
  };

  const examplePrompts = [
    "Build a Database Agent with Postgres",
    "Build an email summarizer bot", 
    "Design a sales assistant",
    "Make a project management helper",
    "Generate a CRM integration bot",
    "Build a scheduling assistant"
  ];

  return (
    <div 
      className="flex-1 flex flex-col min-h-[calc(100vh-80px)] pt-24"
      style={{
        backgroundImage: resolvedTheme === 'dark' ? 'url(/images/hero-background.png)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: resolvedTheme === 'light' ? '#ffffff' : 'transparent'
      }}
    >
      {/* Main input section - keeping existing layout */}
      <div className="flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2 leading-tight transition-colors duration-300">
            What do you want to build?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 transition-colors duration-300">
            Create powerful AI agents, workflows & chatbots by chatting with AI.
          </p>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative group">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your idea and we'll bring it to life (or /command)"
                  className="w-full h-32 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-[#8B5CF6] focus:border-transparent text-lg transition-colors duration-300 relative z-10"
                />
                {/* Animated border overlay */}
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                  <div className={`absolute inset-0 animate-pulse opacity-20 ${
                    resolvedTheme === 'dark' 
                      ? 'bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#8B5CF6]' 
                      : 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500'
                  }`}></div>
                  <div className={`absolute inset-0 animate-shimmer ${
                    resolvedTheme === 'dark'
                      ? 'bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent'
                      : 'bg-gradient-to-r from-transparent via-orange-500 to-transparent'
                  }`}></div>
                </div>
              </div>
              
              {/* Send Button - appears when typing - moved to top-right */}
              <div className={`absolute top-4 right-4 transition-all duration-300 ease-out z-20 ${
                prompt.trim() 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
              }`}>
                <button
                  type="submit"
                  disabled={!prompt.trim() || isSearching}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 dark:bg-[#8B5CF6] dark:hover:bg-[#8B5CF6] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-[#8B5CF6]/25"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                  <ArrowRight className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="absolute bottom-4 left-4 flex space-x-2 z-20">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <Link className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <Image className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200 text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New pre-configured agents section with wide layout */}
      <PreConfiguredAgents onLaunchAgent={handleLaunchAgent} />
    </div>
  );
}