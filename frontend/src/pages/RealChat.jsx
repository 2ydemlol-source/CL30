import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, LogOut, Users, MessageCircle, Circle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import { authApi, usersApi, messagesApi, ChatWebSocket } from '../services/api';

const RealChat = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ username: '', password: '', name: '' });
  const [authLoading, setAuthLoading] = useState(false);
  
  // Chat state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  
  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('cl_auth_token');
    if (token) {
      checkAuth();
    }
  }, []);
  
  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Load conversations when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      loadUsers();
      connectWebSocket();
    }
    return () => {
      wsRef.current?.disconnect();
    };
  }, [isAuthenticated]);
  
  // Load messages when user selected
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
    }
  }, [selectedUser]);
  
  // Search users
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const checkAuth = async () => {
    try {
      const user = await authApi.getMe();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('cl_auth_token');
    }
  };
  
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    
    try {
      let result;
      if (authMode === 'login') {
        result = await authApi.login(authForm.username, authForm.password);
      } else {
        result = await authApi.register(authForm.username, authForm.password, authForm.name);
      }
      
      localStorage.setItem('cl_auth_token', result.token);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      toast({ title: 'Успешно!', description: `Добро пожаловать, ${result.user.name}!` });
    } catch (error) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    localStorage.removeItem('cl_auth_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedUser(null);
    setMessages([]);
    wsRef.current?.disconnect();
  };
  
  const connectWebSocket = () => {
    const token = localStorage.getItem('cl_auth_token');
    if (!token) return;
    
    wsRef.current = new ChatWebSocket(token, handleWebSocketMessage);
    wsRef.current.connect();
  };
  
  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'new_message') {
      // Add message if from selected user
      if (data.message.senderId === selectedUser?.id) {
        setMessages(prev => [...prev, data.message]);
      }
      // Refresh conversations
      loadConversations();
      toast({ title: 'Новое сообщение', description: `${data.message.senderName}: ${data.message.text.slice(0, 50)}` });
    } else if (data.type === 'typing') {
      if (data.senderId === selectedUser?.id) {
        setTypingUser(data.senderId);
        setTimeout(() => setTypingUser(null), 3000);
      }
    }
  }, [selectedUser]);
  
  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };
  
  const loadConversations = async () => {
    try {
      const data = await messagesApi.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };
  
  const loadMessages = async (userId) => {
    try {
      const data = await messagesApi.getWithUser(userId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };
  
  const searchUsers = async (query) => {
    try {
      const data = await usersApi.search(query);
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };
  
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;
    
    const text = messageInput.trim();
    setMessageInput('');
    
    try {
      const message = await messagesApi.send(selectedUser.id, text);
      setMessages(prev => [...prev, message]);
      loadConversations();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отправить сообщение', variant: 'destructive' });
      setMessageInput(text);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const selectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#2fa34e] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">CL</span>
            </div>
            <h1 className="text-2xl font-bold text-white">CL Messenger</h1>
            <p className="text-zinc-400 mt-2">Реальный мультиплеер</p>
          </div>
          
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="flex mb-6">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  authMode === 'login'
                    ? 'text-[#2fa34e] border-b-2 border-[#2fa34e]'
                    : 'text-zinc-400 border-b border-zinc-700'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  authMode === 'register'
                    ? 'text-[#2fa34e] border-b-2 border-[#2fa34e]'
                    : 'text-zinc-400 border-b border-zinc-700'
                }`}
              >
                Регистрация
              </button>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Имя</label>
                  <Input
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Ваше имя"
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              )}
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Логин</label>
                <Input
                  value={authForm.username}
                  onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                  placeholder="username"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Пароль</label>
                <Input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••"
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#2fa34e] hover:bg-[#258a3c]"
                disabled={authLoading}
              >
                {authLoading ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Main Chat Screen
  return (
    <div className="h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUser?.avatar} />
                <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-white">{currentUser?.name}</h2>
                <p className="text-xs text-[#2fa34e]">@{currentUser?.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5 text-zinc-400" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск пользователей..."
              className="pl-10 bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="p-2 border-b border-zinc-800">
            <p className="text-xs text-zinc-500 px-2 mb-2">Найдены пользователи</p>
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => selectUser(user)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-zinc-800"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-[#2fa34e] text-[#2fa34e]" />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-zinc-400">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.length === 0 && users.length > 0 && !searchQuery && (
              <>
                <p className="text-xs text-zinc-500 px-2 mb-2">Все пользователи</p>
                {users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => selectUser(user)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-[#2fa34e] text-[#2fa34e]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.name}</p>
                      <p className="text-sm text-zinc-400">@{user.username}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {conversations.map((conv) => (
              <div
                key={conv.user.id}
                onClick={() => selectUser(conv.user)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUser?.id === conv.user.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.user.avatar} />
                    <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {conv.user.isOnline && (
                    <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-[#2fa34e] text-[#2fa34e]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium truncate">{conv.user.name}</p>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-[#2fa34e] text-white">{conv.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 truncate">{conv.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-white">{selectedUser.name}</h2>
                <p className="text-xs text-zinc-400">
                  {selectedUser.isOnline ? (
                    <span className="text-[#2fa34e]">онлайн</span>
                  ) : (
                    'был(а) недавно'
                  )}
                  {typingUser === selectedUser.id && (
                    <span className="text-[#2fa34e] ml-2">печатает...</span>
                  )}
                </p>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.senderId === currentUser?.id
                          ? 'bg-[#2fa34e] text-white'
                          : 'bg-zinc-800 text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === currentUser?.id ? 'text-green-200' : 'text-zinc-500'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="p-4 border-t border-zinc-800">
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишите сообщение..."
                  className="flex-1 bg-zinc-800 border-zinc-700"
                />
                <Button onClick={sendMessage} className="bg-[#2fa34e] hover:bg-[#258a3c]">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-zinc-400">Выберите чат</h2>
              <p className="text-zinc-500 mt-2">Или найдите пользователя в поиске</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealChat;
