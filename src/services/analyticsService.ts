import { supabase, Workflow, WorkflowRun, IntegrationUsage } from '../lib/supabase';

// Get dashboard summary stats
export const getDashboardStats = async () => {
  try {
    // Get total workflows
    const { count: totalWorkflows } = await supabase
      .from('workflows')
      .select('*', { count: 'exact', head: true });

    // Get active workflows
    const { count: activeWorkflows } = await supabase
      .from('workflows')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get workflow runs stats
    const { data: runsStats } = await supabase
      .from('workflow_runs')
      .select('status, duration_seconds');

    const totalRuns = runsStats?.length || 0;
    const successfulRuns = runsStats?.filter(run => run.status === 'completed').length || 0;
    const failedRuns = runsStats?.filter(run => run.status === 'failed').length || 0;
    const avgDuration = runsStats?.length 
      ? runsStats.reduce((acc, run) => acc + (run.duration_seconds || 0), 0) / runsStats.length
      : 0;

    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    return {
      totalWorkflows: totalWorkflows || 0,
      activeWorkflows: activeWorkflows || 0,
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate: parseFloat(successRate.toFixed(1)),
      avgDuration: parseFloat(avgDuration.toFixed(1))
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get most used integrations
export const getMostUsedIntegrations = async (): Promise<IntegrationUsage[]> => {
  try {
    const { data, error } = await supabase
      .from('integration_usage')
      .select('*')
      .order('usage_count', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching integration usage:', error);
    throw error;
  }
};

// Get performance data for charts
export const getPerformanceData = async (timeframe: 'day' | 'week' | 'month' = 'week') => {
  try {
    const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: runs } = await supabase
      .from('workflow_runs')
      .select('started_at, status, duration_seconds')
      .gte('started_at', startDate.toISOString())
      .order('started_at', { ascending: true });

    // Group by day for chart display
    const groupedData: Record<string, { date: string, successful: number, failed: number }> = {};
    
    runs?.forEach(run => {
      const date = new Date(run.started_at).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = { date, successful: 0, failed: 0 };
      }
      if (run.status === 'completed') {
        groupedData[date].successful++;
      } else if (run.status === 'failed') {
        groupedData[date].failed++;
      }
    });

    return Object.values(groupedData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

// Get all workflows with basic info
export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};

// Get recent workflow runs
export const getRecentWorkflowRuns = async (limit: number = 10): Promise<(WorkflowRun & { workflow_name: string })[]> => {
  try {
    const { data, error } = await supabase
      .from('workflow_runs')
      .select(`
        *,
        workflows!inner(name)
      `)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return (data || []).map(run => ({
      ...run,
      workflow_name: run.workflows.name
    }));
  } catch (error) {
    console.error('Error fetching recent workflow runs:', error);
    throw error;
  }
};

// Get workflow runs stats
export const getWorkflowRunsStats = async () => {
  try {
    // Get total runs in the last week for comparison
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const { data: allRuns } = await supabase
      .from('workflow_runs')
      .select('status, started_at, duration_seconds');

    const { data: lastWeekRuns } = await supabase
      .from('workflow_runs')
      .select('status')
      .gte('started_at', lastWeek.toISOString());

    const totalRuns = allRuns?.length || 0;
    const successfulRuns = allRuns?.filter(run => run.status === 'completed').length || 0;
    const failedRuns = allRuns?.filter(run => run.status === 'failed').length || 0;
    const avgDuration = allRuns?.length 
      ? allRuns.reduce((acc, run) => acc + (run.duration_seconds || 0), 0) / allRuns.length
      : 0;

    const lastWeekTotal = lastWeekRuns?.length || 0;
    const growthRate = lastWeekTotal > 0 ? ((totalRuns - lastWeekTotal) / lastWeekTotal * 100) : 0;
    const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

    return {
      totalRuns,
      successfulRuns,
      failedRuns,
      avgDuration: parseFloat((avgDuration / 60).toFixed(1)), // Convert to minutes
      growthRate: parseFloat(growthRate.toFixed(1)),
      successRate: parseFloat(successRate.toFixed(1))
    };
  } catch (error) {
    console.error('Error fetching workflow runs stats:', error);
    throw error;
  }
};

// Get individual workflow analytics
export const getWorkflowAnalytics = async (workflowId: string) => {
  try {
    const { data: workflow } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    const { data: runs } = await supabase
      .from('workflow_runs')
      .select('*')
      .eq('workflow_id', workflowId)
      .order('started_at', { ascending: false });

    const { data: integrations } = await supabase
      .from('integration_usage')
      .select('*')
      .eq('workflow_id', workflowId);

    const totalRuns = runs?.length || 0;
    const successfulRuns = runs?.filter(run => run.status === 'completed').length || 0;
    const failedRuns = runs?.filter(run => run.status === 'failed').length || 0;
    const avgDuration = runs?.length 
      ? runs.reduce((acc, run) => acc + (run.duration_seconds || 0), 0) / runs.length
      : 0;

    return {
      workflow,
      runs: runs || [],
      integrations: integrations || [],
      stats: {
        totalRuns,
        successfulRuns,
        failedRuns,
        successRate: totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0,
        avgDuration: parseFloat(avgDuration.toFixed(1))
      }
    };
  } catch (error) {
    console.error('Error fetching workflow analytics:', error);
    throw error;
  }
};

// Update workflow configuration
export const updateWorkflowConfig = async (workflowId: string, updates: Partial<Workflow>) => {
  try {
    const { data, error } = await supabase
      .from('workflows')
      .update({ 
        ...updates, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', workflowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating workflow config:', error);
    throw error;
  }
};