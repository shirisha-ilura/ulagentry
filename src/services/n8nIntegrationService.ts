// /**
// import { n8nConfig } from '../config/n8n';

// // n8n Integration Service
// // Handles workflow deployment, OAuth token management, and dynamic updates

// export interface N8nWorkflow {
//   id: string;
//   name: string;
//   active: boolean;
//   nodes: any[];
//   connections: any;
//   settings: any;
//   staticData: any;
//   tags: string[];
//   triggerCount: number;
//   updatedAt: string;
//   versionId: string;
// }

// export interface N8nCredentials {
//   id: string;
//   name: string;
//   type: string;
//   data: any;
//   nodesAccess: any[];
// }

// export interface WorkflowDeploymentConfig {
//   workflowName: string;
//   workflowData: any;
//   credentials: { [key: string]: any };
//   oauthTokens: { [provider: string]: string };
//   agentPrompts?: { [nodeId: string]: string };
// }

// export interface AgentUpdateRequest {
//   workflowId: string;
//   nodeId: string;
//   newPrompt: string;
//   context?: any;
// }

// export class N8nIntegrationService {
//   private n8nBaseUrl: string;
//   private apiKey: string;

//   constructor(n8nBaseUrl?: string, apiKey?: string) {
//     this.n8nBaseUrl = n8nBaseUrl || n8nConfig.baseUrl;
//     this.apiKey = apiKey || n8nConfig.apiKey;
//   }

//   /**
//    * Helper method to construct full URLs for n8n API calls
//    * Handles both direct URLs and proxy URLs correctly
//    */
//   /*
//   private buildUrl(path: string): string {
//     let finalUrl: string;
    
//     // If baseUrl starts with / (proxy mode), just concatenate
//     if (this.n8nBaseUrl.startsWith('/')) {
//       finalUrl = `${this.n8nBaseUrl}${path}`;
//     } else {
//       // If baseUrl is a full URL, ensure proper concatenation
//       const base = this.n8nBaseUrl.endsWith('/') ? this.n8nBaseUrl.slice(0, -1) : this.n8nBaseUrl;
//       finalUrl = `${base}${path}`;
//     }
    
//     console.log(`[n8n] Building URL: baseUrl="${this.n8nBaseUrl}", path="${path}" -> finalUrl="${finalUrl}"`);
//     return finalUrl;
//   }

//   /**
//    * Deploy a workflow to n8n
//    */
//   /*
//   async deployWorkflow(config: WorkflowDeploymentConfig): Promise<{ workflowId: string; success: boolean; message: string }> {
//     try {
//       console.log('🔧 [N8N SERVICE] Starting workflow deployment:', config.workflowName);
//       console.log('🔧 [N8N SERVICE] OAuth tokens received:', config.oauthTokens);
//       console.log('🔧 [N8N SERVICE] OAuth tokens available:', Object.keys(config.oauthTokens));
//       console.log('🔧 [N8N SERVICE] Original template data received:', {
//         nodeCount: config.workflowData?.nodes?.length || 0,
//         hasConnections: !!config.workflowData?.connections,
//         hasSettings: !!config.workflowData?.settings,
//         templateKeys: Object.keys(config.workflowData || {})
//       });
      
//       // Step 1: Extract credential requirements from template
//       const templateCredentials = this.extractCredentialsFromTemplate(config.workflowData);
//       console.log('🔧 [N8N SERVICE] Template requires credentials:', Object.keys(templateCredentials));
//       console.log('🔧 [N8N SERVICE] Credential details:', templateCredentials);
      
//       // Step 2: Map OAuth tokens to template credentials
//       const credentialMapping = this.mapOAuthTokensToCredentials(templateCredentials, config.oauthTokens);
//       console.log('🔧 [N8N SERVICE] Credential mapping:', credentialMapping);
      
//       // Step 3: Setup credentials in n8n
//       const credentialIds = await this.setupCredentials(credentialMapping, config.oauthTokens);
//       console.log('🔧 [N8N SERVICE] Created/Updated credential IDs:', credentialIds);
      
//       // Step 4: Prepare workflow data with credential references
//       const workflowData = this.prepareWorkflowData(config.workflowData, credentialIds);
//       console.log('🔧 [N8N SERVICE] Processed workflow data:', {
//         originalNodes: config.workflowData?.nodes?.length || 0,
//         processedNodes: workflowData?.nodes?.length || 0,
//         nodeComparison: this.compareNodes(config.workflowData?.nodes, workflowData?.nodes)
//       });
      
//       const payload = {
//         name: config.workflowName,
//         nodes: workflowData.nodes,
//         connections: workflowData.connections,
//         settings: this.filterSettings(workflowData.settings || {})
//       };
      
//       console.log('🔧 [N8N SERVICE] Final payload to n8n:', {
//         name: payload.name,
//         nodeCount: payload.nodes.length,
//         connectionsCount: Object.keys(payload.connections).length,
//         hasSettings: !!payload.settings,
//         sampleNode: payload.nodes[0] // Show first node as sample
//       });
      
//       // Step 5: Deploy workflow
//       const url = this.buildUrl('/api/v1/workflows');
//       console.log('🔧 [N8N SERVICE] Deploying to URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-N8N-API-KEY': this.apiKey,
//         },
//         body: JSON.stringify(payload),
//       });

//       console.log('🔧 [N8N SERVICE] Deploy response status:', response.status, response.statusText);
      
//       if (!response.ok) {
//         let errorMessage = `n8n API error: ${response.status} - ${response.statusText}`;
//         try {
//           const errorBody = await response.text();
//           console.error('🔧 [N8N SERVICE] Error response body:', errorBody);
//           errorMessage += ` - ${errorBody}`;
//         } catch (e) {
//           console.error('🔧 [N8N SERVICE] Could not read error response body');
//         }
//         throw new Error(errorMessage);
//       }

//       const result = await response.json();
//       console.log('🔧 [N8N SERVICE] Workflow created successfully:', result);
      
//       return {
//         workflowId: result.id,
//         success: true,
//         message: `Workflow "${config.workflowName}" deployed successfully with credentials`
//       };
//     } catch (error) {
//       console.error('Workflow deployment error:', error);
//       return {
//         workflowId: '',
//         success: false,
//         message: `Failed to deploy workflow: ${error}`
//       };
//     }
//   }

//   /**
//    * Extract credential requirements from template
//    */
//   /*
//   private extractCredentialsFromTemplate(templateData: any): { [credentialName: string]: any } {
//     const credentials: { [credentialName: string]: any } = {};
    
//     if (!templateData.nodes) return credentials;
    
//     templateData.nodes.forEach((node: any) => {
//       if (node.credentials) {
//         Object.entries(node.credentials).forEach(([credType, credInfo]: [string, any]) => {
//           if (credInfo && credInfo.name) {
//             // Use a standardized credential name based on type instead of template-specific names
//             const standardName = this.getStandardCredentialName(credType);
//             credentials[standardName] = {
//               type: credType,
//               name: standardName,
//               originalName: credInfo.name,
//               originalId: credInfo.id
//             };
//           }
//         });
//       }
//     });
    
//     console.log('🔧 [N8N SERVICE] Extracted credentials:', credentials);
//     return credentials;
//   }

//   /**
//    * Get standardized credential name based on type
//    */
//   /*
//   private getStandardCredentialName(credentialType: string): string {
//     const standardNames: { [key: string]: string } = {
//       // Google services
//       'gmailOAuth2': 'Gmail OAuth2',
//       'googleOAuth2Api': 'Google OAuth2 API',
//       'googleDriveOAuth2Api': 'Google Drive OAuth2 API',
//       'googleCalendarOAuth2Api': 'Google Calendar OAuth2 API',
//       'googleSheetsOAuth2Api': 'Google Sheets OAuth2 API',
      
//       // Communication platforms
//       'slackOAuth2Api': 'Slack OAuth2 API',
//       'microsoftOAuth2Api': 'Microsoft OAuth2 API',
      
//       // Project management
//       'atlassianOAuth2Api': 'Atlassian OAuth2 API',
//       'notionOAuth2Api': 'Notion OAuth2 API',
      
//       // AI and databases
//       'openAiApi': 'OpenAI API',
//       'pineconeApi': 'Pinecone API',
      
//       // HTTP Authentication types
//       'httpBasicAuth': 'HTTP Basic Auth',
//       'httpCustomAuth': 'HTTP Custom Auth',
//       'httpHeaderAuth': 'Google OAuth2 Header Auth',
//       'apiKey': 'API Key'
//     };
    
//     return standardNames[credentialType] || `${credentialType} Credential`;
//   }

//   /**
//    * Map OAuth tokens to template credentials
//    */
//   /*
//   private mapOAuthTokensToCredentials(templateCredentials: any, oauthTokens: any): any {
//     const credentialMapping: any = {};
    
//     // Credential type mapping (from template credential types to OAuth providers)
//     const typeToProviderMap: { [key: string]: string } = {
//       // Google services
//       'gmailOAuth2': 'google',
//       'googleOAuth2Api': 'google',
//       'googleDriveOAuth2Api': 'google',
//       'googleCalendarOAuth2Api': 'google',
//       'googleSheetsOAuth2Api': 'google',
      
//       // Other OAuth providers
//       'slackOAuth2Api': 'slack',
//       'atlassianOAuth2Api': 'atlassian',
//       'microsoftOAuth2Api': 'microsoft',
//       'notionOAuth2Api': 'notion',
      
//       // API key based services
//       'openAiApi': 'openai',
//       'pineconeApi': 'pinecone',
      
//       // HTTP Authentication
//       'httpHeaderAuth': 'google_header'
//     };
    
//     console.log('🔧 [N8N SERVICE] Available OAuth tokens:', Object.keys(oauthTokens));
//     console.log('🔧 [N8N SERVICE] Template credentials to map:', Object.keys(templateCredentials));
    
//     Object.entries(templateCredentials).forEach(([credName, credInfo]: [string, any]) => {
//       const provider = typeToProviderMap[credInfo.type];
//       console.log(`🔧 [N8N SERVICE] Mapping credential ${credName} (type: ${credInfo.type}) to provider: ${provider}`);
      
//       if (provider && oauthTokens[provider]) {
//         const tokenData = oauthTokens[provider];
//         console.log(`🔧 [N8N SERVICE] Found OAuth token for ${provider}:`, typeof tokenData);
        
//         credentialMapping[credName] = {
//           type: credInfo.type,
//           data: this.buildCredentialData(credInfo.type, tokenData),
//           nodesAccess: []
//         };
//         console.log(`✅ [N8N SERVICE] Mapped credential ${credName} successfully`);
//       } else {
//         console.warn(`⚠️ [N8N SERVICE] No OAuth token found for credential ${credName} (type: ${credInfo.type}, provider: ${provider})`);
//         console.warn(`⚠️ [N8N SERVICE] Available providers: ${Object.keys(oauthTokens).join(', ')}`);
//       }
//     });
    
//     console.log('🔧 [N8N SERVICE] Final credential mapping:', Object.keys(credentialMapping));
//     return credentialMapping;
//   }

//   /**
//    * Build credential data based on credential type
//    */
//   private buildCredentialData(credentialType: string, token: any): any {
//     console.log(`🔧 [N8N SERVICE] Building credential data for type: ${credentialType}`, {
//       tokenType: typeof token,
//       hasAccessToken: !!token.accessToken,
//       provider: token.provider
//     });

//     switch (credentialType) {
//       case 'openAiApi':
//         // OpenAI credentials use apiKey field
//         return {
//           apiKey: typeof token === 'string' ? token : token.accessToken
//         };
      
//       case 'gmailOAuth2':
//         // Gmail OAuth2 credentials - try alternative schema structure
//         // Based on n8n error, it might need different field structure
//         console.log('🔧 [N8N SERVICE] Creating Gmail OAuth2 credential with alternative schema');
        
//         // Try minimal structure first - n8n might auto-fill schema requirements
//         const basicCredential = {
//           clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '760635145596-j6eqirrf07k0gj4h0ppu98qb3fgfl9l8.apps.googleusercontent.com',
//           clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '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'
//         };

//         // Try adding access token if available
//         if (typeof token === 'object' && token.accessToken) {
//           (basicCredential as any).accessToken = token.accessToken;
//           if (token.refreshToken) {
//             (basicCredential as any).refreshToken = token.refreshToken;
//           }
//         }

//         return basicCredential;
      
//       case 'googleOAuth2Api':
//         // Google OAuth2 API
//         return {
//           accessToken: token.accessToken,
//           refreshToken: token.refreshToken || '',
//           clientId: '',
//           clientSecret: '',
//           scope: token.scopes ? token.scopes.join(' ') : 'https://www.googleapis.com/auth/userinfo.email',
//           tokenType: 'Bearer'
//         };
      
//       case 'googleDriveOAuth2Api':
//         // Google Drive OAuth2 API
//         return {
//           accessToken: token.accessToken,
//           refreshToken: token.refreshToken || '',
//           clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
//           clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
//           scope: token.scopes ? token.scopes.join(' ') : 'https://www.googleapis.com/auth/drive',
//           tokenType: 'Bearer'
//         };
      
//       case 'pineconeApi':
//         // Pinecone credentials use apiKey field
//         console.log('🔧 [N8N SERVICE] Creating Pinecone API credential');
//         return {
//           apiKey: typeof token === 'string' ? token : (token.apiKey || token.accessToken),
//           environment: token.environment || import.meta.env.VITE_PINECONE_ENVIRONMENT || 'us-east-1-aws'
//         };
      
//       case 'httpHeaderAuth':
//         // HTTP Header Auth for Google OAuth2 tokens
//         console.log('🔧 [N8N SERVICE] Creating HTTP Header Auth credential for Google OAuth2');
//         const accessToken = typeof token === 'string' ? token : token.accessToken;
//         return {
//           name: 'Authorization',
//           value: `Bearer ${accessToken}`
//         };
      
//       case 'slackOAuth2Api':
//       case 'atlassianOAuth2Api':
//       case 'microsoftOAuth2Api':
//       case 'notionOAuth2Api':
//         // Other OAuth2 credentials
//         return {
//           accessToken: token.accessToken,
//           refreshToken: token.refreshToken || '',
//           clientId: '',
//           clientSecret: '',
//           scope: token.scopes ? token.scopes.join(' ') : '',
//           tokenType: 'Bearer'
//         };
      
//       default:
//         // Default OAuth2 structure
//         console.warn(`🔧 [N8N SERVICE] Unknown credential type: ${credentialType}, using default OAuth2 structure`);
//         return {
//           accessToken: typeof token === 'string' ? token : token.accessToken,
//           refreshToken: token.refreshToken || '',
//           tokenType: 'Bearer'
//         };
//     }
//   }

//   /**
//    * Setup OAuth credentials in n8n
//    */
//   /*
//   private async setupCredentials(credentials: { [key: string]: any }, oauthTokens: { [provider: string]: any }): Promise<{ [key: string]: string }> {
//     const credentialIds: { [key: string]: string } = {};

//     console.log('🔧 [N8N SERVICE] Setting up credentials:', Object.keys(credentials));
//     console.log('🔧 [N8N SERVICE] Available OAuth tokens:', Object.keys(oauthTokens));

//     for (const [credentialName, credentialData] of Object.entries(credentials)) {
//       try {
//         console.log(`🔧 [N8N SERVICE] Processing credential: ${credentialName}`, credentialData);
        
//         // Check if credential already exists
//         const existingCreds = await this.findCredentialByName(credentialName);
        
//         if (existingCreds) {
//           console.log(`🔧 [N8N SERVICE] Updating existing credential: ${credentialName} (ID: ${existingCreds.id})`);
//           // Update existing credential with new tokens
//           const updateData = {
//             name: credentialName,
//             type: credentialData.type,
//             data: {
//               ...existingCreds.data,
//               ...credentialData.data
//             }
//           };
          
//           // For Gmail OAuth2, add the access token if we have it
//           if (credentialData.type === 'gmailOAuth2' && oauthTokens.google) {
//             const accessToken = typeof oauthTokens.google === 'string' ? oauthTokens.google : oauthTokens.google.accessToken;
//             updateData.data.accessToken = accessToken;
//             console.log('🔧 [N8N SERVICE] Adding access token to Gmail credential update');
//           }
          
//           await this.updateCredential(existingCreds.id, updateData);
//           credentialIds[credentialName] = existingCreds.id;
//           console.log(`✅ [N8N SERVICE] Updated credential ${credentialName} with ID: ${existingCreds.id}`);
//         } else {
//           console.log(`🔧 [N8N SERVICE] Creating new credential: ${credentialName}`);
//           // Create new credential with retry mechanism
//           const newCredential = await this.createCredentialWithRetry({
//             name: credentialName,
//             type: credentialData.type,
//             data: credentialData.data,
//             nodesAccess: credentialData.nodesAccess || []
//           });
//           credentialIds[credentialName] = newCredential.id;
//           console.log(`✅ [N8N SERVICE] Created new credential ${credentialName} with ID: ${newCredential.id}`);
          
//           // For Gmail OAuth2, update with access token after creation
//           if (credentialData.type === 'gmailOAuth2' && oauthTokens.google) {
//             try {
//               const accessToken = typeof oauthTokens.google === 'string' ? oauthTokens.google : oauthTokens.google.accessToken;
//               console.log('🔧 [N8N SERVICE] Updating Gmail credential with access token after creation');
              
//               // First, get the current credential to see its structure
//               const currentCred = await this.getCredential(newCredential.id);
//               console.log('🔧 [N8N SERVICE] Current credential structure:', JSON.stringify(currentCred, null, 2));
              
//               await this.updateCredential(newCredential.id, {
//                 name: credentialName,
//                 type: credentialData.type,
//                 data: {
//                   ...credentialData.data,
//                   accessToken: accessToken
//                 }
//               });
//               console.log('✅ [N8N SERVICE] Successfully added access token to Gmail credential');
//             } catch (error) {
//               console.error('⚠️ [N8N SERVICE] Failed to add access token to Gmail credential:', error);
//             }
//           }
//         }
//       } catch (error) {
//         console.error(`❌ [N8N SERVICE] Failed to setup credential ${credentialName}:`, error);
//         console.error(`❌ [N8N SERVICE] Error details for ${credentialName}:`, error instanceof Error ? error.message : String(error));
//         console.error(`❌ [N8N SERVICE] Full error object:`, error);
        
//         // Don't fail the entire deployment due to one credential failure
//         // This allows other credentials (like OpenAI) to still be created
//         // The template deployment will continue with available credentials
//         console.warn(`⚠️ [N8N SERVICE] Continuing deployment without ${credentialName} credential`);
//         console.warn(`⚠️ [N8N SERVICE] Nodes requiring ${credentialName} may need manual credential configuration in n8n`);
        
//         // Special handling for Gmail credentials - common issues with OAuth2 setup
//         if (credentialName === 'Gmail OAuth2') {
//           console.warn(`💡 [N8N SERVICE] Gmail OAuth2 setup failed. This is common due to:`);
//           console.warn(`   1. n8n API version differences`);
//           console.warn(`   2. OAuth2 schema requirements`);  
//           console.warn(`   3. Missing environment variables`);
//           console.warn(`   → Manual setup in n8n UI may be required for Gmail nodes`);
//         }
        
//         // Optionally store failed credentials for reporting
//         const failureReason = error instanceof Error ? error.message : String(error);
//         console.warn(`⚠️ [N8N SERVICE] ${credentialName} failure reason: ${failureReason}`);
//       }
//     }

//     console.log('🔧 [N8N SERVICE] Final credential IDs:', credentialIds);
//     return credentialIds;
//   }

//   /**
//    * Find credential by name
//    */
//   private async findCredentialByName(name: string): Promise<N8nCredentials | null> {
//     try {
//       const response = await fetch(this.buildUrl('/api/v1/credentials'), {
//         headers: {
//           'X-N8N-API-KEY': this.apiKey,
//         },
//       });

//       // Handle 405 Method Not Allowed - this endpoint might not support GET
//       if (response.status === 405) {
//         console.warn('⚠️ [N8N SERVICE] GET /credentials not supported (405), skipping credential lookup');
//         return null;
//       }

//       if (!response.ok) return null;

//       const credentials = await response.json();
//       return credentials.find((cred: N8nCredentials) => cred.name === name) || null;
//     } catch (error) {
//       console.error('Error finding credential:', error);
//       return null;
//     }
//   }

//   /**
//    * Create new credential
//    */
//   private async createCredential(credentialData: any): Promise<N8nCredentials> {
//     console.log('🔧 [N8N SERVICE] Creating credential with data:', {
//       name: credentialData.name,
//       type: credentialData.type,
//       dataKeys: Object.keys(credentialData.data || {}),
//       hasClientId: !!credentialData.data?.clientId,
//       hasAccessToken: !!credentialData.data?.accessToken
//     });

//     console.log('🔧 [N8N SERVICE] Full credential payload being sent to n8n:', JSON.stringify(credentialData, null, 2));

//     const response = await fetch(this.buildUrl('/api/v1/credentials'), {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-N8N-API-KEY': this.apiKey,
//       },
//       body: JSON.stringify(credentialData),
//     });

//     if (!response.ok) {
//       let errorDetails = `HTTP ${response.status} - ${response.statusText}`;
//       try {
//         const errorBody = await response.text();
//         errorDetails += ` - ${errorBody}`;
//         console.error('🔧 [N8N SERVICE] Credential creation failed:', errorDetails);
//       } catch (e) {
//         console.error('🔧 [N8N SERVICE] Could not read credential error response');
//       }
//       throw new Error(`Failed to create credential: ${errorDetails}`);
//     }

//     const result = await response.json();
//     console.log('🔧 [N8N SERVICE] Credential created successfully:', result.id);
//     return result;
//   }

//   /**
//    * Get credential by ID
//    */
//   private async getCredential(credentialId: string): Promise<N8nCredentials> {
//     const response = await fetch(this.buildUrl(`/api/v1/credentials/${credentialId}`), {
//       headers: {
//         'X-N8N-API-KEY': this.apiKey,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to get credential: ${response.statusText}`);
//     }

//     return await response.json();
//   }

//   /**
//    * Update existing credential
//    */
//   private async updateCredential(credentialId: string, credentialData: any): Promise<N8nCredentials> {
//     console.log('🔧 [N8N SERVICE] Attempting to update credential:', credentialId);
//     console.log('🔧 [N8N SERVICE] Update data:', JSON.stringify(credentialData, null, 2));

//     // Try PATCH method first (more common for partial updates)
//     let response = await fetch(this.buildUrl(`/api/v1/credentials/${credentialId}`), {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-N8N-API-KEY': this.apiKey,
//       },
//       body: JSON.stringify(credentialData),
//     });

//     // If PATCH fails, try PUT
//     if (!response.ok && response.status === 405) {
//       console.log('🔧 [N8N SERVICE] PATCH failed, trying PUT method');
//       response = await fetch(this.buildUrl(`/api/v1/credentials/${credentialId}`), {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-N8N-API-KEY': this.apiKey,
//         },
//         body: JSON.stringify(credentialData),
//       });
//     }

//     if (!response.ok) {
//       let errorDetails = `HTTP ${response.status} - ${response.statusText}`;
//       try {
//         const errorBody = await response.text();
//         errorDetails += ` - ${errorBody}`;
//         console.error('🔧 [N8N SERVICE] Credential update failed:', errorDetails);
//       } catch (e) {
//         console.error('🔧 [N8N SERVICE] Could not read credential update error response');
//       }
//       throw new Error(`Failed to update credential: ${errorDetails}`);
//     }

//     const result = await response.json();
//     console.log('🔧 [N8N SERVICE] Credential updated successfully');
//     return result;
//   }

//   /**
//    * Create credential with retry mechanism for handling transient failures
//    */
//   private async createCredentialWithRetry(credentialData: any, maxRetries: number = 3): Promise<N8nCredentials> {
//     let lastError: Error | null = null;
    
//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         console.log(`🔧 [N8N SERVICE] Credential creation attempt ${attempt}/${maxRetries} for: ${credentialData.name}`);
//         return await this.createCredential(credentialData);
//       } catch (error) {
//         lastError = error instanceof Error ? error : new Error(String(error));
//         console.error(`❌ [N8N SERVICE] Credential creation attempt ${attempt}/${maxRetries} failed for ${credentialData.name}:`, lastError.message);
        
//         if (attempt < maxRetries) {
//           // Wait before retrying (exponential backoff)
//           const delayMs = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
//           console.log(`🔄 [N8N SERVICE] Waiting ${delayMs}ms before retry...`);
//           await new Promise(resolve => setTimeout(resolve, delayMs));
//         }
//       }
//     }
    
//     // If all retries failed, throw the last error
//     console.error(`❌ [N8N SERVICE] All ${maxRetries} credential creation attempts failed for ${credentialData.name}`);
//     throw lastError || new Error('Failed to create credential after multiple attempts');
//   }

//   /**
//    * Prepare workflow data with credential references
//    */
//   private prepareWorkflowData(workflowData: any, credentialIds: { [key: string]: string }): any {
//     // Deep clone to avoid mutating the original template
//     const preparedData = JSON.parse(JSON.stringify(workflowData));
    
//     console.log('🔧 [N8N SERVICE] Preparing workflow data with credential IDs:', Object.keys(credentialIds));
//     console.log('🔧 [N8N SERVICE] Original template structure preserved:', {
//       nodeCount: preparedData.nodes?.length || 0,
//       hasConnections: !!preparedData.connections,
//       hasSettings: !!preparedData.settings,
//       hasPinData: !!preparedData.pinData,
//       hasMeta: !!preparedData.meta
//     });
    
//     // Update node credentials while preserving all other node properties
//     if (preparedData.nodes && Array.isArray(preparedData.nodes)) {
//       preparedData.nodes = preparedData.nodes.map((node: any) => {
//         // Create a copy of the node to avoid mutations
//         const updatedNode = { ...node };
        
//         if (node.credentials && Object.keys(node.credentials).length > 0) {
//           console.log(`🔧 [N8N SERVICE] Processing node ${node.name} (${node.type}) with credentials:`, node.credentials);
          
//           const updatedCredentials: any = {};
          
//           for (const [credentialType, credentialInfo] of Object.entries(node.credentials)) {
//             console.log(`🔧 [N8N SERVICE] Processing credential type: ${credentialType}`, credentialInfo);
            
//             // Get the standardized credential name for this type
//             const standardName = this.getStandardCredentialName(credentialType);
            
//             if (credentialIds[standardName]) {
//               // Only update the ID, preserve other properties from original credential info
//               updatedCredentials[credentialType] = {
//                 id: credentialIds[standardName],
//                 name: standardName,
//                 // Preserve any additional properties from the original credential
//                 ...(typeof credentialInfo === 'object' && credentialInfo !== null ? 
//                    Object.fromEntries(
//                      Object.entries(credentialInfo).filter(([key]) => key !== 'id' && key !== 'name')
//                    ) : {})
//               };
//               console.log(`✅ [N8N SERVICE] Mapped ${credentialType} to credential ID: ${credentialIds[standardName]}`);
//             } else {
//               // If we can't map the credential, provide helpful guidance
//               console.warn(`⚠️ [N8N SERVICE] No credential ID found for ${credentialType} (standard name: ${standardName})`);
//               console.warn(`⚠️ [N8N SERVICE] Available credential IDs: ${Object.keys(credentialIds).join(', ')}`);
//               console.warn(`⚠️ [N8N SERVICE] This likely means the credential creation failed earlier in the process`);
//               console.warn(`⚠️ [N8N SERVICE] Node ${node.name} will be deployed without this credential`);
              
//               // Keep original credential info but remove the old ID to avoid conflicts
//               // This allows the node to be deployed, but the credential will need to be set manually in n8n
//               if (typeof credentialInfo === 'object' && credentialInfo !== null) {
//                 updatedCredentials[credentialType] = {
//                   name: `Missing: ${(credentialInfo as any).name || standardName}`,
//                   // Remove old ID to avoid conflicts, n8n will handle missing credentials gracefully
//                   // The user will need to manually configure this credential in n8n
//                 };
//                 console.warn(`⚠️ [N8N SERVICE] Node ${node.name} credential '${credentialType}' marked as missing - manual setup required in n8n`);
//               }
//             }
//           }
          
//           updatedNode.credentials = updatedCredentials;
//           console.log(`🔧 [N8N SERVICE] Updated credentials for node ${node.name}:`, updatedCredentials);
//         }
        
//         return updatedNode;
//       });
//     } else {
//       console.warn('⚠️ [N8N SERVICE] No nodes found in workflow data or nodes is not an array');
//     }

//     console.log('🔧 [N8N SERVICE] Final prepared workflow structure:', {
//       nodeCount: preparedData.nodes?.length || 0,
//       connectionsCount: preparedData.connections ? Object.keys(preparedData.connections).length : 0,
//       hasSettings: !!preparedData.settings,
//       sampleNodeTypes: preparedData.nodes?.slice(0, 3).map((n: any) => n.type) || []
//     });

//     // Apply Google node conversion if we have Google header auth credentials
//     if (credentialIds['Google OAuth2 Header Auth']) {
//       console.log('🔧 [N8N SERVICE] Converting Google nodes to HTTP Request nodes');
//       return this.convertGoogleNodesToHttpRequest(preparedData, credentialIds);
//     }

//     return preparedData;
//   }

//   /**
//    * Convert Google OAuth2 nodes to HTTP Request nodes with header authentication
//    */
//   private convertGoogleNodesToHttpRequest(workflowData: any, credentialIds: { [key: string]: string }): any {
//     const convertedData = { ...workflowData };
    
//     console.log('🔄 [GOOGLE CONVERSION] Starting Google node conversion process');
    
//     if (!convertedData.nodes || !Array.isArray(convertedData.nodes)) {
//       console.warn('⚠️ [GOOGLE CONVERSION] No nodes to convert');
//       return convertedData;
//     }

//     const googleHeaderAuthId = credentialIds['Google OAuth2 Header Auth'];
    
//     convertedData.nodes = convertedData.nodes.map((node: any) => {
//       // Check if this is a Google node that needs conversion
//       if (this.isGoogleNode(node)) {
//         console.log(`🔄 [GOOGLE CONVERSION] Converting Google node: ${node.name} (${node.type})`);
        
//         try {
//           return this.convertGoogleNodeToHttpRequest(node, googleHeaderAuthId);
//         } catch (error) {
//           console.error(`❌ [GOOGLE CONVERSION] Failed to convert node ${node.name}:`, error);
//           console.warn(`⚠️ [GOOGLE CONVERSION] Keeping original node ${node.name} due to conversion error`);
//           return node; // Return original node if conversion fails
//         }
//       }
      
//       return node;
//     });
    
//     console.log('✅ [GOOGLE CONVERSION] Google node conversion completed');
//     return convertedData;
//   }

//   /**
//    * Check if a node is a Google service node that needs conversion
//    */
//   private isGoogleNode(node: any): boolean {
//     // Check node type
//     if (node.type === 'n8n-nodes-base.gmail' || 
//         node.type === 'n8n-nodes-base.googleDrive') {
//       return true;
//     }

//     // Check credentials
//     if (node.credentials) {
//       const credTypes = Object.keys(node.credentials);
//       return credTypes.some(credType => 
//         credType.includes('gmail') || 
//         credType.includes('googleDrive') || 
//         credType.includes('googleOAuth2')
//       );
//     }

//     return false;
//   }

//   /**
//    * Convert a specific Google node to HTTP Request node
//    */
//   private convertGoogleNodeToHttpRequest(node: any, headerAuthCredentialId: string): any {
//     console.log(`🔄 [GOOGLE CONVERSION] Converting ${node.type} node: ${node.name}`);
    
//     const convertedNode = {
//       ...node,
//       type: 'n8n-nodes-base.httpRequest',
//       credentials: {
//         httpHeaderAuth: {
//           id: headerAuthCredentialId,
//           name: 'Google OAuth2 Header Auth'
//         }
//       }
//     };

//     // Convert parameters based on original node type and operation
//     if (node.type === 'n8n-nodes-base.gmail') {
//       convertedNode.parameters = this.convertGmailNodeParameters(node.parameters || {});
//     } else if (node.type === 'n8n-nodes-base.googleDrive') {
//       convertedNode.parameters = this.convertGoogleDriveNodeParameters(node.parameters || {});
//     }

//     console.log(`✅ [GOOGLE CONVERSION] Converted ${node.name} to HTTP Request node`);
//     return convertedNode;
//   }

//   /**
//    * Convert Gmail node parameters to HTTP Request parameters
//    */
//   private convertGmailNodeParameters(originalParams: any): any {
//     const operation = originalParams.operation || 'getAll';
//     const resource = originalParams.resource || 'message';
    
//     console.log(`🔄 [GMAIL CONVERSION] Converting operation: ${resource}.${operation}`);

//     // Base parameters for HTTP Request with enhanced error handling
//     const baseParams = {
//       method: 'GET',
//       responseFormat: 'json' as const,
//       options: {
//         response: {
//           response: {
//             neverError: false, // Let n8n handle HTTP errors properly
//             fullResponse: false,
//             followRedirect: true
//           }
//         },
//         timeout: 30000, // 30 second timeout
//         retry: {
//           limit: 2,
//           factor: 2
//         }
//       }
//     };

//     // Convert based on resource and operation
//     if (resource === 'message') {
//       switch (operation) {
//         case 'getAll':
//           return {
//             ...baseParams,
//             url: 'https://www.googleapis.com/gmail/v1/users/me/messages',
//             qs: {
//               maxResults: originalParams.limit?.toString() || '10',
//               q: originalParams.query || ''
//             }
//           };

//         case 'get':
//           return {
//             ...baseParams,
//             url: `https://www.googleapis.com/gmail/v1/users/me/messages/\$\{$json.id\}`,
//             qs: {
//               format: originalParams.format || 'full'
//             }
//           };

//         case 'send':
//           return {
//             ...baseParams,
//             method: 'POST' as const,
//             url: 'https://www.googleapis.com/gmail/v1/users/me/messages/send',
//             body: {
//               raw: '={{ $json.raw }}'
//             }
//           };

//         default:
//           console.warn(`⚠️ [GMAIL CONVERSION] Unknown operation: ${operation}`);
//           return baseParams;
//       }
//     }

//     if (resource === 'draft') {
//       switch (operation) {
//         case 'create':
//           return {
//             ...baseParams,
//             method: 'POST' as const,
//             url: 'https://www.googleapis.com/gmail/v1/users/me/drafts',
//             body: {
//               message: {
//                 raw: '={{ $json.raw }}'
//               }
//             }
//           };

//         default:
//           console.warn(`⚠️ [GMAIL CONVERSION] Unknown draft operation: ${operation}`);
//           return baseParams;
//       }
//     }

//     return baseParams;
//   }

//   /**
//    * Convert Google Drive node parameters to HTTP Request parameters  
//    */
//   private convertGoogleDriveNodeParameters(originalParams: any): any {
//     const operation = originalParams.operation || 'download';
    
//     console.log(`🔄 [DRIVE CONVERSION] Converting operation: ${operation}`);

//     // Base parameters for HTTP Request with enhanced error handling
//     const baseParams = {
//       method: 'GET',
//       responseFormat: 'json' as const,
//       options: {
//         response: {
//           response: {
//             neverError: false, // Let n8n handle HTTP errors properly
//             fullResponse: false,
//             followRedirect: true
//           }
//         },
//         timeout: 30000, // 30 second timeout
//         retry: {
//           limit: 2,
//           factor: 2
//         }
//       }
//     };

//     switch (operation) {
//       case 'download':
//         // Handle both direct file ID and URL extraction
//         const fileIdExpression = originalParams.fileId?.value || originalParams.fileId || '{{ $json.fileId }}';
        
//         return {
//           ...baseParams,
//           method: 'GET' as const,
//           url: `=https://www.googleapis.com/drive/v3/files/${this.extractFileIdFromExpression(fileIdExpression)}?alt=media`,
//           responseFormat: 'file' as const
//         };

//       case 'list':
//         return {
//           ...baseParams,
//           url: 'https://www.googleapis.com/drive/v3/files',
//           qs: {
//             pageSize: originalParams.limit?.toString() || '100',
//             q: originalParams.query || '',
//             fields: 'files(id,name,mimeType,size,modifiedTime)'
//           }
//         };

//       case 'upload':
//         return {
//           ...baseParams,
//           method: 'POST' as const,
//           url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
//           sendBody: true,
//           contentType: 'multipart/related',
//           body: '={{ $json.uploadBody }}'
//         };

//       default:
//         console.warn(`⚠️ [DRIVE CONVERSION] Unknown operation: ${operation}`);
//         return baseParams;
//     }
//   }

//   /**
//    * Helper method to extract file ID from various expression formats
//    */
//   private extractFileIdFromExpression(expression: string): string {
//     console.log(`🔄 [FILE ID EXTRACTION] Processing expression: ${expression}`);
    
//     // Handle the specific case from templates: ={{ $json.file_url }}
//     if (expression.includes('file_url')) {
//       // This will extract file ID from Google Drive URLs like https://drive.google.com/file/d/FILE_ID/view
//       const result = '{{ $json.file_url.match(/\\/d\\/([a-zA-Z0-9-_]+)/)[1] }}';
//       console.log(`🔄 [FILE ID EXTRACTION] Converted file_url expression to: ${result}`);
//       return result;
//     }
    
//     // Handle resource locator format: __rl objects
//     if (typeof expression === 'object' && expression !== null) {
//       if ((expression as any).__rl && (expression as any).value) {
//         const value = (expression as any).value;
//         console.log(`🔄 [FILE ID EXTRACTION] Found resource locator value: ${value}`);
        
//         if (value.includes('file_url')) {
//           return '{{ $json.file_url.match(/\\/d\\/([a-zA-Z0-9-_]+)/)[1] }}';
//         }
        
//         return value;
//       }
//     }
    
//     // Handle direct n8n expressions like ={{...}} or {{...}}
//     if (expression.startsWith('={{') || expression.startsWith('{{')) {
//       const cleaned = expression.replace(/[={}]/g, '').trim();
//       console.log(`🔄 [FILE ID EXTRACTION] Cleaned expression: ${cleaned}`);
//       return cleaned;
//     }
    
//     // Handle direct file IDs
//     console.log(`🔄 [FILE ID EXTRACTION] Using expression as-is: ${expression}`);
//     return expression;
//   }

//   /**
//    * Activate a workflow
//    */
//   private async activateWorkflow(workflowId: string): Promise<void> {
//     const response = await fetch(this.buildUrl(`/api/v1/workflows/${workflowId}/activate`), {
//       method: 'POST',
//       headers: {
//         'X-N8N-API-KEY': this.apiKey,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to activate workflow: ${response.statusText}`);
//     }
//   }

//   /**
//    * Update agent prompt in a workflow
//    */
//   async updateAgentPrompt(request: AgentUpdateRequest): Promise<{ success: boolean; message: string }> {
//     try {
//       // Get current workflow
//       const workflowResponse = await fetch(this.buildUrl(`/api/v1/workflows/${request.workflowId}`), {
//         headers: {
//           'X-N8N-API-KEY': this.apiKey,
//         },
//       });

//       if (!workflowResponse.ok) {
//         throw new Error(`Failed to get workflow: ${workflowResponse.statusText}`);
//       }

//       const workflow = await workflowResponse.json();
      
//       // Find and update the specified node
//       const updatedNodes = workflow.nodes.map((node: any) => {
//         if (node.id === request.nodeId) {
//           // Update the prompt in the node parameters
//           if (node.parameters && node.parameters.prompt) {
//             node.parameters.prompt = request.newPrompt;
//           }
//           // If it's an AI node, update the system message
//           if (node.parameters && node.parameters.systemMessage) {
//             node.parameters.systemMessage = request.newPrompt;
//           }
//         }
//         return node;
//       });

//       // Update the workflow
//       const updateResponse = await fetch(this.buildUrl(`/api/v1/workflows/${request.workflowId}`), {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-N8N-API-KEY': this.apiKey,
//         },
//         body: JSON.stringify({
//           ...workflow,
//           nodes: updatedNodes
//         }),
//       });

//       if (!updateResponse.ok) {
//         throw new Error(`Failed to update workflow: ${updateResponse.statusText}`);
//       }

//       return {
//         success: true,
//         message: `Agent prompt updated successfully in workflow ${request.workflowId}`
//       };
//     } catch (error) {
//       console.error('Agent prompt update error:', error);
//       return {
//         success: false,
//         message: `Failed to update agent prompt: ${error}`
//       };
//     }
//   }

//   /**
//    * Get workflow status
//    */
//   async getWorkflowStatus(workflowId: string): Promise<{ active: boolean; lastExecution?: any }> {
//     try {
//       const response = await fetch(this.buildUrl(`/api/v1/workflows/${workflowId}`), {
//         headers: {
//           'X-N8N-API-KEY': this.apiKey,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to get workflow status: ${response.statusText}`);
//       }

//       const workflow = await response.json();
      
//       // Get last execution if available
//       const executionsResponse = await fetch(this.buildUrl(`/api/v1/executions?workflowId=${workflowId}&limit=1`), {
//         headers: {
//           'X-N8N-API-KEY': this.apiKey,
//         },
//       });

//       let lastExecution = null;
//       if (executionsResponse.ok) {
//         const executions = await executionsResponse.json();
//         lastExecution = executions.data?.[0] || null;
//       }

//       return {
//         active: workflow.active,
//         lastExecution
//       };
//     } catch (error) {
//       console.error('Error getting workflow status:', error);
//       return { active: false };
//     }
//   }

//   /**
//    * Test n8n connection
//    */
//   async testConnection(): Promise<boolean> {
//     try {
//       const candidatePaths = ['/healthz', '/health', '/api/v1/health'];
//       for (const path of candidatePaths) {
//         const url = this.buildUrl(path);
//         console.log('Testing n8n connection to:', url);
//         try {
//           const response = await fetch(url, {
//             headers: {
//               'X-N8N-API-KEY': this.apiKey,
//             },
//             cache: 'no-store' as RequestCache,
//           });
//           console.log('n8n health check response:', response.status, response.statusText);
//           if (response.ok || response.status === 304) return true;
//           // If public API is disabled, /api/v1/health may 404; try next path silently
//           if (response.status === 404) continue;
//         } catch (innerError) {
//           // Try next candidate path
//           console.warn('n8n health check attempt failed:', innerError);
//           continue;
//         }
//       }
//       return false;
//     } catch (error) {
//       console.error('n8n connection test failed:', error);
//       return false;
//     }
//   }

//   /**
//    * Get n8n instance information
//    */
//   async getInstanceInfo(): Promise<{ version: string; isConnected: boolean }> {
//     const candidatePaths = ['/healthz', '/health', '/api/v1/health'];
//     for (const path of candidatePaths) {
//       const url = this.buildUrl(path);
//       try {
//         const response = await fetch(url, {
//           headers: {
//             'X-N8N-API-KEY': this.apiKey,
//           },
//           cache: 'no-store' as RequestCache,
//         });

//         if (!response.ok && response.status !== 304) {
//           if (response.status === 404) continue; // try next path
//           return { version: 'unknown', isConnected: false };
//         }

//         // Try JSON first; if it fails, treat as basic health OK
//         try {
//           const health = await response.json();
//           return {
//             version: health.version || 'unknown',
//             isConnected: true,
//           };
//         } catch {
//           return { version: 'unknown', isConnected: true };
//         }
//       } catch (error) {
//         // try next path
//         continue;
//       }
//     }
//     return { version: 'unknown', isConnected: false };
//   }

//   /**
//    * Get all workflows from n8n
//    */
//   async getWorkflows(): Promise<N8nWorkflow[]> {
//     try {
//       const response = await fetch(this.buildUrl('/api/v1/workflows'), {
//         headers: {
//           'X-N8N-API-KEY': this.apiKey,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to get workflows: ${response.statusText}`);
//       }

//       const workflows = await response.json();
//       return workflows.data || workflows;
//     } catch (error) {
//       console.error('Failed to get workflows:', error);
//       return [];
//     }
//   }

//   /**
//    * Compare nodes before and after processing for debugging
//    */
//   private compareNodes(originalNodes: any[], processedNodes: any[]): any {
//     if (!originalNodes || !processedNodes) return { error: 'Missing node data' };
    
//     const comparison = {
//       originalCount: originalNodes.length,
//       processedCount: processedNodes.length,
//       credentialChanges: [] as any[]
//     };
    
//     for (let i = 0; i < Math.min(originalNodes.length, processedNodes.length); i++) {
//       const orig = originalNodes[i];
//       const proc = processedNodes[i];
      
//       if (JSON.stringify(orig.credentials) !== JSON.stringify(proc.credentials)) {
//         comparison.credentialChanges.push({
//           nodeId: orig.id,
//           nodeName: orig.name,
//           originalCredentials: orig.credentials,
//           processedCredentials: proc.credentials
//         });
//       }
//     }
    
//     return comparison;
//   }

//   /**
//    * Filter settings object to only include properties that n8n accepts during workflow creation
//    */
//   private filterSettings(settings: any): any {
//     if (!settings || typeof settings !== 'object') {
//       console.log('🔧 [N8N SERVICE] No settings provided, using empty object');
//       return {};
//     }

//     console.log('🔧 [N8N SERVICE] Original settings:', Object.keys(settings));
    
//     // List of known safe settings that n8n accepts during workflow creation
//     const safeSettings = [
//       'executionOrder',
//       'saveDataErrorExecution',
//       'saveDataSuccessExecution',
//       'saveManualExecutions',
//       'callerPolicy',
//       'executionTimeout',
//       'maxTimeout'
//     ];
    
//     // Filter to only include safe settings
//     const filteredSettings: any = {};
    
//     for (const [key, value] of Object.entries(settings)) {
//       if (safeSettings.includes(key)) {
//         filteredSettings[key] = value;
//         console.log(`🔧 [N8N SERVICE] Preserving setting: ${key}=${value}`);
//       } else {
//         console.log(`🔧 [N8N SERVICE] Filtering out potentially problematic setting: ${key}`);
//       }
//     }
    
//     // If we have no safe settings, return a minimal default
//     if (Object.keys(filteredSettings).length === 0) {
//       console.log('🔧 [N8N SERVICE] No safe settings found, using minimal defaults');
//       return {
//         executionOrder: 'v1' // Safe default execution order
//       };
//     }
    
//     console.log('🔧 [N8N SERVICE] Final filtered settings:', filteredSettings);
//     return filteredSettings;
//   }
// }

// // Create a singleton instance
// export const n8nIntegrationService = new N8nIntegrationService();
// */ 