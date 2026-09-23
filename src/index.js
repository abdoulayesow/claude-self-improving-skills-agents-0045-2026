import { Anthropic } from '@anthropic-ai/sdk';
import { Orchestrator } from './core/Orchestrator.js';
import { Agent } from './core/Agent.js';
import { Builder } from './agents/Builder.js';
import { Reviewer } from './agents/Reviewer.js';
import { FileReadSkill } from './skills/FileReadSkill.js';
import { FileWriteSkill } from './skills/FileWriteSkill.js';
import { ShellCommandSkill } from './skills/ShellCommandSkill.js';
import { TraceLoggerHook } from './hooks/TraceLoggerHook.js';
import { ReviewerHook } from './hooks/ReviewerHook.js';
import { MemoryManager } from './memory/MemoryManager.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Entry point for the Self-Improving Claude Framework.
 * Acts as the composition root — all dependencies are wired here.
 */
async function main() {
  console.log("Initializing Self-Improving Claude Framework...");

  // Shared dependencies
  const client = new Anthropic();
  const memoryManager = new MemoryManager();
  const orchestrator = new Orchestrator();

  // Load previous learnings to inject into agents' context
  const learnings = await memoryManager.loadLearnings();
  const learningsContext = learnings.length > 0 
    ? `\n\nCRITICAL RULES LEARNED FROM PAST MISTAKES:\n${learnings.map(l => `- ${l}`).join('\n')}` 
    : '';

  // 1. Register Agents (all share the same Anthropic client and learnings)
  const architect = new Agent(
    'Architect',
    `You are the Architect Agent. Your job is to decompose tasks into execution plans. Keep responses concise.${learningsContext}`,
    client
  );
  orchestrator.registerAgent(architect);

  const builder = new Builder(client, learningsContext);
  orchestrator.registerAgent(builder);

  const reviewer = new Reviewer(memoryManager, client);
  orchestrator.registerAgent(reviewer);

  // 2. Register Skills (Read, Write, Shell)
  orchestrator.registerSkill(new FileReadSkill());
  orchestrator.registerSkill(new FileWriteSkill());
  orchestrator.registerSkill(new ShellCommandSkill());
  
  // 3. Register Hooks (Trace logging and Reflection)
  orchestrator.registerHook('preTask', new TraceLoggerHook('preTask'));
  orchestrator.registerHook('postGeneration', new TraceLoggerHook('postGeneration'));
  orchestrator.registerHook('onFailure', new ReviewerHook(reviewer));

  // 4. Example task execution
  const demoPrompt = "Analyze our src/core directory and suggest improvements. Use read_file to inspect src/core/Agent.js.";
  console.log(`\nStarting Demo Task: "${demoPrompt}"`);
  
  if (process.env.ANTHROPIC_API_KEY) {
    await orchestrator.executeTask(demoPrompt);
  } else {
    console.warn("\n[Warning] ANTHROPIC_API_KEY not found in environment.");
    console.warn("Skipping actual API call. To run, set your API key in a .env file.");
  }
}

main().catch(console.error);
