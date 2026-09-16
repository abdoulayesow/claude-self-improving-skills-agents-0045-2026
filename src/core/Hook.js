/**
 * Base class for all Hooks. Hooks provide deterministic checks 
 * and behaviors during the lifecycle of a task.
 */
export class Hook {
  /**
   * @param {string} name - Name of the hook.
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Executes the hook logic. Must be implemented by subclasses.
   * @param {import('./types.js').TaskContext} context - The current task context.
   * @returns {Promise<import('./types.js').HookResult>}
   */
  async execute(context) {
    throw new Error(`Hook ${this.name} must implement the execute method.`);
  }
}
