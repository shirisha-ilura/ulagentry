import { conversationMemoryService, ConversationMemory } from './conversationMemoryService';

// LLM Service for prompt analysis and workflow generation
// This service will handle communication with OpenAI gpt-4o-mini for analyzing user prompts
// and extracting workflow requirements

export interface WorkflowRequirement {
  name: string;
  description: string;
  requiredConnections: string[];
  estimatedComplexity: 'simple' | 'medium' | 'complex';
  suggestedTemplate?: string;
  additionalNotes?: string;
  strategy?: string;
  followUpQuestions?: string[];
  clarifications?: string[];
}

export interface PromptAnalysis {
  requirements: WorkflowRequirement;
  confidence: number;
  reasoning: string;
  needsClarification: boolean;
  suggestedQuestions?: string[];
}

export interface ConnectionRequirement {
  provider: string;
  services: string[];
  scopes: string[];
  description: string;
}

export interface StrategySession {
  sessionId: string;
  currentPrompt: string;
  analysis: PromptAnalysis;
  userResponses: { [question: string]: string };
  isComplete: boolean;
  finalStrategy?: string;
}

export class LLMService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';
  private model: string = 'gpt-4o-mini';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
  }

  /**
   * Analyze a user prompt to extract workflow requirements
   */
  async analyzePrompt(prompt: string, useMemory: boolean = true): Promise<PromptAnalysis> {
    const systemPrompt = `You are an expert workflow automation analyst with deep knowledge of n8n, OAuth integrations, and business process automation.

Your role is to:
1. Analyze user prompts contextually and intelligently
2. Identify what the user wants to automate
3. Determine required OAuth connections and their specific use cases
4. Generate detailed, contextual strategies (not generic ones)
5. Ask follow-up questions ONLY for CRITICAL missing information
6. Consider edge cases and potential failure scenarios
7. Suggest specific implementation approaches
8. Use conversation memory to provide context-aware responses

IMPORTANT:
- Do NOT label workflows as "complex" if they can be implemented with a single LLM step (e.g., summarizing, categorizing, extracting, tagging). Prefer "simple"; use "medium" only if there are multiple integrations or branching logic.

Available OAuth providers and their capabilities:
- Google: Gmail (email monitoring, filtering, parsing), Drive (file operations), Calendar (event management)
- Slack: Channels (message monitoring, posting), Messages (communication workflows), Users (team management)
- Jira: Issues (ticket creation, updates, tracking), Projects (project management), Boards (agile workflows)
- Microsoft: Outlook (email processing), Teams (communication), SharePoint (document management)

For strategy generation, be specific and contextual:
- Don't use generic keywords like "bug", "error"
- Analyze the actual use case and suggest specific detection methods
- Consider the business context and user's specific needs
- Think about edge cases and error handling

Response format:
{
  "requirements": {
    "name": "Specific workflow name",
    "description": "Detailed description of what this workflow does",
    "requiredConnections": ["google", "slack"],
    "estimatedComplexity": "simple|medium|complex",
    "suggestedTemplate": "template_id_or_none",
    "additionalNotes": "Implementation notes",
    "strategy": "Detailed, contextual strategy for this specific use case",
    "followUpQuestions": ["Question 1", "Question 2"],
    "clarifications": ["Clarification needed for X"]
  },
  "confidence": 0.95,
  "reasoning": "Why this analysis was made",
  "needsClarification": true/false,
  "suggestedQuestions": ["What specific issues should trigger tickets?", "How should priority be determined?"]
}`;

    // Get conversation context if memory is enabled
    let conversationContext = '';
    if (useMemory) {
      conversationContext = conversationMemoryService.getConversationContext();
    }

    const userPrompt = `Analyze this user prompt: "${prompt}"

${conversationContext ? `Conversation Context:\n${conversationContext}\n\n` : ''}Provide a detailed, contextual analysis. Only ask for clarifications if the information is CRITICAL for workflow creation. Make reasonable assumptions for non-critical details. Generate a strategy that is specific to this use case, not generic.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        // Provide a graceful local fallback so the UI can proceed
        if (response.status === 401) {
          const fallback: PromptAnalysis = {
            requirements: {
              name: 'Workflow Draft',
              description: `Draft plan for: ${prompt}`,
              requiredConnections: [],
              estimatedComplexity: 'simple',
              suggestedTemplate: undefined,
              additionalNotes: 'Generated with local fallback due to missing/invalid OpenAI API key.',
              strategy: 'Use available integrations and an LLM step to achieve the goal.',
              followUpQuestions: [],
              clarifications: []
            },
            confidence: 0.1,
            reasoning: 'Fallback used because OpenAI API returned 401',
            needsClarification: false,
            suggestedQuestions: []
          };
          return fallback;
        }
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Parse the JSON response
      const analysis = JSON.parse(content) as PromptAnalysis;

      // Post-process to avoid "complex" for LLM-only tasks
      const text = `${analysis?.requirements?.name || ''} ${analysis?.requirements?.description || ''}`.toLowerCase();
      const isLLMOnly = ['summariz', 'categor', 'classif', 'extract', 'tag', 'summaris', 'summarizer'].some(k => text.includes(k));
      if (isLLMOnly) {
        analysis.requirements.estimatedComplexity = 'simple';
      }

      return analysis;
    } catch (error) {
      console.error('LLM analysis error:', error);
      throw new Error('Failed to analyze prompt');
    }
  }

  /**
   * Generate n8n workflow template based on requirements
   */
  async generateWorkflowTemplate(requirements: WorkflowRequirement): Promise<any> {
    const systemPrompt = `You are an expert n8n workflow designer. Create a complete n8n workflow JSON template based on the given requirements.

IMPORTANT: You must respond with ONLY valid JSON. Do not include any explanatory text, markdown, or other formatting.

The workflow should:
1. Include all necessary nodes for the specified connections
2. Have proper OAuth credential placeholders
3. Follow n8n best practices
4. Be ready for deployment

Response format: Return ONLY the n8n workflow JSON object, no other text.`;

    const userPrompt = `Create an n8n workflow for:
- Name: ${requirements.name}
- Description: ${requirements.description}
- Required connections: ${requirements.requiredConnections.join(', ')}
- Additional notes: ${requirements.additionalNotes || 'None'}

Generate ONLY the n8n workflow JSON template.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Clean the content to extract JSON
      let jsonContent = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/, '').replace(/```\n?/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/, '').replace(/```\n?/, '');
      }

      // Try to parse the JSON
      try {
        const workflowTemplate = JSON.parse(jsonContent);
        return workflowTemplate;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw content:', content);
        throw new Error('Invalid JSON response from LLM');
      }
    } catch (error) {
      console.error('Workflow generation error:', error);
      throw new Error('Failed to generate workflow template');
    }
  }

  /**
   * Extract connection requirements from a prompt
   */
  async extractConnectionRequirements(prompt: string): Promise<ConnectionRequirement[]> {
    const systemPrompt = `You are an expert at identifying OAuth connection requirements from user prompts.

Available providers and their services:
- Google: Gmail (emails), Drive (files), Calendar (events)
- Slack: Channels (workspace), Messages (communication), Users (team)
- Jira: Issues (tickets), Projects (management), Boards (agile)
- Microsoft: Outlook (emails), Teams (communication), SharePoint (files)

For each required connection, provide:
- provider: The OAuth provider name
- services: Array of specific services needed
- scopes: Array of OAuth scopes required
- description: Why this connection is needed

Response format: JSON array of ConnectionRequirement objects.`;

    const userPrompt = `Analyze this prompt and identify all required OAuth connections: "${prompt}"`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Parse the JSON response
      const requirements = JSON.parse(content);
      return requirements as ConnectionRequirement[];
    } catch (error) {
      console.error('Connection extraction error:', error);
      throw new Error('Failed to extract connection requirements');
    }
  }

  /**
   * Validate if a workflow template is correct
   */
  async validateWorkflowTemplate(template: any): Promise<{ isValid: boolean; errors: string[] }> {
    const systemPrompt = `You are an expert n8n workflow validator. Check if the provided workflow template is valid and complete.

Validation criteria:
1. All nodes have proper configuration
2. OAuth credentials are properly referenced
3. Workflow structure is logical
4. No missing required fields
5. Follows n8n best practices

Response format:
{
  "isValid": true/false,
  "errors": ["error1", "error2"]
}`;

    const userPrompt = `Validate this n8n workflow template: ${JSON.stringify(template, null, 2)}`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Parse the JSON response
      const validation = JSON.parse(content);
      return validation as { isValid: boolean; errors: string[] };
    } catch (error) {
      console.error('Template validation error:', error);
      throw new Error('Failed to validate workflow template');
    }
  }

  /**
   * Generate a deployment plan based on an existing template
   */
  async generateTemplateDeploymentPlan(template: any, userPrompt: string): Promise<string> {
    const systemPrompt = `You are an expert workflow automation specialist. Your task is to explain how an existing n8n workflow template will fulfill the user's request.

Your response should:
1. Explain what the template does in simple terms
2. List the required connections and what they're used for
3. Describe the workflow steps and their purpose
4. Mention any configuration needed
5. Be encouraging and professional

Keep the response concise but informative (2-3 paragraphs max).`;

    // Add safety checks for template properties
    const templateName = template?.name || 'Unknown Template';
    const templateDescription = template?.description || 'No description available';
    const requiredConnections = template?.requiredConnections || [];
    const complexity = template?.complexity || 'unknown';

    const userPromptText = `User Request: "${userPrompt}"

Template Details:
- Name: ${templateName}
- Description: ${templateDescription}
- Required Connections: ${Array.isArray(requiredConnections) ? requiredConnections.join(', ') : 'None specified'}
- Complexity: ${complexity}

Please explain how this template will fulfill the user's request and what they need to know about deploying it.`;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPromptText }
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return content;
    } catch (error) {
      console.error('Template plan generation error:', error);
      // Return a fallback plan with safe property access
      const connectionsText = Array.isArray(requiredConnections) && requiredConnections.length > 0 
        ? requiredConnections.join(', ') 
        : 'various services as needed';
        
      return `I found a perfect match for your request! 

Template: ${templateName}
Description: ${templateDescription}

This template will be deployed directly to n8n and will handle your requirements automatically. The workflow requires connections to: ${connectionsText}.

Would you like me to proceed with deploying this template?`;
    }
  }
}

// Create a singleton instance
export const llmService = new LLMService(); 