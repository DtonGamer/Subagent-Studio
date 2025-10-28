import Anthropic from '@anthropic-ai/sdk';
import { AgentConfig } from './types';
import { formatAgentName } from './utils';

// Intelligent batch generation with Gemini - AI decides if one or multiple agents needed
export async function generateIntelligentlyWithGemini(
  userDescription: string,
  apiKey: string,
  modelId: string = 'gemini-2.0-flash-exp'
): Promise<AgentConfig[]> {
  const GEMINI_API_ENDPOINT = 
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

  const prompt = `You are an expert at creating Claude Code subagent configurations. Analyze the user's description and determine if it requires ONE agent or MULTIPLE specialized agents working together.

User's description: ${userDescription}

If the task is simple and focused, create ONE agent.
If the task is complex or involves multiple distinct responsibilities, create MULTIPLE specialized agents (2-4 agents max).

Generate your response in JSON format as an array of agent configurations:
[
  {
    "name": "suggested-agent-name",
    "description": "Clear description of when this subagent should be invoked (include 'proactively' or 'MUST BE USED' for automatic delegation)",
    "systemPrompt": "Detailed system prompt with specific instructions, best practices, and workflow steps",
    "tools": ["Read", "Write", "Bash"],
    "model": "sonnet"
  }
]

Guidelines for EACH agent:
- Description should be action-oriented and specify when to use the agent
- System prompt should include:
  * Clear role definition
  * Step-by-step workflow ("When invoked: 1. ... 2. ...")
  * Best practices and guidelines
  * Expected output format
- Only include tools that are necessary for the agent's purpose
- Choose appropriate model based on task complexity (inherit, sonnet, opus, haiku)
- Make each agent focused on a single responsibility
- If creating multiple agents, ensure they complement each other without overlap

Return ONLY the JSON array, no other text.`;

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
  
  const agentConfigs = JSON.parse(jsonText);

  // Ensure we have an array
  const configsArray = Array.isArray(agentConfigs) ? agentConfigs : [agentConfigs];

  return configsArray.map((config: any) => ({
    name: formatAgentName(config.name),
    description: config.description,
    systemPrompt: config.systemPrompt,
    tools: config.tools || [],
    model: config.model || 'inherit',
    inheritAllTools: !config.tools || config.tools.length === 0,
  }));
}

// Intelligent batch generation with Claude - AI decides if one or multiple agents needed
export async function generateIntelligentlyWithClaude(
  userDescription: string,
  apiKey: string,
  modelId: string = 'claude-3-5-sonnet-20241022'
): Promise<AgentConfig[]> {
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
  });

  const prompt = `You are an expert at creating Claude Code subagent configurations. Analyze the user's description and determine if it requires ONE agent or MULTIPLE specialized agents working together.

User's description: ${userDescription}

If the task is simple and focused, create ONE agent.
If the task is complex or involves multiple distinct responsibilities, create MULTIPLE specialized agents (2-4 agents max).

Generate your response in JSON format as an array of agent configurations:
[
  {
    "name": "suggested-agent-name",
    "description": "Clear description of when this subagent should be invoked (include 'proactively' or 'MUST BE USED' for automatic delegation)",
    "systemPrompt": "Detailed system prompt with specific instructions, best practices, and workflow steps",
    "tools": ["Read", "Write", "Bash"],
    "model": "sonnet"
  }
]

Guidelines for EACH agent:
- Description should be action-oriented and specify when to use the agent
- System prompt should include:
  * Clear role definition
  * Step-by-step workflow ("When invoked: 1. ... 2. ...")
  * Best practices and guidelines
  * Expected output format
- Only include tools that are necessary for the agent's purpose
- Choose appropriate model based on task complexity (inherit, sonnet, opus, haiku)
- Make each agent focused on a single responsibility
- If creating multiple agents, ensure they complement each other without overlap

Return ONLY the JSON array, no other text.`;

  let message;
  try {
    message = await anthropic.messages.create({
      model: modelId,
      max_tokens: 4000,
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
  
  const agentConfigs = JSON.parse(jsonText);

  // Ensure we have an array
  const configsArray = Array.isArray(agentConfigs) ? agentConfigs : [agentConfigs];

  return configsArray.map((config: any) => ({
    name: formatAgentName(config.name),
    description: config.description,
    systemPrompt: config.systemPrompt,
    tools: config.tools || [],
    model: config.model || 'inherit',
    inheritAllTools: !config.tools || config.tools.length === 0,
  }));
}

// Intelligent batch generation with OpenRouter - AI decides if one or multiple agents needed
export async function generateIntelligentlyWithOpenRouter(
  userDescription: string,
  apiKey: string,
  modelId: string = 'anthropic/claude-3.5-sonnet'
): Promise<AgentConfig[]> {
  const prompt = `You are an expert at creating Claude Code subagent configurations. Analyze the user's description and determine if it requires ONE agent or MULTIPLE specialized agents working together.

User's description: ${userDescription}

If the task is simple and focused, create ONE agent.
If the task is complex or involves multiple distinct responsibilities, create MULTIPLE specialized agents (2-4 agents max).

Generate your response in JSON format as an array of agent configurations:
[
  {
    "name": "suggested-agent-name",
    "description": "Clear description of when this subagent should be invoked (include 'proactively' or 'MUST BE USED' for automatic delegation)",
    "systemPrompt": "Detailed system prompt with specific instructions, best practices, and workflow steps",
    "tools": ["Read", "Write", "Bash"],
    "model": "sonnet"
  }
]

Guidelines for EACH agent:
- Description should be action-oriented and specify when to use the agent
- System prompt should include:
  * Clear role definition
  * Step-by-step workflow ("When invoked: 1. ... 2. ...")
  * Best practices and guidelines
  * Expected output format
- Only include tools that are necessary for the agent's purpose
- Choose appropriate model based on task complexity (inherit, sonnet, opus, haiku, qwen-coder)
- Make each agent focused on a single responsibility
- If creating multiple agents, ensure they complement each other without overlap

Return ONLY the JSON array, no other text.`;

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
  
  const agentConfigs = JSON.parse(jsonText);

  // Ensure we have an array
  const configsArray = Array.isArray(agentConfigs) ? agentConfigs : [agentConfigs];

  return configsArray.map((config: any) => ({
    name: formatAgentName(config.name),
    description: config.description,
    systemPrompt: config.systemPrompt,
    tools: config.tools || [],
    model: config.model || 'inherit',
    inheritAllTools: !config.tools || config.tools.length === 0,
  }));
}
