import { Anthropic } from '@anthropic-ai/sdk';

/**
 * Base Agent class that wraps the Anthropic SDK.
 */
export class Agent {
  /**
   * @param {string} role - The role of the agent (e.g., 'Architect', 'Builder').
   * @param {string} systemPrompt - The core instructions for the agent.
   */
  constructor(role, systemPrompt) {
    this.role = role;
    this.systemPrompt = systemPrompt;
    
    // Initialize Anthropic client. Expects ANTHROPIC_API_KEY in environment.
    this.client = new Anthropic(); 
  }

  /**
   * Processes a prompt with the provided context and available skills.
   * @param {string} prompt - The prompt to process.
   * @param {import('./types.js').TaskContext} context - The current task context.
   * @param {Array<import('./Skill.js').Skill>} availableSkills - Skills the agent can use.
   * @returns {Promise<string>} The agent's response.
   */
  async process(prompt, context, availableSkills = []) {
    console.log(`[Agent: ${this.role}] Processing prompt...`);
    
    const tools = availableSkills.map(skill => skill.toToolSchema());
    
    // Map for quick skill lookup
    const skillsMap = new Map();
    for (const skill of availableSkills) {
      skillsMap.set(skill.name, skill);
    }
    
    let messages = [{ role: 'user', content: prompt }];
    
    while (true) {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: this.systemPrompt,
        tools: tools.length > 0 ? tools : undefined,
        messages: messages
      });

      // Append assistant's response to conversation history
      messages.push({ role: 'assistant', content: response.content });

      // Find all tool uses requested by the model
      const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');
      
      // If no tools were called, the agent is done reasoning
      if (toolUseBlocks.length === 0) {
        const textBlock = response.content.find(block => block.type === 'text');
        return textBlock ? textBlock.text : "No text response generated.";
      }

      console.log(`[Agent: ${this.role}] Executing ${toolUseBlocks.length} tool call(s)...`);
      
      // Prepare results array for the next message
      const toolResults = [];
      
      for (const block of toolUseBlocks) {
        const skill = skillsMap.get(block.name);
        
        if (!skill) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: `Error: Tool ${block.name} not found.`,
            is_error: true
          });
          continue;
        }

        try {
          const result = await skill.execute(block.input, context);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: typeof result === 'string' ? result : JSON.stringify(result)
          });
        } catch (error) {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: `Error executing tool: ${error.message}`,
            is_error: true
          });
        }
      }

      // Feed the tool results back to the model as the next user message
      messages.push({ role: 'user', content: toolResults });
    }
  }
}
