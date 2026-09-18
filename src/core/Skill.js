/**
 * Base class for Skills. Skills are modular tools or instruction sets 
 * that Agents can load and utilize dynamically.
 */
export class Skill {
  /**
   * @param {import('./types.js').SkillDefinition} config - The skill definition.
   */
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this._executeFn = config.execute;
  }

  /**
   * Executes the skill.
   * @param {any} args - Arguments required by the skill.
   * @param {import('./types.js').TaskContext} context - The task context.
   * @returns {Promise<any>} The result of the skill execution.
   */
  async execute(args, context) {
    try {
      return await this._executeFn(args, context);
    } catch (error) {
      console.error(`[Skill: ${this.name}] Execution failed:`, error);
      throw error;
    }
  }

  /**
   * Returns the schema definition for LLM tool integration.
   * @returns {Object} Anthropic tool schema.
   */
  toToolSchema() {
    return {
      name: this.name,
      description: this.description,
      input_schema: { type: 'object', properties: {}, required: [] }
    };
  }
}
