import fs from 'fs/promises';
import path from 'path';
import { Skill } from '../core/Skill.js';

/**
 * A skill that enables an agent to write or update files on the local filesystem.
 */
export class FileWriteSkill extends Skill {
  constructor() {
    super({
      name: 'write_file',
      description: 'Creates or overwrites a file on the local filesystem with specified content.',
      execute: async (args, context) => {
        const { filePath, content } = args;
        if (!filePath) {
          throw new Error('filePath argument is required');
        }
        if (content === undefined || content === null) {
          throw new Error('content argument is required');
        }

        try {
          const resolvedPath = path.resolve(filePath);
          const dir = path.dirname(resolvedPath);
          await fs.mkdir(dir, { recursive: true });
          await fs.writeFile(resolvedPath, content, 'utf-8');

          context.trace.push({
            action: 'skill_execution',
            skill: 'write_file',
            details: `Wrote file: ${filePath} (${Buffer.byteLength(content, 'utf-8')} bytes)`
          });

          return `File successfully written to ${filePath}`;
        } catch (error) {
          throw new Error(`Failed to write file at ${filePath}: ${error.message}`);
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
            description: 'The path where the file will be created or overwritten.'
          },
          content: {
            type: 'string',
            description: 'The full text content to write to the file.'
          }
        },
        required: ['filePath', 'content']
      }
    };
  }
}
