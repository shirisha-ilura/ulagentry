import { llmService, PromptAnalysis, WorkflowRequirement } from './llmService';

export interface WorkflowAnalysisResult {
  analysis: PromptAnalysis;
  projectPlan: string;
  requiredConnections: string[];
  estimatedComplexity: string;
  suggestedTemplate?: string;
  logs: string[];
}

export class WorkflowAnalysisService {
  private logs: string[] = [];
  private isAnalyzing: boolean = false;

  private addLog(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  /**
   * Analyze user prompt and generate workflow requirements
   */
  async analyzeUserPrompt(userPrompt: string): Promise<WorkflowAnalysisResult> {
    if (this.isAnalyzing) {
      // Debounce concurrent calls; return the last logs to UI quickly
      this.addLog('Another analysis is in progress, skipping duplicate request.');
      return {
        analysis: {
          requirements: {
            name: 'Pending Analysis',
            description: 'Analysis in progress',
            requiredConnections: [],
            estimatedComplexity: 'simple',
          },
          confidence: 0,
          reasoning: '',
          needsClarification: false,
          suggestedQuestions: [],
        },
        projectPlan: '',
        requiredConnections: [],
        estimatedComplexity: 'simple',
        suggestedTemplate: undefined,
        logs: [...this.logs],
      };
    }

    this.isAnalyzing = true;
    this.addLog('Starting workflow analysis for prompt: ' + userPrompt);
    
    try {
      // Step 1: Analyze prompt with LLM
      this.addLog('Step 1: Analyzing prompt with LLM...');
      const analysis = await llmService.analyzePrompt(userPrompt);
      this.addLog(`LLM analysis completed. Confidence: ${analysis.confidence}`);
      this.addLog(`Requirements: ${JSON.stringify(analysis.requirements, null, 2)}`);

      // Reclassify complexity for LLM-only tasks like summarization/categorization
      const desc = `${analysis.requirements.description || ''} ${analysis.requirements.name || ''}`.toLowerCase();
      const llmOnlySignals = ['summariz', 'categor', 'classif', 'extract', 'tag', 'summariser', 'summarizer'];
      if (llmOnlySignals.some(s => desc.includes(s))) {
        analysis.requirements.estimatedComplexity = 'simple';
      }

      // Step 2: Extract connection requirements (prefer those already in analysis)
      this.addLog('Step 2: Extracting connection requirements...');
      let connectionRequirements;
      if (analysis.requirements.requiredConnections && analysis.requirements.requiredConnections.length > 0) {
        // Build ConnectionRequirement entries from the provided connections
        connectionRequirements = analysis.requirements.requiredConnections.map((provider) => ({
          provider: provider.charAt(0).toUpperCase() + provider.slice(1),
          services: [],
          scopes: [],
          description: `Connection required for ${provider}`,
        }));
      } else {
        connectionRequirements = await llmService.extractConnectionRequirements(userPrompt);
      }
      this.addLog(`Connection requirements: ${JSON.stringify(connectionRequirements, null, 2)}`);

      // Step 3: Generate project plan
      this.addLog('Step 3: Generating project plan...');
      const projectPlan = this.generateProjectPlan(analysis.requirements, connectionRequirements);
      this.addLog('Project plan generated successfully');

      // Step 4: Generate n8n template if needed
      if (analysis.requirements.suggestedTemplate) {
        this.addLog('Step 4: Generating n8n workflow template...');
        try {
          const workflowTemplate = await llmService.generateWorkflowTemplate(analysis.requirements);
          this.addLog('n8n workflow template generated successfully');
          this.addLog(`Template preview: ${JSON.stringify(workflowTemplate, null, 2).substring(0, 200)}...`);
        } catch (error) {
          this.addLog(`Warning: Failed to generate n8n template: ${error}`);
        }
      } else {
        this.addLog('Step 4: No n8n template generation needed');
      }

      const result: WorkflowAnalysisResult = {
        analysis,
        projectPlan,
        requiredConnections: (analysis.requirements.requiredConnections?.length
          ? analysis.requirements.requiredConnections
          : (connectionRequirements || []).map((c: any) => (c.provider || '').toLowerCase())
        ).filter(Boolean),
        estimatedComplexity: analysis.requirements.estimatedComplexity,
        suggestedTemplate: analysis.requirements.suggestedTemplate,
        logs: [...this.logs]
      };

      return result;
    } catch (error) {
      this.addLog(`Workflow analysis failed: ${error}`);
      throw error;
    } finally {
      this.isAnalyzing = false;
    }
  }

  /**
   * Generate a human-readable project plan
   */
  private generateProjectPlan(requirements: WorkflowRequirement, connections: any[]): string {
    this.addLog('Generating project plan...');

    const plan = `I'll help you build ${requirements.name}. Here's my project plan:

What I'll Build:
${requirements.description}

Integrations:
${connections.map(conn => `• ${conn.provider} (${conn.services.join(', ')})`).join('\n')}

Capabilities:
${this.generateCapabilities(requirements)}

Required Connections:
${requirements.requiredConnections.map(conn => `• ${conn}`).join('\n')}

Strategy:
${requirements.strategy || this.generateFallbackStrategy(requirements)}

${requirements.followUpQuestions && requirements.followUpQuestions.length > 0 ? 
  `\nQuestions for Clarification:\n${requirements.followUpQuestions.map(q => `• ${q}`).join('\n')}` : ''}

${requirements.additionalNotes ? `Additional Notes: ${requirements.additionalNotes}` : ''}

Please approve if this plan looks good to you, and I'll start building the architecture!`;

    this.addLog('Project plan generated');
    return plan;
  }

  /**
   * Generate fallback strategy if LLM doesn't provide one
   */
  private generateFallbackStrategy(requirements: WorkflowRequirement): string {
    const strategy = [];
    
    // Basic strategy based on connections
    if (requirements.requiredConnections.includes('google')) {
      strategy.push('• Monitor and process email data from Gmail');
    }
    
    if (requirements.requiredConnections.includes('jira')) {
      strategy.push('• Create and manage tickets in Jira');
    }
    
    if (requirements.requiredConnections.includes('slack')) {
      strategy.push('• Send notifications and messages via Slack');
    }
    
    if (requirements.requiredConnections.includes('microsoft')) {
      strategy.push('• Process data from Microsoft services');
    }
    
    strategy.push('• Use AI to intelligently process and analyze data');
    strategy.push('• Handle edge cases and error scenarios');
    
    return strategy.join('\n');
  }

  /**
   * Generate capabilities based on requirements
   */
  private generateCapabilities(requirements: WorkflowRequirement): string {
    const capabilities = [];
    
    if (requirements.requiredConnections.includes('google')) {
      capabilities.push('• Access and process Gmail emails');
      capabilities.push('• Manage Google Drive files');
      capabilities.push('• Handle Google Calendar events');
    }
    
    if (requirements.requiredConnections.includes('slack')) {
      capabilities.push('• Send and receive Slack messages');
      capabilities.push('• Manage Slack channels');
      capabilities.push('• Handle Slack user interactions');
    }
    
    if (requirements.requiredConnections.includes('jira')) {
      capabilities.push('• Create and manage Jira issues');
      capabilities.push('• Track project progress');
      capabilities.push('• Handle Jira workflows');
    }
    
    if (requirements.requiredConnections.includes('microsoft')) {
      capabilities.push('• Process Outlook emails');
      capabilities.push('• Manage Teams communications');
      capabilities.push('• Handle SharePoint documents');
    }

    // Add AI capabilities
    capabilities.push('• Natural language processing and understanding');
    capabilities.push('• Intelligent data analysis and insights');
    capabilities.push('• Automated workflow execution');

    return capabilities.join('\n');
  }

  /**
   * Get all logs
   */
  getLogs(): string[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }
}

// Create a singleton instance
export const workflowAnalysisService = new WorkflowAnalysisService(); 