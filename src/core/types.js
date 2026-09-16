/**
 * @typedef {Object} TaskContext
 * @property {string} taskId - Unique identifier for the task.
 * @property {string} originalPrompt - The user's original request.
 * @property {Record<string, any>} state - Shared state across the execution loop.
 * @property {Array<any>} trace - History of actions, LLM calls, and results.
 */

/**
 * @typedef {Object} SkillDefinition
 * @property {string} name - The name of the skill.
 * @property {string} description - What the skill does and when to use it.
 * @property {Function} execute - The function to run when the skill is invoked.
 */

/**
 * @typedef {Object} HookResult
 * @property {boolean} success - Whether the hook passed.
 * @property {string} [message] - Optional message or reason for failure.
 * @property {any} [data] - Optional modified data to pass down the chain.
 */

export {};
