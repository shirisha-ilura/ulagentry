import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Settings,
  Play,
  Pause,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getWorkflowAnalytics, updateWorkflowConfig } from '../services/analyticsService';
import { Workflow, WorkflowRun } from '../lib/supabase';
import { WorkflowConfigModal } from './WorkflowConfigModal';

interface WorkflowDetailProps {
  workflowId: string;
  onBack: () => void;
}

export function WorkflowDetail({ workflowId, onBack }: WorkflowDetailProps) {
  const { resolvedTheme } = useTheme();
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [stats, setStats] = useState({
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    successRate: 0,
    avgDuration: 0
  });
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    loadWorkflowData();
  }, [workflowId]);

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      const data = await getWorkflowAnalytics(workflowId);
      setWorkflow(data.workflow);
      setRuns(data.runs);
      setStats(data.stats);
      setIntegrations(data.integrations);
    } catch (error) {
      console.error('Error loading workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (updates: Partial<Workflow>) => {
    try {
      await updateWorkflowConfig(workflowId, updates);
      await loadWorkflowData(); // Reload data
      setShowConfigModal(false);
    } catch (error) {
      console.error('Error updating workflow config:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'minor':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-8 px-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading workflow details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="pt-24 pb-8 px-8">
        <div className="text-center">
          <p className="text-gray-500">Workflow not found</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-8 px-8 relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/hero-background.png')`,
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-lg border transition-colors ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {workflow.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {workflow.description || 'No description provided'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              workflow.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}>
              {workflow.status}
            </span>
            <button
              onClick={() => setShowConfigModal(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Runs */}
          <div className={`p-6 rounded-xl border transition-all duration-200 ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
              : 'bg-white/80 border-gray-200 hover:bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Runs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRuns}</p>
              </div>
              <BarChart3 className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
            </div>
          </div>

          {/* Success Rate */}
          <div className={`p-6 rounded-xl border transition-all duration-200 ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
              : 'bg-white/80 border-gray-200 hover:bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.successRate.toFixed(1)}%</p>
              </div>
              {stats.successRate >= 90 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>

          {/* Average Duration */}
          <div className={`p-6 rounded-xl border transition-all duration-200 ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
              : 'bg-white/80 border-gray-200 hover:bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgDuration.toFixed(1)}s</p>
              </div>
              <Clock className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
            </div>
          </div>

          {/* Last Run */}
          <div className={`p-6 rounded-xl border transition-all duration-200 ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
              : 'bg-white/80 border-gray-200 hover:bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Run</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {runs.length > 0 ? new Date(runs[0].started_at).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <Calendar className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
            </div>
          </div>
        </div>

        {/* Workflow Configuration */}
        <div className={`rounded-xl border p-6 mb-8 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trigger Type</p>
              <p className="font-medium text-gray-900 dark:text-white capitalize">
                {workflow.trigger_type || 'Manual'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Schedule</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {workflow.schedule_expression || 'Not scheduled'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Integrations</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {workflow.integrations?.map((integration, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
                  >
                    {integration}
                  </span>
                )) || <span className="text-gray-500">None</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Runs */}
        <div className={`rounded-xl border overflow-hidden ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Runs</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {runs.length > 0 ? (
                  runs.slice(0, 10).map((run) => (
                    <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(run.status)}
                          <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                            {run.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(run.priority)}`}>
                          {run.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {run.duration_seconds ? `${run.duration_seconds}s` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(run.started_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {run.completed_at ? new Date(run.completed_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No runs found for this workflow
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Configuration Modal */}
        {showConfigModal && (
          <WorkflowConfigModal
            workflow={workflow}
            onClose={() => setShowConfigModal(false)}
            onSave={handleUpdateConfig}
          />
        )}
      </div>
    </div>
  );
}