import { exec } from 'child_process';
import { promisify } from 'util';
import { Skill } from '../core/Skill.js';

const execAsync = promisify(exec);

/**
 * A skill that enables an agent to run terminal shell commands.
 */
export class ShellCommandSkill extends Skill {
  /**
   * @param {Object} [options]
   * @param {number} [options.timeout=30000] - Command timeout in milliseconds.
   * @param {number} [options.maxBuffer=1048576] - Max stdout/stderr buffer in bytes (default 1MB).
   */
  constructor(options = {}) {
    const timeout = options.timeout || 30000;
    const maxBuffer = options.maxBuffer || 1024 * 1024;

    super({
      name: 'run_shell_command',
      description: 'Executes a shell command on the host system and returns stdout and stderr.',
      execute: async (args, context) => {
        const { command, cwd } = args;
        if (!command) {
          throw new Error('command argument is required');
        }

        try {
          const { stdout, stderr } = await execAsync(command, {
            cwd: cwd || process.cwd(),
            timeout,
            maxBuffer
          });

          context.trace.push({
            action: 'skill_execution',
            skill: 'run_shell_command',
            command,
            cwd: cwd || process.cwd(),
            details: `Command succeeded: "${command}"`
          });

          return JSON.stringify({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            status: 'success'
          });
        } catch (error) {
          context.trace.push({
            action: 'skill_execution',
            skill: 'run_shell_command',
            command,
            error: error.message
          });

          throw new Error(`Command failed: "${command}". Error: ${error.message}\nStderr: ${error.stderr || ''}`);
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
          command: {
            type: 'string',
            description: 'The exact bash/shell command string to execute.'
          },
          cwd: {
            type: 'string',
            description: 'Optional working directory where the command should be run.'
          }
        },
        required: ['command']
      }
    };
  }
}
