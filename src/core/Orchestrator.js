/**
 * The Orchestrator manages the task lifecycle and the Generate -> Reflect -> Refine loop.
 */
export class Orchestrator {
  constructor() {
    this.hooks = {
      preTask: [],
      postGeneration: [],
      onFailure: []
    };
    this.skills = new Map();
    this.agents = new Map();
  }

  /**
   * Registers a hook for a specific lifecycle event.
   * @param {'preTask' | 'postGeneration' | 'onFailure'} event 
   * @param {import('./Hook.js').Hook} hook 
   */
  registerHook(event, hook) {
    if (!this.hooks[event]) {
      throw new Error(
        `Unknown hook event: "${event}". Valid events: ${Object.keys(this.hooks).join(', ')}`
      );
    }
    this.hooks[event].push(hook);
  }

  /**
   * Registers a skill in the framework.
   * @param {import('./Skill.js').Skill} skill 
   */
  registerSkill(skill) {
    this.skills.set(skill.name, skill);
  }

  /**
   * Registers an agent in the framework.
   * @param {Agent} agent 
   */
  registerAgent(agent) {
    this.agents.set(agent.role, agent);
  }

  /**
   * Executes a task using the self-improving loop.
   * @param {string} prompt - The user request.
   */
  async executeTask(prompt) {
    const context = {
      taskId: Date.now().toString(),
      originalPrompt: prompt,
      state: {},
      trace: []
    };

    console.log(`[Orchestrator] Starting task: ${context.taskId}`);

    try {
      // 1. Run Pre-Task Hooks (e.g., Load Memory/Learnings)
      await this.runHooks('preTask', context);

      // 2. Generation Phase (Architect -> Builder)
      // Placeholder: In a full flow, Architect plans, Builder executes.
      const architect = this.agents.get('Architect');
      if (!architect) throw new Error("Architect agent not registered.");

      console.log(`[Orchestrator] Executing Generate Phase (Architect)...`);
      const plan = await architect.process(prompt, context, Array.from(this.skills.values()));
      context.trace.push({ role: 'Architect', action: 'Plan', result: plan });

      // 2b. Build / Execution Phase (Builder agent, if registered)
      let buildResult = null;
      const builder = this.agents.get('Builder');
      if (builder) {
        console.log(`[Orchestrator] Executing Build Phase (Builder)...`);
        const builderPrompt = `Task Prompt:\n${prompt}\n\nArchitect's Plan:\n${plan}\n\nPlease implement and execute this plan using the available tools.`;
        buildResult = await builder.process(builderPrompt, context, Array.from(this.skills.values()));
        context.trace.push({ role: 'Builder', action: 'Execute', result: buildResult });
      }

      // 3. Post-Generation Hooks (e.g., Linting, Testing)
      await this.runHooks('postGeneration', context);

      console.log(`[Orchestrator] Task ${context.taskId} completed successfully.`);
      return { status: 'success', plan, buildResult, context };

    } catch (error) {
      console.error(`[Orchestrator] Task failed: ${error.message}`);
      
      // Save error in context state for the Reflection Phase
      context.state.lastError = error;

      // 4. Reflection Phase (Critic analyzes failure)
      // 5. Refinement Phase (Update Learnings/Skills)
      try {
        await this.runHooks('onFailure', context);
      } catch (reflectionError) {
        console.error(`[Orchestrator] Reflection also failed:`, reflectionError);
      }

      return { status: 'failed', error: error.message, context };
    }
  }

  /**
   * Runs all hooks for a specific event.
   * @param {string} event 
   * @param {import('./types.js').TaskContext} context 
   */
  async runHooks(event, context) {
    console.log(`[Orchestrator] Running ${event} hooks...`);
    for (const hook of this.hooks[event] || []) {
      const result = await hook.execute(context);
      if (!result.success) {
        throw new Error(`Hook ${hook.name} failed: ${result.message}`);
      }
    }
  }
}
