import React from 'react';
import { Play, Users, MessageCircle, CreditCard, User, Calendar } from 'lucide-react';

interface PreConfiguredAgent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const preConfiguredAgents: PreConfiguredAgent[] = [
  {
    id: 'l1-operations',
    title: 'L1 Operations Agent',
    description: 'Automate routine operational tasks and workflows',
    icon: <Play className="h-6 w-6" />,
    category: 'Operations'
  },
  {
    id: 'customer-support',
    title: 'Customer Support Agent',
    description: 'Handle customer inquiries and provide instant support',
    icon: <MessageCircle className="h-6 w-6" />,
    category: 'Support'
  },
  {
    id: 'debt-collection',
    title: 'Debt Collection Agent',
    description: 'Manage payment reminders and collection processes',
    icon: <CreditCard className="h-6 w-6" />,
    category: 'Finance'
  },
  {
    id: 'personal-assistant',
    title: 'Personal Assistant Agent',
    description: 'Schedule meetings and manage daily tasks',
    icon: <User className="h-6 w-6" />,
    category: 'Productivity'
  },
  {
    id: 'team-coordinator',
    title: 'Team Coordinator Agent',
    description: 'Facilitate team collaboration and project coordination',
    icon: <Users className="h-6 w-6" />,
    category: 'Management'
  },
  {
    id: 'scheduler',
    title: 'Scheduling Assistant',
    description: 'Optimize calendar management and meeting scheduling',
    icon: <Calendar className="h-6 w-6" />,
    category: 'Productivity'
  }
];

interface PreConfiguredAgentsProps {
  onLaunchAgent: (agentId: string) => void;
}

export function PreConfiguredAgents({ onLaunchAgent }: PreConfiguredAgentsProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
          Launch Pre-configured Agents
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
          Choose from our curated collection of ready-to-deploy AI agents designed for common business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {preConfiguredAgents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onLaunchAgent(agent.id)}
            className="group relative bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 dark:hover:shadow-[#8B5CF6]/20"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-[#8B5CF6]/15 border border-orange-200 dark:border-[#8B5CF6]/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-[#8B5CF6] group-hover:bg-orange-200 dark:group-hover:bg-[#8B5CF6]/25 group-hover:border-orange-300 dark:group-hover:border-[#8B5CF6]/50 transition-all duration-300">
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-[#8B5CF6] transition-colors duration-300">
                  {agent.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed transition-colors duration-300">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-[#8B5CF6]/15 text-orange-700 dark:text-[#8B5CF6] border border-orange-200 dark:border-[#8B5CF6]/30 transition-colors duration-300"> */}
                    {agent.category}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-orange-500 dark:bg-[#8B5CF6] rounded-full flex items-center justify-center">
                      <Play className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 