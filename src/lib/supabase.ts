import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  n8n_workflow_id?: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  trigger_type?: string;
  schedule_expression?: string;
  system_prompt?: string;
  configuration?: any;
  integrations?: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  n8n_execution_id?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'minor' | 'moderate' | 'critical';
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  success_count: number;
  error_count: number;
  execution_data?: any;
  error_message?: string;
  trigger_data?: any;
}

export interface WorkflowAnalytics {
  id: string;
  workflow_id: string;
  date: string;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  avg_duration_seconds?: number;
  total_duration_seconds: number;
}

export interface IntegrationUsage {
  id: string;
  workflow_id: string;
  integration_name: string;
  usage_count: number;
  last_used_at: string;
  created_at: string;
}