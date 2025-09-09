import React from 'react';
import { TrendingUp, Users, MessageSquare, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export function AnalyticsDashboard() {
  const metrics = [
    { 
      name: 'Total Interactions', 
      value: '12,847', 
      change: '+12%', 
      icon: MessageSquare, 
      positive: true 
    },
    { 
      name: 'Active Users', 
      value: '2,341', 
      change: '+8%', 
      icon: Users, 
      positive: true 
    },
    { 
      name: 'Avg Response Time', 
      value: '1.2s', 
      change: '-15%', 
      icon: Clock, 
      positive: true 
    },
    { 
      name: 'Success Rate', 
      value: '94.5%', 
      change: '+3%', 
      icon: CheckCircle, 
      positive: true 
    }
  ];

  const recentActivity = [
    { id: 1, type: 'success', message: 'Agent deployed successfully', time: '2 minutes ago' },
    { id: 2, type: 'info', message: 'New integration added: Slack', time: '15 minutes ago' },
    { id: 3, type: 'warning', message: 'High response time detected', time: '1 hour ago' },
    { id: 4, type: 'success', message: 'Template updated: Customer Support', time: '2 hours ago' },
    { id: 5, type: 'info', message: 'Analytics report generated', time: '3 hours ago' }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>
        <p className="text-gray-300">Monitor your AI agents' performance and usage</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-5 w-5 text-gray-500" />
                <span className={`text-sm font-medium ${
                  metric.positive ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-sm text-gray-300">{metric.name}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h4 className="font-medium text-white mb-4">Usage Trends</h4>
          <div className="h-48 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
              <p className="text-gray-300">Interactive charts coming soon</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h4 className="font-medium text-white mb-4">Recent Activity</h4>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-emerald-400' :
                  activity.type === 'warning' ? 'bg-amber-400' :
                  'bg-cyan-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h4 className="font-medium text-white mb-4">Performance Summary</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Successful Requests</span>
                <span className="text-white">94.5%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full" style={{ width: '94.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Integration Health</span>
                <span className="text-white">87%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">User Satisfaction</span>
                <span className="text-white">91%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{ width: '91%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}