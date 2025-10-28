import Anthropic from '@anthropic-ai/sdk';
import { AgentConfig, ApiProvider } from './types';
import { 
  generateIntelligentlyWithGemini, 
  generateIntelligentlyWithClaude, 
  generateIntelligentlyWithOpenRouter 
} from './utils-intelligent';

// Parse API errors into user-friendly messages
export function parseApiError(error: any): string {
  // Handle Anthropic API errors
  if (error?.error?.message) {
    const message = error.error.message;
    
    // Credit/billing issues
    if (message.includes('credit balance is too low')) {
      return '💳 Your Claude API credits are low. Please add credits at console.anthropic.com/settings/billing';
    }
    if (message.includes('rate limit')) {
      return '⏱️ Rate limit reached. Please wait a moment and try again.';
    }
    if (message.includes('invalid API key') || message.includes('authentication')) {
      return '🔑 Invalid API key. Please check your Claude API key in Settings.';
    }
    
    // Return the original message if it's user-friendly
    return `❌ ${message}`;
  }
  
  // Handle Gemini API errors
  if (error?.message) {
    const message = error.message;
    
    if (message.includes('API key not valid')) {
      return '🔑 Invalid API key. Please check your Gemini API key in Settings.';
    }
    if (message.includes('quota')) {
      return '⏱️ API quota exceeded. Please check your usage at aistudio.google.com';
    }
    if (message.includes('API request failed')) {
      return '🌐 Network error. Please check your internet connection and try again.';
    }
  }
  
  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return '🌐 Network error. Please check your internet connection.';
  }
  
  // Handle JSON parsing errors
  if (error instanceof SyntaxError) {
    return '⚠️ AI generated invalid response. Please try again with a different description.';
  }
  
  // Generic fallback
  return `❌ Something went wrong: ${error?.message || 'Unknown error'}`;
}

export function formatAgentName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateMarkdown(config: AgentConfig): string {
  const { name, description, systemPrompt, tools, model, inheritAllTools } = config;
  
  let frontmatter = `---\nname: ${name}\ndescription: ${description}`;
  
  if (!inheritAllTools && tools.length > 0) {
    frontmatter += `\ntools: ${tools.join(', ')}`;
  }
  
  if (model !== 'inherit') {
    frontmatter += `\nmodel: ${model}`;
  }
  
  frontmatter += '\n---\n\n';
  
  return frontmatter + systemPrompt;
}

export function validateConfig(config: AgentConfig): string[] {
  const errors: string[] = [];
  
  if (!config.name || config.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!/^[a-z0-9-]+$/.test(config.name)) {
    errors.push('Name must contain only lowercase letters, numbers, and hyphens');
  }
  
  if (!config.description || config.description.length < 20) {
    errors.push('Description must be at least 20 characters');
  }
  
  if (!config.systemPrompt || config.systemPrompt.length < 50) {
    errors.push('System prompt must be at least 50 characters');
  }
  
  return errors;
}

export async function generateWithAI(
  userDescription: string,
  apiKey: string,
  provider: ApiProvider = 'gemini',
  modelId?: string
): Promise<AgentConfig> {
  if (provider === 'claude') {
    return generateWithClaude(userDescription, apiKey, modelId);
  }
  if (provider === 'openrouter') {
    return generateWithOpenRouter(userDescription, apiKey, modelId);
  }
  return generateWithGemini(userDescription, apiKey, modelId);
}

// Intelligent batch generation - AI decides if one or multiple agents needed
export async function generateAgentsIntelligently(
  userDescription: string,
  apiKey: string,
  provider: ApiProvider = 'gemini',
  modelId?: string
): Promise<AgentConfig[]> {
  if (provider === 'claude') {
    return generateIntelligentlyWithClaude(userDescription, apiKey, modelId);
  }
  if (provider === 'openrouter') {
    return generateIntelligentlyWithOpenRouter(userDescription, apiKey, modelId);
  }
  return generateIntelligentlyWithGemini(userDescription, apiKey, modelId);
}

async function generateWithGemini(
  userDescription: string,
  apiKey: string,
  modelId: string = 'gemini-2.0-flash-exp'
): Promise<AgentConfig> {
  const GEMINI_API_ENDPOINT = 
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

  const prompt = `You are an expert at creating Claude Code subagent configurations. Based on the user's description, generate a complete subagent configuration.

User's description: ${userDescription}

Generate the following in JSON format:
{
  "name": "suggested-agent-name",
  "description": "Clear description of when this subagent should be invoked (include 'proactively' or 'MUST BE USED' for automatic delegation)",
  "systemPrompt": "Detailed system prompt with specific instructions, best practices, and workflow steps",
  "tools": ["Read", "Write", "Bash"],
  "model": "sonnet"
}

Guidelines:
- Description should be action-oriented and specify when to use the agent
- System prompt should include:
  * Clear role definition
  * Step-by-step workflow ("When invoked: 1. ... 2. ...")
  * Best practices and guidelines
  * Expected output format
- Only include tools that are necessary for the agent's purpose
- Choose appropriate model based on task complexity (inherit, sonnet, opus, haiku)
- Make the agent focused on a single responsibility

Return ONLY the JSON object, no other text.`;

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  const data = await response.json();
  const generatedText = data.candidates[0].content.parts[0].text;
  
  // Extract JSON from markdown code blocks if present
  const jsonMatch = generatedText.match(/```json\n?([\s\S]*?)\n?```/) || 
                    generatedText.match(/```\n?([\s\S]*?)\n?```/);
  const jsonText = jsonMatch ? jsonMatch[1] : generatedText;
  
  const agentConfig = JSON.parse(jsonText);

  return {
    name: formatAgentName(agentConfig.name),
    description: agentConfig.description,
    systemPrompt: agentConfig.systemPrompt,
    tools: agentConfig.tools || [],
    model: agentConfig.model || 'inherit',
    inheritAllTools: !agentConfig.tools || agentConfig.tools.length === 0,
  };
}

export function downloadMarkdown(config: AgentConfig): void {
  const markdown = generateMarkdown(config);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.name}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

async function generateWithClaude(
  userDescription: string,
  apiKey: string,
  modelId: string = 'claude-3-5-sonnet-20241022'
): Promise<AgentConfig> {
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
  });

  const prompt = `You are an expert at creating Claude Code subagent configurations. Based on the user's description, generate a complete subagent configuration.

User's description: ${userDescription}

Generate the following in JSON format:
{
  "name": "suggested-agent-name",
  "description": "Clear description of when this subagent should be invoked (include 'proactively' or 'MUST BE USED' for automatic delegation)",
  "systemPrompt": "Detailed system prompt with specific instructions, best practices, and workflow steps",
  "tools": ["Read", "Write", "Bash"],
  "model": "sonnet"
}

Guidelines:
- Description should be action-oriented and specify when to use the agent
- System prompt should include:
  * Clear role definition
  * Step-by-step workflow ("When invoked: 1. ... 2. ...")
  * Best practices and guidelines
  * Expected output format
- Only include tools that are necessary for the agent's purpose
- Choose appropriate model based on task complexity (inherit, sonnet, opus, haiku)
- Make the agent focused on a single responsibility

Return ONLY the JSON object, no other text.`;

  let message;
  try {
    message = await anthropic.messages.create({
      model: modelId,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
  } catch (error: any) {
    // Parse Anthropic SDK errors
    if (error?.error) {
      throw error;
    }
    throw { error: { message: error.message || 'Unknown error' } };
  }

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
  
  // Extract JSON from markdown code blocks if present
  const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                    responseText.match(/```\n?([\s\S]*?)\n?```/);
  const jsonText = jsonMatch ? jsonMatch[1] : responseText;
  
  const agentConfig = JSON.parse(jsonText);

  return {
    name: formatAgentName(agentConfig.name),
    description: agentConfig.description,
    systemPrompt: agentConfig.systemPrompt,
    tools: agentConfig.tools || [],
    model: agentConfig.model || 'inherit',
    inheritAllTools: !agentConfig.tools || agentConfig.tools.length === 0,
  };
}

async function generateWithOpenRouter(
  userDescription: string,
  apiKey: string,
  modelId: string = 'anthropic/claude-3.5-sonnet'
): Promise<AgentConfig> {
  const prompt = `You are an expert at creating Claude Code subagent configurations. Based on the user's description, generate a complete subagent configuration.

User's description: ${userDescription}

Generate the following in JSON format:
{
  "name": "suggested-agent-name",
  "description": "Clear description of when this subagent should be invoked (include 'proactively' or 'MUST BE USED' for automatic delegation)",
  "systemPrompt": "Detailed system prompt with specific instructions, best practices, and workflow steps",
  "tools": ["Read", "Write", "Bash"],
  "model": "sonnet"
}

Guidelines:
- Description should be action-oriented and specify when to use the agent
- System prompt should include:
  * Clear role definition
  * Step-by-step workflow ("When invoked: 1. ... 2. ...")
  * Best practices and guidelines
  * Expected output format
- Only include tools that are necessary for the agent's purpose
- Choose appropriate model based on task complexity (inherit, sonnet, opus, haiku, qwen-coder)
- Make the agent focused on a single responsibility

Return ONLY the JSON object, no other text.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Subagent Studio',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  const data = await response.json();
  const responseText = data.choices[0]?.message?.content || '';
  
  // Extract JSON from markdown code blocks if present
  const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                    responseText.match(/```\n?([\s\S]*?)\n?```/);
  const jsonText = jsonMatch ? jsonMatch[1] : responseText;
  
  const agentConfig = JSON.parse(jsonText);

  return {
    name: formatAgentName(agentConfig.name),
    description: agentConfig.description,
    systemPrompt: agentConfig.systemPrompt,
    tools: agentConfig.tools || [],
    model: agentConfig.model || 'inherit',
    inheritAllTools: !agentConfig.tools || agentConfig.tools.length === 0,
  };
}
