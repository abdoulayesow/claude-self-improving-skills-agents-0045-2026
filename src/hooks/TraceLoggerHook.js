import { Hook } from '../core/Hook.js';

/**
 * A hook that logs the current state of the execution trace.
 * Useful for debugging or providing context to the Reviewer Agent.
 */
export class TraceLoggerHook extends Hook {
  constructor(phase) {
    super(`TraceLogger_${phase}`);
    this.phase = phase;
  }

  /**
   * Executes the trace logger.
   * @param {import('../core/types.js').TaskContext} context 
   * @returns {Promise<import('../core/types.js').HookResult>}
   */
  async execute(context) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      phase: this.phase,
      message: `Trace checkpoint reached during ${this.phase}`
    };
    
    context.trace.push(logEntry);
    
    console.log(`[TraceLoggerHook] Task ${context.taskId} - ${this.phase} phase executed.`);
    
    return { success: true };
  }
}
