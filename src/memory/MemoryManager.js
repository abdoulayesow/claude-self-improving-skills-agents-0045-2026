import fs from 'fs/promises';
import path from 'path';

/**
 * Manages reading and writing to the persistent learnings file.
 */
export class MemoryManager {
  /**
   * @param {string} storagePath - Path to the persistent storage file (e.g., learnings.json)
   */
  constructor(storagePath = './learnings.json') {
    this.storagePath = path.resolve(storagePath);
  }

  /**
   * Loads all learned rules from the memory file.
   * @returns {Promise<Array<string>>}
   */
  async loadLearnings() {
    try {
      const data = await fs.readFile(this.storagePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, return empty learnings
        return [];
      }
      console.error(`[MemoryManager] Error reading learnings: ${error.message}`);
      return [];
    }
  }

  /**
   * Appends a new learning to the persistent storage.
   * @param {string} newLearning 
   * @returns {Promise<void>}
   */
  async addLearning(newLearning) {
    const learnings = await this.loadLearnings();
    learnings.push(newLearning);
    
    await fs.writeFile(this.storagePath, JSON.stringify(learnings, null, 2), 'utf-8');
    console.log(`[MemoryManager] Successfully saved new learning.`);
  }
}
