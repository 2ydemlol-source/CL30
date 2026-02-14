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

export const saveCustomGifts = (gifts) => saveToLocalStorage('icq_custom_gifts', gifts);
export const getCustomGifts = () => getFromLocalStorage('icq_custom_gifts', []);

export const saveAppSettings = (settings) => saveToLocalStorage('icq_app_settings', settings);
export const getAppSettings = () => getFromLocalStorage('icq_app_settings', {
  showSubscriberEdit: true,
  showCreateContact: true,
  useConfigSystem: true,
  designTheme: 'icq' // 'icq' or 'telegram'
});

export const saveBotConfigs = (configs) => saveToLocalStorage('icq_bot_configs', configs);
export const getBotConfigs = () => getFromLocalStorage('icq_bot_configs', {});

// Admin system
export const saveAdminStatus = (isAdmin) => saveToLocalStorage('cl_admin_status', isAdmin);
export const getAdminStatus = () => getFromLocalStorage('cl_admin_status', false);

// Registration logs
export const saveRegistrationLogs = (logs) => saveToLocalStorage('cl_registration_logs', logs);
export const getRegistrationLogs = () => getFromLocalStorage('cl_registration_logs', []);
export const addRegistrationLog = (log) => {
  const logs = getRegistrationLogs();
  logs.push(log);
  saveRegistrationLogs(logs);
  return logs;
};

// Online users tracking
export const saveOnlineUsers = (users) => saveToLocalStorage('cl_online_users', users);
export const getOnlineUsers = () => getFromLocalStorage('cl_online_users', []);

// Registered users for search
export const saveRegisteredUsers = (users) => saveToLocalStorage('cl_registered_users', users);
export const getRegisteredUsers = () => getFromLocalStorage('cl_registered_users', []);
export const addRegisteredUser = (user) => {
  const users = getRegisteredUsers();
  // Avoid duplicates
  if (!users.find(u => u.username === user.username)) {
    users.push(user);
    saveRegisteredUsers(users);
  }
  return users;
};