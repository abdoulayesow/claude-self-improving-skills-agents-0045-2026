import { Agent } from '../core/Agent.js';
import { MemoryManager } from '../memory/MemoryManager.js';

/**
 * The Reviewer Agent analyzes failed execution traces and generates 
 * permanent rules (learnings) to prevent future occurrences.
 */
export class Reviewer extends Agent {
  /**
   * @param {import('../memory/MemoryManager.js').MemoryManager} [memoryManager] - Injected memory manager.
   * @param {import('@anthropic-ai/sdk').Anthropic} [client] - Optional shared Anthropic client.
   */
  constructor(memoryManager = null, client = null) {
    const systemPrompt = `You are the Reviewer Agent in a self-improving framework.
Your task is to analyze failed execution traces. Identify the root cause of the failure and output a SINGLE, clear, actionable rule that the Architect or Builder agents should follow in the future to prevent this mistake.
Your output must be JUST the rule, no explanations, no markdown formatting.`;

    super('Reviewer', systemPrompt, client);
    this.memoryManager = memoryManager || new MemoryManager();
  }

  /**
   * Reviews a failed task and updates memory.
   * @param {Error} error - The error that caused the failure.
   * @param {import('../core/types.js').TaskContext} context - The task context containing the trace.
   */
  async reviewAndLearn(error, context) {
    console.log(`[Reviewer] Analyzing failure for task ${context.taskId}...`);
    
    const reflectionPrompt = `
Task Prompt: ${context.originalPrompt}
Error Message: ${error.message}

Execution Trace:
${JSON.stringify(context.trace, null, 2)}

Analyze the trace and the error. What rule should we add to our system to prevent this in the future?`;

    try {
      // Process the prompt with the LLM to get the new rule
      const newRule = await this.process(reflectionPrompt, context, []);
      
      console.log(`[Reviewer] Generated new rule: "${newRule}"`);
      
      // Save the new rule to persistent memory
      await this.memoryManager.addLearning(newRule);
      
    } catch (llmError) {
      console.error(`[Reviewer] Failed to generate learning:`, llmError);
    }
  }
}
