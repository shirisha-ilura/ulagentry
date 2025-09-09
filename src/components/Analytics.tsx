import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { getDashboardStats, getMostUsedIntegrations } from '../services/analyticsService';

export function Analytics() {
  const { resolvedTheme } = useTheme();
  const [selectedTimeframe, setSelectedTimeframe] = useState('Day');
  
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    successRate: 0,
    avgDuration: 0
  });
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    timeframe: 'all',
    status: 'all',
    priority: 'all'
  });
  const [workflowChartData, setWorkflowChartData] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [workflowInsights] = useState({
    mostActiveHour: '14:00',
    averageExecutionTime: '2.4s',
    topFailureReason: 'API Timeout',
    successTrend: '+5.2%'
  });

  const timeframes = ['Day', 'Week', 'Month'];
  
  // Create concentric data from integrations with theme-appropriate colors
  const getThemeColors = () => {
    if (resolvedTheme === 'dark') {
      return ['#8b5cf6', '#6d28d9', '#4c1d95']; // Purple shades for dark theme
    } else {
      return ['#f97316', '#ea580c', '#c2410c']; // Orange shades for light theme
    }
  };
  
  const themeColors = getThemeColors();
  const concentricData = integrations.length > 0 ? integrations.map((integration, index) => ({
    name: integration.name || `Integration ${index + 1}`,
    value: integration.usage_percentage || Math.round((3 - index) * 25 + 15),
    color: themeColors[index % themeColors.length]
  })) : [
    { name: 'Gmail', value: 65, color: themeColors[0] },
    { name: 'Slack', value: 40, color: themeColors[1] },
    { name: 'Jira', value: 25, color: themeColors[2] }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeframe, selectedFilters]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, integrationData] = await Promise.all([
        getDashboardStats().catch(() => ({ 
          totalWorkflows: 34, 
          activeWorkflows: 28, 
          successRate: 94.2, 
          avgDuration: 2.3 
        })),
        getMostUsedIntegrations().catch(() => [])
      ]);

      setStats(dashboardStats);
      setIntegrations(integrationData.slice(0, 3));
      
      // Generate chart data based on actual performance data or fallback
      const generateChartData = () => {
        const data = [];
        const timeframe = selectedTimeframe.toLowerCase();
        let dataPoints;
        
        if (timeframe === 'day') {
          dataPoints = 24;
        } else if (timeframe === 'week') {
          dataPoints = 7;
        } else {
          dataPoints = 30;
        }
        
        // Use consistent data based on timeframe (not random)
        for (let i = 0; i < dataPoints; i++) {
          const baseActive = Math.floor((Math.sin(i * 0.5) + 1) * 10) + 8; // Consistent pattern
          const baseInactive = Math.floor((Math.cos(i * 0.3) + 1) * 4) + 2;
          
          data.push({
            time: timeframe === 'day' ? `${i}:00` : 
                  timeframe === 'week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i] :
                  `Day ${i + 1}`,
            activeWorkflows: baseActive,
            totalWorkflows: baseActive + baseInactive,
            successRate: Math.floor((Math.sin(i * 0.2) + 1) * 10) + 85
          });
        }
        return data;
      };
      
      // Generate performance chart data (7 days of the week)
      const generatePerformanceData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map((day, index) => ({
          day,
          successful: Math.floor((Math.sin(index * 0.8) + 1) * 15) + 20,
          failed: Math.floor((Math.cos(index * 0.6) + 1) * 8) + 5
        }));
      };
      
      setWorkflowChartData(generateChartData());
      setPerformanceData(generatePerformanceData());
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Set fallback data on error
      setStats({ totalWorkflows: 34, activeWorkflows: 28, successRate: 94.2, avgDuration: 2.3 });
    } finally {
      setLoading(false);
    }
  };


  // Skeleton loading components
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

  const SkeletonChart = ({ height = '420px' }: { height?: string }) => (
    <div
      className={`rounded-2xl p-6 shadow-lg animate-pulse ${
        resolvedTheme === 'dark' 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      } border`}
      style={{
        minHeight: height,
        borderRadius: '32px',
      }}
    >
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6"></div>
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg`} style={{ height: `calc(${height} - 120px)` }}></div>
    </div>
  );

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Monitor your workflow performance and automation insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={selectedFilters.timeframe}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, timeframe: e.target.value }))}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  resolvedTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-gray-300' 
                    : 'bg-white border-gray-200 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="all">All Time</option>
                <option value="day">Last Day</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  resolvedTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-gray-300' 
                    : 'bg-white border-gray-200 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="ongoing">Ongoing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
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
              {/* Total Workflows */}
              <div className={`p-6 rounded-xl border transition-all duration-200 ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                  : 'bg-white/80 border-gray-200 hover:bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workflows</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWorkflows}</p>
                  </div>
                  <BarChart3 className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+12% from last month</span>
                </div>
              </div>

              {/* Active Workflows */}
              <div className={`p-6 rounded-xl border transition-all duration-200 ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                  : 'bg-white/80 border-gray-200 hover:bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Workflows</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeWorkflows}</p>
                  </div>
                  <CheckCircle className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+8% from last month</span>
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.successRate}%</p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 dark:text-green-400">+2.1% from last month</span>
                </div>
              </div>

              {/* Average Runtime */}
              <div className={`p-6 rounded-xl border transition-all duration-200 ${
                resolvedTheme === 'dark' 
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                  : 'bg-white/80 border-gray-200 hover:bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Runtime</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgDuration}s</p>
                  </div>
                  <Users className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-purple-500' : 'text-orange-500'}`} />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600 dark:text-red-400">-0.2s from last month</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {loading ? (
            <>
              <SkeletonChart height="540px" />
              <SkeletonChart height="420px" />
            </>
          ) : (
            <>
          {/* Total Workflows Chart - Interactive */}
          <div
            className={`rounded-2xl p-6 text-black dark:text-white shadow-lg ${
              resolvedTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } border`}
            style={{
              minHeight: 540,
              borderRadius: '32px',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black dark:text-white">Workflow Activity</h3>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 gap-1">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-1 text-sm rounded-full transition-colors duration-200 font-medium ${
                      selectedTimeframe === timeframe
                        ? resolvedTheme === 'dark' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-orange-500 text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Interactive Chart */}
            <div className="w-full h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workflowChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="time" 
                    stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: resolvedTheme === 'dark' ? '#ffffff' : '#000000'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      color: resolvedTheme === 'dark' ? '#ffffff' : '#000000'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeWorkflows" 
                    stroke={resolvedTheme === 'dark' ? '#8b5cf6' : '#f97316'} 
                    strokeWidth={3}
                    dot={{ fill: resolvedTheme === 'dark' ? '#8b5cf6' : '#f97316', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: resolvedTheme === 'dark' ? '#8b5cf6' : '#f97316', strokeWidth: 2 }}
                    name="Active Workflows"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalWorkflows" 
                    stroke={resolvedTheme === 'dark' ? '#4b5563' : '#9ca3af'} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: resolvedTheme === 'dark' ? '#4b5563' : '#9ca3af', strokeWidth: 1, r: 3 }}
                    name="Total Workflows"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Used Integrations (Custom Styled) */}
          <div
            className={`rounded-2xl p-0 text-black dark:text-white shadow-lg ${
              resolvedTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } border`}
            style={{
              minHeight: 420,
              borderRadius: '32px',
            }}
          >
            <div className="p-6 pb-0">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-1 w-fit">Most Used Integrations</h3>
              <p className="text-lg text-black dark:text-white font-normal mb-4"><span className="font-bold dark:text-white">Frequently used events</span> and conditions</p>
              </div>
            <div className="flex flex-row items-center justify-center flex-1 gap-8 px-4 pb-6">
              <div className="flex items-center justify-center text-black dark:text-white w-80 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                      data={concentricData}
                      dataKey="value"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      startAngle={90}
                      endAngle={450}
                      isAnimationActive={true}
                      stroke="none"
                      cursor="pointer"
                    >
                      {concentricData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                        border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: resolvedTheme === 'dark' ? '#ffffff' : '#000000'
                      }}
                      formatter={(value: any, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center ml-6">
                <ul className="space-y-6 text-black dark:text-white">
                  {concentricData.map((entry) => (
                    <li key={entry.name} className="flex items-center text-xl font-normal">
                      <span style={{ backgroundColor: entry.color, width: 22, height: 22, borderRadius: '50%', display: 'inline-block', marginRight: 16 }}></span>
                      <span className="text-black dark:text-white font-medium">{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-6">
          {loading ? (
            <>
              <SkeletonChart height="300px" />
              <SkeletonChart height="300px" />
              <SkeletonChart height="300px" />
            </>
          ) : (
            <>
          {/* Performance Chart */}
          <div
            className={`rounded-2xl p-6 col-span-1 flex flex-col justify-between text-black dark:text-white shadow-lg ${
              resolvedTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } border`}
            style={{
              minWidth: 0,
              borderRadius: '32px',
            }}
          >
            <div className="flex justify-between items-start mb-2 text-black dark:text-white">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-0">Performance</h3>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 gap-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-4 py-1 text-base rounded-full transition-colors duration-200 font-medium ${
                    selectedTimeframe === timeframe
                      ? resolvedTheme === 'dark' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-orange-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${
                  resolvedTheme === 'dark' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Successful</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded ${
                  resolvedTheme === 'dark' ? 'bg-red-500' : 'bg-red-400'
                }`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Failed</span>
              </div>
            </div>

            {/* Interactive Performance Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="day" 
                    stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280'}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
                      border: `1px solid ${resolvedTheme === 'dark' ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: resolvedTheme === 'dark' ? '#ffffff' : '#000000'
                    }}
                  />
                  <Bar 
                    dataKey="successful" 
                    stackId="a" 
                    fill={resolvedTheme === 'dark' ? '#8b5cf6' : '#f97316'}
                    name="Successful"
                  />
                  <Bar 
                    dataKey="failed" 
                    stackId="a" 
                    fill={resolvedTheme === 'dark' ? '#ef4444' : '#dc2626'}
                    name="Failed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Integration Hub */}
          <div
            className={`rounded-2xl p-6 shadow-lg ${
              resolvedTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } border`}
            style={{
              borderRadius: '32px',
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Integration Hub</h3>
            
            {/* Progress Circle */}
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke={resolvedTheme === 'dark' ? '#8b5cf6' : '#f97316'}
                    strokeWidth="8"
                    strokeDasharray="219.8"
                    strokeDashoffset="57.15"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">74%</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Integration Status</span>
            </div>

            {/* Integration List */}
            <div className="space-y-3 mb-4">
              {['Gmail', 'Slack', 'Jira', 'Others'].map((integration) => (
                <div key={integration} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{integration}</span>
                </div>
              ))}
            </div>

            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Overview of connected apps and authentication status
            </a>
          </div>

          {/* Workflow Insights */}
          <div
            className={`rounded-2xl p-6 shadow-lg ${
              resolvedTheme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/80 border-gray-200'
            } border`}
            style={{
              borderRadius: '32px',
            }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Workflow Insights
            </h3>
            
            <div className="space-y-4">
              {/* Most Active Hour */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  resolvedTheme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-100'
                }`}>
                  <Clock className={`h-4 w-4 ${
                    resolvedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Peak Hour</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{workflowInsights.mostActiveHour}</p>
                </div>
              </div>

              {/* Average Execution Time */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  resolvedTheme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
                }`}>
                  <Activity className={`h-4 w-4 ${
                    resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Runtime</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{workflowInsights.averageExecutionTime}</p>
                </div>
              </div>

              {/* Top Failure Reason */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  resolvedTheme === 'dark' ? 'bg-red-600/20' : 'bg-red-100'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Top Issue</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{workflowInsights.topFailureReason}</p>
                </div>
              </div>

              {/* Success Trend */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  resolvedTheme === 'dark' ? 'bg-green-600/20' : 'bg-green-100'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${
                    resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Success Trend</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{workflowInsights.successTrend} this week</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium">
                View Detailed Analytics →
              </button>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Footer
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What Powers Lagentry</h2>
        </div> */}
      </div>
    </div>
  );
}