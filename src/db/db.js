// src/db/db.js

import Dexie from 'dexie';

/**
 * Initialize and configure the Dexie database.
 */
export const db = new Dexie('typozio-journal');

// Define the database schema
db.version(1).stores({
  chapters: '++id, title, &date', // Auto-incremented ID, indexed fields
});

/**
 * Chapter Interface
 * @typedef {Object} Chapter
 * @property {number} id - Unique identifier for the chapter.
 * @property {string} title - Title of the chapter.
 * @property {string} date - Date associated with the chapter.
 * @property {string} content - Content of the chapter.
 */

/**
 * Create a new chapter in the database.
 * @param {Pick<Chapter, 'title' | 'date' | 'content'>} chapter - Chapter data to add.
 * @returns {Promise<number>} - The ID of the newly added chapter.
 */
export const addChapter = async (chapter) => {
  try {
    const id = await db.chapters.add(chapter);
    return id;
  } catch (error) {
    console.error('Error adding chapter:', error);
    throw error;
  }
};

/**
 * Retrieve all chapters from the database.
 * @returns {Promise<Chapter[]>} - An array of chapter objects.
 */
export const getAllChapters = async () => {
  try {
    const chapters = await db.chapters.reverse() 
    .sortBy('date');
    return chapters;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

/**
 * Retrieve a single chapter by its ID.
 * @param {number} id - The ID of the chapter to retrieve.
 * @returns {Promise<Chapter | undefined>} - The chapter object if found, else undefined.
 */
export const getChapterById = async (id) => {
  try {
    const chapter = await db.chapters.get(id);
    return chapter;
  } catch (error) {
    console.error(`Error fetching chapter with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update an existing chapter.
 * @param {number} id - The ID of the chapter to update.
 * @param {Partial<Pick<Chapter, 'title' | 'date' | 'content'>>} updatedData - The updated chapter data.
 * @returns {Promise<number>} - The number of records modified (0 or 1).
 */
export const updateChapter = async (id, updatedData) => {
  try {
    const count = await db.chapters.update(id, updatedData);
    if (count === 0) {
      throw new Error(`Chapter with ID ${id} not found.`);
    }
    return count;
  } catch (error) {
    console.error(`Error updating chapter with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a chapter from the database.
 * @param {number} id - The ID of the chapter to delete.
 * @returns {Promise<void>}
 */
export const deleteChapter = async (id) => {
  try {
    await db.chapters.delete(id);
  } catch (error) {
    console.error(`Error deleting chapter with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Search chapters by title.
 * @param {string} query - The search query string.
 * @returns {Promise<Chapter[]>} - An array of chapters that match the search query.
 */
export const searchChaptersByTitle = async (query) => {
  try {
    const chapters = await db.chapters
      .where('title')
      .startsWithIgnoreCase(query)
      .toArray();
    return chapters;
  } catch (error) {
    console.error(`Error searching chapters with query "${query}":`, error);
    throw error;
  }
};

/**
 * Search chapters by date.
 * @param {string} query - The search query string.
 * @returns {Promise<Chapter[]>} - An array of chapters that match the search query.
 */
export const getChapterByDate = async (query) => {
  try {
    const chapters = await db.chapters.get({ date: query });
    return chapters;
  } catch (error) {
    console.error(`Error searching chapters with query "${query}":`, error);
    throw error;
  }
};  