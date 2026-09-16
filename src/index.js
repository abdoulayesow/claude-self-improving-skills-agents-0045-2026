import { Orchestrator } from './core/Orchestrator.js';
import { Agent } from './core/Agent.js';
import { FileReadSkill } from './skills/FileReadSkill.js';
import { TraceLoggerHook } from './hooks/TraceLoggerHook.js';
import { Reviewer } from './agents/Reviewer.js';
import { MemoryManager } from './memory/MemoryManager.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Entry point for the Self-Improving Claude Framework
 */
async function main() {
  console.log("Initializing Self-Improving Claude Framework...");

  const orchestrator = new Orchestrator();
  const memoryManager = new MemoryManager();

  // Load previous learnings to inject into the Architect's context
  const learnings = await memoryManager.loadLearnings();
  const learningsContext = learnings.length > 0 
    ? `\n\nCRITICAL RULES LEARNED FROM PAST MISTAKES:\n${learnings.map(l => `- ${l}`).join('\n')}` 
    : '';

  // 1. Register the Agents
  const architect = new Agent(
    'Architect',
    `You are the Architect Agent. Your job is to decompose tasks into execution plans. Keep responses concise.${learningsContext}`
  );
  orchestrator.registerAgent(architect);

  const reviewer = new Reviewer();
  orchestrator.registerAgent(reviewer);

  // 2. Register Skills
  const fileReadSkill = new FileReadSkill();
  orchestrator.registerSkill(fileReadSkill);
  
  // 3. Register Hooks
  const preTaskTrace = new TraceLoggerHook('preTask');
  const postGenTrace = new TraceLoggerHook('postGeneration');
  orchestrator.registerHook('preTask', preTaskTrace);
  orchestrator.registerHook('postGeneration', postGenTrace);

  // We add a custom hook to handle failure and trigger the Reviewer
  orchestrator.registerHook('onFailure', {
    name: 'TriggerReviewer',
    execute: async (context) => {
      // Extract the error from state (we will modify Orchestrator to pass it)
      const error = context.state.lastError || new Error("Unknown failure");
      await reviewer.reviewAndLearn(error, context);
      return { success: true };
    }
  });

  // 4. Example task execution
  const demoPrompt = "Analyze our src/core directory and suggest improvements. Use the read_file skill to read src/core/Agent.js.";
  console.log(`\nStarting Demo Task: "${demoPrompt}"`);
  
  if (process.env.ANTHROPIC_API_KEY) {
    // We intentionally force an error in the Orchestrator for demo purposes 
    // to see the Reviewer in action if the plan doesn't meet some criteria,
    // but for now, we just let it run.
    await orchestrator.executeTask(demoPrompt);
  } else {
    console.warn("\n[Warning] ANTHROPIC_API_KEY not found in environment.");
    console.warn("Skipping actual API call. To run, set your API key in a .env file.");
  }
}

main().catch(console.error);
