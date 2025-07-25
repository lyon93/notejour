import Predictionary from 'predictionary';

const predictionary = Predictionary.instance();

const DICT_EN = 'english';
const options = {
    maxPredictions: 1,
    dictionaryKey: DICT_EN
};

/**
 * Parses the words from the text and adds them to the dictionary.
 * @param {string} string - The raw text from words_en.txt.
 * @param {string} dictionaryKey - The key for the dictionary (e.g., 'english').
 */
const parseWords = (string, dictionaryKey) => {
    predictionary.parseWords(string, {
        elementSeparator: '\n',
        rankSeparator: ' ',
        wordPosition: 2,
        rankPosition: 0,
        addToDictionary: dictionaryKey
    });
};

/**
 * Initializes the Predictionary by loading the dictionary file.
 * Must be called before using other methods.
 */

let dictionaryInitialized = false;
export const init = async () => {
    // Only load once
    if (dictionaryInitialized) {
        console.warn('Dictionary already loaded, skipping initialization');
        return true;
    }
    try {
        const response = await fetch(`/dictionary/words_en.txt`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        parseWords(text, DICT_EN);
        console.log('words_en.txt loaded successfully.');
        dictionaryInitialized = true;
        return true;
    } catch (error) {
        console.error('Error loading words_en.txt:', error);
        throw error;
    }
};

/**
 * Learns from the user input to refine predictions.
 * @param {string} input - The input text to learn from.
 * @param {string} [dictionaryKey] - Optional dictionary key to add learned words.
 * @returns {boolean} - Indicates if learning was successful.
 */
export const learnFromInput = (input, dictionaryKey) => {
    predictionary.learnFromInput(input, { addToDictionary: dictionaryKey });
    return true; // Assuming learnFromInput is synchronous and always successful
};

/**
 * Predicts words based on the input.
 * @param {string} word - The word to predict.
 * @returns {string} - The predicted word.
 */
export const predict = (word) => {
    return predictionary.predict(word, options)[0] || '';
};


