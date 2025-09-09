import React, { useState } from 'react';
import { WorkflowRuns } from './WorkflowRuns';
import { Analytics } from './Analytics';
import { Embed } from './Embed';
import { WorkflowDetail } from './WorkflowDetail';

type DashboardView = 'workflow-runs' | 'analytics' | 'embed' | 'workflow-detail';

interface DashboardProps {
  currentView: DashboardView;
  onViewChange?: (view: DashboardView) => void;
}

export function Dashboard({ currentView, onViewChange }: DashboardProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    onViewChange?.('workflow-detail');
  };

  const handleBackToWorkflows = () => {
    setSelectedWorkflowId(null);
    onViewChange?.('workflow-runs');
  };

  switch (currentView) {
    case 'workflow-runs':
      return <WorkflowRuns onWorkflowSelect={handleWorkflowSelect} />;
    case 'analytics':
      return <Analytics />;
    case 'embed':
      return <Embed />;
    case 'workflow-detail':
      return selectedWorkflowId ? (
        <WorkflowDetail 
          workflowId={selectedWorkflowId} 
          onBack={handleBackToWorkflows}
        />
      ) : (
        <WorkflowRuns onWorkflowSelect={handleWorkflowSelect} />
      );
    default:
      return <WorkflowRuns onWorkflowSelect={handleWorkflowSelect} />;
  }
} 