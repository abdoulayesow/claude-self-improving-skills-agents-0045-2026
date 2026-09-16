import fs from 'fs/promises';
import { Skill } from '../core/Skill.js';

/**
 * A skill that enables an agent to read the contents of a local file.
 */
export class FileReadSkill extends Skill {
  constructor() {
    super({
      name: 'read_file',
      description: 'Reads the content of a file from the local filesystem.',
      execute: async (args, context) => {
        const { filePath } = args;
        if (!filePath) {
          throw new Error('filePath argument is required');
        }
        
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Log to trace
          context.trace.push({
            action: 'skill_execution',
            skill: 'read_file',
            details: `Read file: ${filePath}`
          });
          
          return content;
        } catch (error) {
          throw new Error(`Failed to read file at ${filePath}: ${error.message}`);
        }
      }
    });
  }

  /**
   * Defines the Anthropic tool schema for this skill.
   * @returns {Object}
   */
  toToolSchema() {
    return {
      name: this.name,
      description: this.description,
      input_schema: {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'The absolute or relative path to the file to read.'
          }
        },
        required: ['filePath']
      }
    };
  }
}
