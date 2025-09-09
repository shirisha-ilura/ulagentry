/*
// n8n Configuration
export const n8nConfig = {
  // n8n instance URL (using proxy to avoid CORS)
  // The proxy in vite.config.ts will forward /n8n-api/* to http://localhost:5678/*
  baseUrl: import.meta.env.VITE_N8N_BASE_URL || '/n8n-api',
  
  // n8n API key for authentication
  apiKey: import.meta.env.VITE_N8N_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMjMxNmIzZi0xM2M3LTQ0MDAtOGM1Ny02ZDRkMzExMTg4YjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU0NjAyMzk3fQ.Vv5ABBsPuSPlokmnWIkXBIqoKO9IQXFG893-fxfF7Fk',
  
  // Default workflow settings
  defaultSettings: {
    active: false, // Start workflows inactive for safety
    tags: ['auto-generated', 'ai-created'],
    timeout: 30000, // 30 seconds timeout for API calls
  },
  
  // Credential types mapping
  credentialTypes: {
    google: 'googleOAuth2Api',
    slack: 'slackOAuth2Api',
    jira: 'atlassianOAuth2Api',
    microsoft: 'microsoftOAuth2Api',
  },
  
  // Node types for different integrations
  nodeTypes: {
    gmail: 'n8n-nodes-base.gmail',
    jira: 'n8n-nodes-base.jira',
    slack: 'n8n-nodes-base.slack',
    openai: 'n8n-nodes-base.openAi',
    httpRequest: 'n8n-nodes-base.httpRequest',
    function: 'n8n-nodes-base.function',
  }
};

// Environment variables for easy configuration
export const getN8nConfig = () => ({
  baseUrl: import.meta.env.VITE_N8N_BASE_URL || n8nConfig.baseUrl,
  apiKey: import.meta.env.VITE_N8N_API_KEY || n8nConfig.apiKey,
});
*/ 