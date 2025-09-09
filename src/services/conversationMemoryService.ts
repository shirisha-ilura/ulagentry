// Conversation Memory Service
// Maintains context and memory across the entire conversation session

export interface ConversationMemory {
  sessionId: string;
  originalPrompt: string;
  conversationHistory: ConversationEntry[];
  analysisResults: AnalysisMemory[];
  userPreferences: UserPreferences;
  workflowContext: WorkflowContext;
  createdAt: Date;
  lastUpdated: Date;
}

export interface ConversationEntry {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    clarification?: boolean;
    questionIndex?: number;
    responseTo?: string;
  };
}

export interface AnalysisMemory {
  prompt: string;
  analysis: any;
  requirements: any;
  strategy: string;
  clarifications: string[];
  userResponses: { [question: string]: string };
  timestamp: Date;
}

export interface UserPreferences {
  preferredConnections: string[];
  complexityPreference: 'simple' | 'medium' | 'complex';
  automationStyle: 'conservative' | 'balanced' | 'aggressive';
  notificationPreferences: string[];
}

export interface WorkflowContext {
  currentWorkflowId?: string;
  deployedWorkflows: string[];
  activeConnections: string[];
  lastDeploymentStatus: 'success' | 'error' | 'pending';
  deploymentMessages: string[];
}

export class ConversationMemoryService {
  private memory: ConversationMemory | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize memory for a new conversation
   */
  initializeMemory(originalPrompt: string): ConversationMemory {
    this.memory = {
      sessionId: this.sessionId,
      originalPrompt,
      conversationHistory: [],
      analysisResults: [],
      userPreferences: {
        preferredConnections: [],
        complexityPreference: 'medium',
        automationStyle: 'balanced',
        notificationPreferences: []
      },
      workflowContext: {
        deployedWorkflows: [],
        activeConnections: [],
        lastDeploymentStatus: 'pending',
        deploymentMessages: []
      },
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    return this.memory;
  }

  /**
   * Add a conversation entry to memory
   */
  addConversationEntry(entry: Omit<ConversationEntry, 'id' | 'timestamp'>): void {
    if (!this.memory) return;

    const conversationEntry: ConversationEntry = {
      ...entry,
      id: this.generateEntryId(),
      timestamp: new Date()
    };

    this.memory.conversationHistory.push(conversationEntry);
    this.memory.lastUpdated = new Date();
  }

  /**
   * Store analysis results
   */
  storeAnalysisResult(analysis: AnalysisMemory): void {
    if (!this.memory) return;

    this.memory.analysisResults.push(analysis);
    this.memory.lastUpdated = new Date();
  }

  /**
   * Get conversation context for LLM
   */
  getConversationContext(): string {
    if (!this.memory) return '';

    const context = [
      `Original Request: ${this.memory.originalPrompt}`,
      '',
      'Conversation History:',
      ...this.memory.conversationHistory.map(entry => 
        `${entry.type === 'user' ? 'User' : 'Agent'}: ${entry.content}`
      ),
      '',
      'Previous Analysis Results:',
      ...this.memory.analysisResults.map(result => 
        `- ${result.strategy} (${new Date(result.timestamp).toLocaleTimeString()})`
      ),
      '',
      'User Preferences:',
      `- Preferred Connections: ${this.memory.userPreferences.preferredConnections.join(', ')}`,
      `- Complexity Preference: ${this.memory.userPreferences.complexityPreference}`,
      `- Automation Style: ${this.memory.userPreferences.automationStyle}`,
      '',
      'Workflow Context:',
      `- Deployed Workflows: ${this.memory.workflowContext.deployedWorkflows.length}`,
      `- Active Connections: ${this.memory.workflowContext.activeConnections.join(', ')}`,
      `- Last Deployment: ${this.memory.workflowContext.lastDeploymentStatus}`
    ];

    return context.join('\n');
  }

  /**
   * Update user preferences based on conversation
   */
  updateUserPreferences(preferences: Partial<UserPreferences>): void {
    if (!this.memory) return;

    this.memory.userPreferences = {
      ...this.memory.userPreferences,
      ...preferences
    };
    this.memory.lastUpdated = new Date();
  }

  /**
   * Update workflow context
   */
  updateWorkflowContext(context: Partial<WorkflowContext>): void {
    if (!this.memory) return;

    this.memory.workflowContext = {
      ...this.memory.workflowContext,
      ...context
    };
    this.memory.lastUpdated = new Date();
  }

  /**
   * Get recent conversation entries
   */
  getRecentEntries(count: number = 10): ConversationEntry[] {
    if (!this.memory) return [];

    return this.memory.conversationHistory
      .slice(-count)
      .reverse();
  }

  /**
   * Check if user is asking a follow-up question
   */
  isFollowUpQuestion(userMessage: string): boolean {
    if (!this.memory || this.memory.conversationHistory.length === 0) return false;

    const followUpIndicators = [
      'what about',
      'how about',
      'can you also',
      'additionally',
      'also',
      'and',
      'but',
      'however',
      'what if',
      'suppose',
      'imagine',
      'let\'s say',
      'consider',
      'think about',
      'regarding',
      'concerning',
      'about that',
      'for that',
      'with that',
      'in that case'
    ];

    const lowerMessage = userMessage.toLowerCase();
    return followUpIndicators.some(indicator => 
      lowerMessage.includes(indicator)
    );
  }

  /**
   * Get relevant context for follow-up questions
   */
  getFollowUpContext(userMessage: string): string {
    if (!this.memory) return '';

    const context = this.getConversationContext();
    const recentAnalysis = this.memory.analysisResults[this.memory.analysisResults.length - 1];

    if (recentAnalysis) {
      return `${context}\n\nCurrent Workflow Context:\n${recentAnalysis.strategy}\n\nUser's follow-up: ${userMessage}`;
    }

    return context;
  }

  /**
   * Extract user preferences from conversation
   */
  extractUserPreferences(): UserPreferences {
    if (!this.memory) {
      return {
        preferredConnections: [],
        complexityPreference: 'medium',
        automationStyle: 'balanced',
        notificationPreferences: []
      };
    }

    const preferences: UserPreferences = {
      preferredConnections: [],
      complexityPreference: 'medium',
      automationStyle: 'balanced',
      notificationPreferences: []
    };

    // Analyze conversation history for preferences
    const history = this.memory.conversationHistory.map(entry => entry.content.toLowerCase());
    
    // Extract preferred connections
    if (history.some(h => h.includes('gmail') || h.includes('email'))) {
      preferences.preferredConnections.push('google');
    }
    if (history.some(h => h.includes('slack') || h.includes('message'))) {
      preferences.preferredConnections.push('slack');
    }
    if (history.some(h => h.includes('jira') || h.includes('ticket'))) {
      preferences.preferredConnections.push('jira');
    }
    if (history.some(h => h.includes('microsoft') || h.includes('outlook'))) {
      preferences.preferredConnections.push('microsoft');
    }

    // Extract complexity preference
    if (history.some(h => h.includes('simple') || h.includes('basic'))) {
      preferences.complexityPreference = 'simple';
    } else if (history.some(h => h.includes('complex') || h.includes('advanced'))) {
      preferences.complexityPreference = 'complex';
    }

    // Extract automation style
    if (history.some(h => h.includes('conservative') || h.includes('safe'))) {
      preferences.automationStyle = 'conservative';
    } else if (history.some(h => h.includes('aggressive') || h.includes('automated'))) {
      preferences.automationStyle = 'aggressive';
    }

    return preferences;
  }

  /**
   * Clear memory (for new session)
   */
  clearMemory(): void {
    this.memory = null;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Get memory summary
   */
  getMemorySummary(): string {
    if (!this.memory) return 'No conversation memory available.';

    return `Session: ${this.sessionId}
Duration: ${Math.round((Date.now() - this.memory.createdAt.getTime()) / 1000)}s
Messages: ${this.memory.conversationHistory.length}
Analyses: ${this.memory.analysisResults.length}
Workflows: ${this.memory.workflowContext.deployedWorkflows.length}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEntryId(): string {
    return `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create a singleton instance
export const conversationMemoryService = new ConversationMemoryService(); 