import React, { useState } from 'react';
import { X, Bot, User, Send, Minimize2, Maximize2, Settings, Download, Share } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: '🎉 Hello! I\'m your newly created AI agent. I\'m ready to help you with your tasks!' },
    { id: 2, type: 'bot', content: 'I can handle Gmail integration, Slack notifications, and much more. Try asking me something!' }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Respond immediately
    const responses = [
      'Perfect! I understand your request and I\'m processing it now...',
      'Great question! Let me check that for you right away.',
      'I\'ve got this covered! Processing your request with my integrated capabilities.',
      'Excellent! I\'m using my integrated capabilities to handle this for you.',
      'No problem! My AI capabilities are working on this task right now.'
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-96 h-16' : 'w-full max-w-4xl h-[80vh]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">🎉 Agent Ready!</h3>
              <p className="text-sm text-gray-400">Your AI agent is now live and ready to use</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-700"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-700">
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-96">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-md ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-700 text-gray-100 border border-gray-600'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Test your agent here..."
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-500/25">
                  <Download className="h-4 w-4" />
                  <span>Deploy Live</span>
                </button>
                <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/25">
                  <Share className="h-4 w-4" />
                  <span>Get Embed Code</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}