import React from 'react';
import { X, FileText, Globe, Book, Database, Cloud, Share2 } from 'lucide-react';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: string) => void;
}

export function KnowledgeBaseModal({ isOpen, onClose, onSelectSource }: KnowledgeBaseModalProps) {
  if (!isOpen) return null;

  const sources = [
    { name: 'Files', icon: <FileText className="w-8 h-8" />, id: 'files' },
    { name: 'Text', icon: <Book className="w-8 h-8" />, id: 'text' },
    { name: 'Website', icon: <Globe className="w-8 h-8" />, id: 'website' },
    { name: 'Google Drive', icon: <Cloud className="w-8 h-8" />, id: 'google_drive' },
    { name: 'OneDrive', icon: <Cloud className="w-8 h-8" />, id: 'onedrive' },
    { name: 'Dropbox', icon: <Cloud className="w-8 h-8" />, id: 'dropbox' },
    { name: 'Notion', icon: <Share2 className="w-8 h-8" />, id: 'notion' },
    { name: 'Freshdesk', icon: <Database className="w-8 h-8" />, id: 'freshdesk' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Knowledge Base</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => onSelectSource(source.id)}
                className="flex flex-col items-center justify-center p-4 space-y-2 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {source.icon}
                <span className="text-sm font-medium">{source.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
