import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PreConfiguredAgents } from './PreConfiguredAgents';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeScreenProps {
  onStartBuilding: (prompt: string) => void;
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
    <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)] pt-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Main content section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 flex-1">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              What do you want to build?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create powerful AI agents, workflows & chatbots by chatting with AI.
            </p>
          </div>

          {/* Main input area */}
          <div className="mb-12">
            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your idea and we'll bring it to life..."
                  className="w-full h-32 px-6 py-6 bg-gray-50 dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-300 shadow-lg"
                  style={{ fontSize: '18px', lineHeight: '1.5' }}
                />
                
                {/* Send Button */}
                <div className={`absolute bottom-4 right-4 transition-all duration-300 ease-out ${
                  prompt.trim() 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
                }`}>
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isSearching}
                    className="w-12 h-12 bg-orange-500 hover:bg-orange-600 dark:bg-purple-600 dark:hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-purple-500/25"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <ArrowRight className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Example prompts */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Try these examples
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="px-6 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{example}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pre-configured agents section */}
      <div className="bg-gray-50 dark:bg-[#111111] transition-colors duration-300">
        <PreConfiguredAgents onLaunchAgent={handleLaunchAgent} />
      </div>
    </div>
  );
}