// Local storage utilities for ICQ New

const STORAGE_KEYS = {
  CONTACTS: 'icq_contacts',
  MESSAGES: 'icq_messages',
  USER: 'icq_user',
  THEME: 'icq_theme',
  SETTINGS: 'icq_settings'
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

export const clearAllLocalStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Specific storage functions
export const saveContacts = (contacts) => saveToLocalStorage(STORAGE_KEYS.CONTACTS, contacts);
export const getContacts = () => getFromLocalStorage(STORAGE_KEYS.CONTACTS);

export const saveMessages = (messages) => saveToLocalStorage(STORAGE_KEYS.MESSAGES, messages);
export const getMessages = () => getFromLocalStorage(STORAGE_KEYS.MESSAGES);

export const saveUser = (user) => saveToLocalStorage(STORAGE_KEYS.USER, user);
export const getUser = () => getFromLocalStorage(STORAGE_KEYS.USER);

export const saveTheme = (theme) => saveToLocalStorage(STORAGE_KEYS.THEME, theme);
export const getTheme = () => getFromLocalStorage(STORAGE_KEYS.THEME, 'dark');

export const saveSettings = (settings) => saveToLocalStorage(STORAGE_KEYS.SETTINGS, settings);
export const getSettings = () => getFromLocalStorage(STORAGE_KEYS.SETTINGS, {});

export const saveCustomCommands = (commands) => saveToLocalStorage('icq_custom_commands', commands);
export const getCustomCommands = () => getFromLocalStorage('icq_custom_commands', {});