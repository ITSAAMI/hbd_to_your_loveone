import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Configure localforage
localforage.config({
  name: 'BirthdaySurpriseDB',
  storeName: 'surprises'
});

export const StorageService = {
  /**
   * Save a new surprise configuration.
   * @param {Object} data 
   * @returns {Promise<string>} The unique ID generated for this surprise.
   */
  async saveSurprise(data) {
    const id = uuidv4();
    const payload = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    
    await localforage.setItem(id, payload);
    return id;
  },

  /**
   * Load a surprise by ID.
   * @param {string} id 
   * @returns {Promise<Object|null>} The surprise data or null if not found.
   */
  async loadSurprise(id) {
    try {
      const data = await localforage.getItem(id);
      return data;
    } catch (err) {
      console.error("Error loading surprise:", err);
      return null;
    }
  }
};
