import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Plus,
  Filter,
  Users
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { getWorkflowRunsStats, getRecentWorkflowRuns } from '../services/analyticsService';

interface WorkflowRunsProps {
  onWorkflowSelect?: (workflowId: string) => void;
}

export function WorkflowRuns({ onWorkflowSelect }: WorkflowRunsProps) {
  const { resolvedTheme } = useTheme();
  const [stats, setStats] = useState({
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    avgDuration: 0,
    growthRate: 0,
    successRate: 0
  });
  const [workflowRuns, setWorkflowRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredWorkflowRuns, setFilteredWorkflowRuns] = useState<any[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    priority: 'all',
    result: 'all'
  });

  useEffect(() => {
    loadWorkflowData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [workflowRuns, selectedFilters]);

  const applyFilters = () => {
    let filtered = [...workflowRuns];

    if (selectedFilters.status !== 'all') {
      filtered = filtered.filter(run => run.status === selectedFilters.status);
    }

    if (selectedFilters.priority !== 'all') {
      filtered = filtered.filter(run => run.priority === selectedFilters.priority);
    }

    if (selectedFilters.result !== 'all') {
      const resultStatus = selectedFilters.result === 'success' ? 'completed' : 
                          selectedFilters.result === 'failed' ? 'failed' : 
                          'ongoing';
      filtered = filtered.filter(run => run.status === resultStatus);
    }

    setFilteredWorkflowRuns(filtered);
  };

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      const [runsStats, recentRuns] = await Promise.all([
        getWorkflowRunsStats(),
        getRecentWorkflowRuns(10)
      ]);

      setStats(runsStats);
      setWorkflowRuns(recentRuns);
    } catch (error) {
      console.error('Error loading workflow data:', error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ongoing':
      case 'in-process':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <CheckCircle className="h-4 w-4 text-red-500" />;
      case 'in-review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
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

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      case 'in-process':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
        </div>
      </td>
    </tr>
  );

  const SkeletonCard = () => (
    <div className={`p-6 rounded-xl border transition-all duration-200 animate-pulse ${
      resolvedTheme === 'dark' 
        ? 'bg-gray-800/50 border-gray-700' 
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="mt-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-8 px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Workflow Runs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage your automated workflow executions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            
            {showFilterDropdown && (
              <div className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={selectedFilters.status}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-md border transition-colors ${
                        resolvedTheme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="failed">Failed</option>
                      <option value="in-review">In Review</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                    <select
                      value={selectedFilters.priority}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, priority: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-md border transition-colors ${
                        resolvedTheme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="all">All Priorities</option>
                      <option value="critical">Critical</option>
                      <option value="moderate">Moderate</option>
                      <option value="minor">Minor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result</label>
                    <select
                      value={selectedFilters.result}
                      onChange={(e) => setSelectedFilters(prev => ({ ...prev, result: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-md border transition-colors ${
                        resolvedTheme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="all">All Results</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="in-process">In Process</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setSelectedFilters({ status: 'all', priority: 'all', result: 'all' })}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    >
                      Clear Filters
                    </button>
                    <button
                      onClick={() => setShowFilterDropdown(false)}
                      className="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Run</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
        <div className={`p-6 rounded-xl border transition-all duration-200 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
            : 'bg-white/80 border-gray-200 hover:bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Runs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.totalRuns}</p>
            </div>
            <BarChart3 className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm ${stats.growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate.toFixed(1)}% from last week
            </span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-200 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
            : 'bg-white/80 border-gray-200 hover:bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Successful</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.successfulRuns}</p>
            </div>
            <CheckCircle className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-green-600 dark:text-green-400">{stats.successRate.toFixed(1)}% success rate</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-200 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
            : 'bg-white/80 border-gray-200 hover:bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : stats.failedRuns}</p>
            </div>
            <Users className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-red-600 dark:text-red-400">{(100 - stats.successRate).toFixed(1)}% failure rate</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl border transition-all duration-200 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
            : 'bg-white/80 border-gray-200 hover:bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : `${stats.avgDuration}m`}</p>
            </div>
            <Clock className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-blue-600 dark:text-blue-400">-0.5m from average</span>
          </div>
        </div>
          </>
        )}
      </div>

      {/* Workflow Items Table */}
      <div className={`rounded-xl border overflow-hidden ${
        resolvedTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Workflow Runs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : filteredWorkflowRuns.length > 0 ? (
                filteredWorkflowRuns.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          resolvedTheme === 'dark' ? 'bg-purple-600' : 'bg-orange-500'
                        }`}>
                          <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {run.workflow_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(run.status)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-white capitalize">
                        {run.status.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(run.priority)}`}>
                      {run.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium capitalize ${getResultColor(run.status === 'completed' ? 'success' : run.status === 'failed' ? 'failed' : 'in-process')}`}>
                      {run.status === 'completed' ? 'success' : run.status === 'failed' ? 'failed' : 'in-process'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(run.started_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 dark:text-purple-400 hover:text-blue-900 dark:hover:text-purple-300 mr-4"
                      onClick={() => onWorkflowSelect?.(run.workflow_id)}
                    >
                      View
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                      Edit
                    </button>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No workflow runs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 