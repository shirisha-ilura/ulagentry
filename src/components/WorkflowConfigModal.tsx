import { useState } from 'react';
import { X, Save, Clock, Zap, Calendar } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Workflow } from '../lib/supabase';

interface WorkflowConfigModalProps {
  workflow: Workflow;
  onClose: () => void;
  onSave: (updates: Partial<Workflow>) => void;
}

export function WorkflowConfigModal({ workflow, onClose, onSave }: WorkflowConfigModalProps) {
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: workflow.name,
    description: workflow.description || '',
    status: workflow.status,
    trigger_type: workflow.trigger_type || 'manual',
    schedule_expression: workflow.schedule_expression || '',
    system_prompt: workflow.system_prompt || '',
    integrations: workflow.integrations || []
  });
  
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving workflow config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleIntegrationChange = (integration: string) => {
    setFormData(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integration)
        ? prev.integrations.filter(i => i !== integration)
        : [...prev.integrations, integration]
    }));
  };

  const availableIntegrations = [
    'gmail', 'slack', 'jira', 'google_drive', 'salesforce', 
    'hubspot', 'notion', 'linkedin', 'twitter', 'facebook'
  ];

  const triggerTypes = [
    { value: 'manual', label: 'Manual', icon: Zap },
    { value: 'scheduled', label: 'Scheduled', icon: Clock },
    { value: 'webhook', label: 'Webhook', icon: Zap }
  ];

  const schedulePresets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Daily at 9 AM', value: '0 9 * * *' },
    { label: 'Weekly (Mondays)', value: '0 9 * * 1' },
    { label: 'Monthly (1st)', value: '0 9 1 * *' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
        resolvedTheme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } border`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              resolvedTheme === 'dark' ? 'bg-purple-600' : 'bg-orange-500'
            }`}>
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Configure Workflow
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update workflow settings, schedule, and integrations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                    resolvedTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                    resolvedTheme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                  resolvedTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                }`}
                placeholder="Describe what this workflow does..."
              />
            </div>
          </div>

          {/* Trigger Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Trigger Configuration</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Trigger Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {triggerTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, trigger_type: type.value }))}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        formData.trigger_type === type.value
                          ? resolvedTheme === 'dark'
                            ? 'border-purple-500 bg-purple-600/20'
                            : 'border-orange-500 bg-orange-50'
                          : resolvedTheme === 'dark'
                            ? 'border-gray-600 hover:border-gray-500'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${
                          formData.trigger_type === type.value
                            ? resolvedTheme === 'dark' ? 'text-purple-400' : 'text-orange-600'
                            : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          formData.trigger_type === type.value
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {type.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.trigger_type === 'scheduled' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Schedule Expression (Cron)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.schedule_expression}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule_expression: e.target.value }))}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                      resolvedTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                    }`}
                    placeholder="0 9 * * *"
                  />
                  <select
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule_expression: e.target.value }))}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                      resolvedTheme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                    }`}
                  >
                    <option value="">Presets</option>
                    {schedulePresets.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500">
                  Current: {formData.schedule_expression || 'Not set'}
                </p>
              </div>
            )}
          </div>

          {/* System Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Configuration</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Prompt
              </label>
              <textarea
                value={formData.system_prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, system_prompt: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 ${
                  resolvedTheme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-500'
                }`}
                placeholder="Enter system prompt for the AI agent..."
              />
            </div>
          </div>

          {/* Integrations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Integrations</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {availableIntegrations.map((integration) => (
                <label
                  key={integration}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.integrations.includes(integration)
                      ? resolvedTheme === 'dark'
                        ? 'border-purple-500 bg-purple-600/20'
                        : 'border-orange-500 bg-orange-50'
                      : resolvedTheme === 'dark'
                        ? 'border-gray-600 hover:border-gray-500'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.integrations.includes(integration)}
                    onChange={() => handleIntegrationChange(integration)}
                    className="sr-only"
                  />
                  <span className={`text-sm capitalize ${
                    formData.integrations.includes(integration)
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {integration}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-white transition-colors ${
                resolvedTheme === 'dark' 
                  ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50' 
                  : 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50'
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}