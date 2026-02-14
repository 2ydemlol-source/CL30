// API Service for CL Messenger

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Get token from localStorage
const getToken = () => localStorage.getItem('cl_auth_token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_URL}/api${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(error.detail || 'Request failed');
  }
  
  return response.json();
};

// Auth API
export const authApi = {
  register: (username, password, name) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, name }),
    }),
  
  login: (username, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),
  
  getMe: () =>
    apiRequest('/auth/me'),
};

// Users API
export const usersApi = {
  getAll: () => apiRequest('/users'),
  
  getOnline: () => apiRequest('/users/online'),
  
  search: (query) => apiRequest(`/users/search/${encodeURIComponent(query)}`),
  
  getById: (userId) => apiRequest(`/users/${userId}`),
};

// Messages API
export const messagesApi = {
  send: (receiverId, text) =>
    apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, text }),
    }),
  
  getWithUser: (userId) => apiRequest(`/messages/${userId}`),
  
  getConversations: () => apiRequest('/conversations'),
};

// WebSocket connection
export class ChatWebSocket {
  constructor(token, onMessage) {
    this.token = token;
    this.onMessage = onMessage;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect() {
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    this.ws = new WebSocket(`${wsUrl}/ws/${this.token}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      // Start ping interval
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 30000);
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'pong') {
        this.onMessage(data);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      clearInterval(this.pingInterval);
      
      // Auto reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), 3000);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  sendTyping(receiverId) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'typing', receiverId }));
    }
  }
  
  disconnect() {
    clearInterval(this.pingInterval);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default { authApi, usersApi, messagesApi, ChatWebSocket };
