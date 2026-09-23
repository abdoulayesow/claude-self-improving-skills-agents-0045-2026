import { Agent } from '../core/Agent.js';

/**
 * The Builder Agent takes the plan produced by the Architect Agent
 * and executes it by invoking skills (file operations, shell commands, etc.).
 */
export class Builder extends Agent {
  /**
   * @param {import('@anthropic-ai/sdk').Anthropic} [client] - Optional shared Anthropic client.
   * @param {string} [learningsContext=''] - Learnings injected from persistent memory.
   */
  constructor(client = null, learningsContext = '') {
    const systemPrompt = `You are the Builder Agent in an autonomous self-improving framework.
Your role is to execute architectural plans with high precision.
When given an Architect's plan and task instructions:
1. Inspect the requirements and any existing files using the available tools.
2. Implement code, edit files, or execute commands cleanly and incrementally.
3. Verify your work (e.g. running syntax checks or tests when appropriate).
4. Provide a clear, concise summary of what was implemented.${learningsContext}`;

    super('Builder', systemPrompt, client);
  }
}
