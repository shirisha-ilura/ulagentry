import React, { useState } from 'react';
import { X, Minimize2, Maximize2, ArrowRight } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
}

export function ChatModal({ isOpen, onClose, agentName }: ChatModalProps) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: 'Hello! I\'m your AI agent. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Respond immediately
    const responses = [
      'I understand your request and I\'m processing it now...',
      'Great question! Let me help you with that.',
      'I\'ve got this covered! Processing your request.',
      'Perfect! I\'m working on this for you right away.',
      'Excellent! Let me handle this task for you.'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: randomResponse
    };
    setMessages(prev => [...prev, botMessage]);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col ${
        isMinimized ? 'w-96 h-16' : 'w-full max-w-4xl h-[80vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 dark:bg-white rounded-full flex items-center justify-center">
              <span className="text-white dark:text-black font-bold">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{agentName}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">AI Agent Chat</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-orange-500 dark:bg-gray-600 text-white'
                      : 'bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                  } transition-colors duration-300`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input - Sticky at bottom */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full h-24 px-4 py-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500 focus:border-transparent text-lg transition-colors duration-300"
                />
                
                {/* Send Button - appears when typing */}
                <div className={`absolute top-4 right-4 transition-all duration-300 ease-out ${
                  input.trim() 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
                }`}>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-10 h-10 bg-orange-500 hover:bg-orange-600 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-orange-500/25 dark:hover:shadow-blue-500/25"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}