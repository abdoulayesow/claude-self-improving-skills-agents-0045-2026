import { Hook } from '../core/Hook.js';

/**
 * A hook that triggers the Reviewer Agent when a task fails,
 * allowing it to analyze the trace and generate a new learning.
 */
export class ReviewerHook extends Hook {
  /**
   * @param {import('../agents/Reviewer.js').Reviewer} reviewer - The Reviewer agent instance.
   */
  constructor(reviewer) {
    super('TriggerReviewer');
    this.reviewer = reviewer;
  }

  /**
   * Executes the reviewer hook.
   * @param {import('../core/types.js').TaskContext} context
   * @returns {Promise<import('../core/types.js').HookResult>}
   */
  async execute(context) {
    const error = context.state.lastError || new Error('Unknown failure');
    await this.reviewer.reviewAndLearn(error, context);
    return { success: true };
  }
}
