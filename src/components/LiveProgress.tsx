import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface LiveProgressProps {
  isBuilding: boolean;
  progress: number;
}

export function LiveProgress({ isBuilding, progress }: LiveProgressProps) {
  const steps = [
    { id: 1, name: 'Parsing user prompt', status: progress > 16 ? 'complete' : progress > 0 ? 'current' : 'pending' },
    { id: 2, name: 'Identifying capabilities', status: progress > 33 ? 'complete' : progress > 16 ? 'current' : 'pending' },
    { id: 3, name: 'Setting up integrations', status: progress > 50 ? 'complete' : progress > 33 ? 'current' : 'pending' },
    { id: 4, name: 'Generating agent logic', status: progress > 66 ? 'complete' : progress > 50 ? 'current' : 'pending' },
    { id: 5, name: 'Configuring workflows', status: progress > 83 ? 'complete' : progress > 66 ? 'current' : 'pending' },
    { id: 6, name: 'Finalizing deployment', status: progress === 100 ? 'complete' : progress > 83 ? 'current' : 'pending' }
  ];

  return (
    <div className="h-full bg-gray-800 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Build Progress</h3>
        {isBuilding && (
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {step.status === 'complete' && (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
              {step.status === 'current' && (
                <Clock className="h-5 w-5 text-cyan-400 animate-spin" />
              )}
              {step.status === 'pending' && (
                <div className="h-5 w-5 bg-gray-600 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${
                step.status === 'complete' ? 'text-emerald-400' :
                step.status === 'current' ? 'text-cyan-400' :
                'text-gray-400'
              }`}>
                {step.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!isBuilding && progress === 0 && (
        <div className="mt-8 text-center">
          <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400">Start building to see live progress</p>
        </div>
      )}

      {progress === 100 && (
        <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <p className="text-emerald-400 font-medium">Agent built successfully!</p>
          </div>
          <p className="text-emerald-300 text-sm mt-1">
            Your AI agent is ready for testing and deployment.
          </p>
        </div>
      )}
    </div>
  );
}