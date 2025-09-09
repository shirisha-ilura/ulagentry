import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  X, 
  Zap, 
  Mail, 
  MessageSquare, 
  Ticket, 
  Settings,
  Brain,
  Clock,
  Shield,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { WorkflowRequirement, PromptAnalysis } from '../services/llmService';
import { N8nTemplate } from '../services/templateService';

interface ApprovalWorkflowProps {
  analysis: PromptAnalysis;
  onApprove: (analysis: PromptAnalysis) => void;
  onReject: () => void;
  onModify: (modifiedAnalysis: PromptAnalysis) => void;
  isLoading?: boolean;
}

interface ConnectionIconProps {
  provider: string;
  className?: string;
}

const ConnectionIcon: React.FC<ConnectionIconProps> = ({ provider, className = "h-5 w-5" }) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    google: Mail,
    slack: MessageSquare,
    jira: Ticket,
    microsoft: Settings
  };

  const Icon = iconMap[provider] || AlertCircle;
  return <Icon className={className} />;
};

const ComplexityBadge: React.FC<{ complexity: string }> = ({ complexity }) => {
  const { resolvedTheme } = useTheme();
  
  const getComplexityConfig = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          icon: CheckCircle
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          icon: Clock
        };
      case 'complex':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          icon: AlertCircle
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          icon: AlertCircle
        };
    }
  };

  const config = getComplexityConfig(complexity);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
    </span>
  );
};

export function ApprovalWorkflow({ 
  analysis, 
  onApprove, 
  onReject, 
  onModify, 
  isLoading = false 
}: ApprovalWorkflowProps) {
  const { resolvedTheme } = useTheme();
  const [isModifying, setIsModifying] = useState(false);
  const [modifiedAnalysis, setModifiedAnalysis] = useState<PromptAnalysis>(analysis);

  const handleModify = () => {
    setIsModifying(true);
  };

  const handleSaveModifications = () => {
    onModify(modifiedAnalysis);
    setIsModifying(false);
  };

  const handleCancelModifications = () => {
    setModifiedAnalysis(analysis);
    setIsModifying(false);
  };

  const updateRequirement = (field: keyof WorkflowRequirement, value: any) => {
    setModifiedAnalysis(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value
      }
    }));
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`}>
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl transition-all duration-300 ${
        resolvedTheme === 'dark' 
          ? 'bg-gray-900 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Workflow Analysis
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve the proposed workflow
              </p>
            </div>
          </div>
          <button
            onClick={onReject}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Confidence Score */}
          <div className={`p-4 rounded-lg ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Analysis Confidence
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analysis.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Workflow Details */}
          <div className={`p-4 rounded-lg ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Proposed Workflow
            </h3>
            
            {isModifying ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={modifiedAnalysis.requirements.name}
                    onChange={(e) => updateRequirement('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      resolvedTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={modifiedAnalysis.requirements.description}
                    onChange={(e) => updateRequirement('description', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      resolvedTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Complexity
                  </label>
                  <select
                    value={modifiedAnalysis.requirements.estimatedComplexity}
                    onChange={(e) => updateRequirement('estimatedComplexity', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      resolvedTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="simple">Simple</option>
                    <option value="medium">Medium</option>
                    <option value="complex">Complex</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {analysis.requirements.name}
                  </h4>
                  <ComplexityBadge complexity={analysis.requirements.estimatedComplexity} />
                </div>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {analysis.requirements.description}
                </p>
                
                {analysis.requirements.additionalNotes && (
                  <div className={`p-3 rounded-lg ${
                    resolvedTheme === 'dark' 
                      ? 'bg-blue-900/20 border border-blue-800' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> {analysis.requirements.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Required Connections */}
          <div className={`p-4 rounded-lg ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Required Connections
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.requirements.requiredConnections.map((connection) => (
                <div 
                  key={connection}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    resolvedTheme === 'dark' 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <ConnectionIcon provider={connection} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {connection}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      OAuth authentication required
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Reasoning */}
          <div className={`p-4 rounded-lg ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              AI Reasoning
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {analysis.reasoning}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Your data is secure and encrypted
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {isModifying ? (
              <>
                <button
                  onClick={handleCancelModifications}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModifications}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleModify}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Modify
                </button>
                <button
                  onClick={onReject}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => onApprove(analysis)}
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve & Build</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 