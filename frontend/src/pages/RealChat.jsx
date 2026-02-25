import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Search, LogOut, MessageCircle, Circle, Settings, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from '../hooks/use-toast';
import { authApi, usersApi, messagesApi, ChatWebSocket } from '../services/api';

const BRAND_ICON = 'https://cdn.worldvectorlogo.com/logos/telegram-1.svg';

const THEMES = {
  telegram: {
    app: 'bg-[#e8f1fa]',
    sidebar: 'bg-white border-[#d8e4f1]',
    panel: 'bg-[#f2f7fc] border-[#d8e4f1]',
    text: 'text-[#1f2f46]',
    secondary: 'text-[#6c7a91]',
    accent: 'bg-[#2aabee] hover:bg-[#1f96d8]',
    incoming: 'bg-white border border-[#d9e5f1] text-[#1f2f46]',
    outgoing: 'bg-[#dff5ff] border border-[#bee8fb] text-[#1f2f46]',
    online: 'text-[#31c765]'
  },
  midnight: {
    app: 'bg-[#0b1220]',
    sidebar: 'bg-[#101a2f] border-[#1f2b43]',
    panel: 'bg-[#111f36] border-[#1f2b43]',
    text: 'text-[#f1f5ff]',
    secondary: 'text-[#9aabc8]',
    accent: 'bg-[#2aabee] hover:bg-[#1f96d8]',
    incoming: 'bg-[#1a2740] border border-[#2b3f63] text-[#e7eefc]',
    outgoing: 'bg-[#143759] border border-[#25527e] text-[#e7eefc]',
    online: 'text-[#59d98e]'
  }
};

const RealChat = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', name: '' });
  const [authLoading, setAuthLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem('nethgram_theme') || 'telegram');
  const [showSettings, setShowSettings] = useState(false);

  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const themeStyles = THEMES[theme] || THEMES.telegram;

  const patchPresence = useCallback((userId, isOnline) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isOnline } : u)));
    setSearchResults((prev) => prev.map((u) => (u.id === userId ? { ...u, isOnline } : u)));
    setConversations((prev) => prev.map((c) => (c.user.id === userId ? { ...c, user: { ...c.user, isOnline } } : c)));
    setSelectedUser((prev) => (prev?.id === userId ? { ...prev, isOnline } : prev));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('cl_auth_token');
    if (token) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      loadUsers();
      connectWebSocket();
    }
    return () => wsRef.current?.disconnect();
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
    }
  }, [selectedUser]);

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
    } catch {
      localStorage.removeItem('cl_auth_token');
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const result = authMode === 'login'
        ? await authApi.login(authForm.username, authForm.password)
        : await authApi.register(authForm.username, authForm.password, authForm.name);

      localStorage.setItem('cl_auth_token', result.token);
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      toast({ title: 'Nethgram', description: `Добро пожаловать, ${result.user.name}!` });
    } catch (error) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    wsRef.current?.disconnect();
    localStorage.removeItem('cl_auth_token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedUser(null);
    setMessages([]);
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('cl_auth_token');
    if (!token) return;
    wsRef.current = new ChatWebSocket(token, handleWebSocketMessage);
    wsRef.current.connect();
  };

  const handleWebSocketMessage = useCallback((data) => {
    if (data.type === 'new_message' || data.type === 'message_sent') {
      const incoming = data.message;
      if (selectedUser && (incoming.senderId === selectedUser.id || incoming.receiverId === selectedUser.id)) {
        setMessages((prev) => [...prev, incoming]);
      }
      loadConversations();
      loadUsers();
    } else if (data.type === 'typing' && data.senderId === selectedUser?.id) {
      setTypingUser(data.senderId);
      setTimeout(() => setTypingUser(null), 2500);
    } else if (data.type === 'presence') {
      patchPresence(data.userId, data.isOnline);
    }
  }, [selectedUser, patchPresence]);

  const loadUsers = async () => {
    try {
      setUsers(await usersApi.getAll());
    } catch (error) {
      console.error(error);
    }
  };

  const loadConversations = async () => {
    try {
      setConversations(await messagesApi.getConversations());
    } catch (error) {
      console.error(error);
    }
  };

  const loadMessages = async (userId) => {
    try {
      setMessages(await messagesApi.getWithUser(userId));
      loadConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const searchUsers = async (query) => {
    try {
      setSearchResults(await usersApi.search(query));
    } catch (error) {
      console.error(error);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setSearchResults([]);
    setSearchQuery('');
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    const text = messageInput.trim();
    setMessageInput('');
    try {
      await messagesApi.send(selectedUser.id, text);
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось отправить сообщение', variant: 'destructive' });
    }
  };

  const handleTyping = (event) => {
    setMessageInput(event.target.value);
    if (selectedUser) {
      wsRef.current?.sendTyping(selectedUser.id);
    }
  };

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem('nethgram_theme', nextTheme);
  };

  if (!isAuthenticated) {
    return (
      <div className={`h-screen ${themeStyles.app} flex items-center justify-center px-4`}>
        <div className="w-full max-w-sm rounded-3xl p-8 bg-white shadow-2xl animate-[fadeIn_.35s_ease-out]">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#2aabee]/10 flex items-center justify-center mb-4 animate-[zoomIn_.35s_ease-out]">
              <img src={BRAND_ICON} alt="Nethgram" className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-[#1f2f46]">Nethgram</h1>
            <p className="text-sm text-[#6c7a91]">Войдите для общения в реальном времени</p>
          </div>

          <div className="flex mb-5 text-sm">
            <button onClick={() => setAuthMode('login')} className={`flex-1 pb-2 border-b-2 ${authMode === 'login' ? 'border-[#2aabee] text-[#2aabee]' : 'border-transparent text-[#6c7a91]'}`}>Вход</button>
            <button onClick={() => setAuthMode('register')} className={`flex-1 pb-2 border-b-2 ${authMode === 'register' ? 'border-[#2aabee] text-[#2aabee]' : 'border-transparent text-[#6c7a91]'}`}>Регистрация</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-3 animate-[slideUp_.3s_ease-out]">
            {authMode === 'register' && (
              <Input value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Имя" />
            )}
            <Input value={authForm.username} onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} placeholder="Username" required />
            <Input type="password" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="Пароль" required />
            <Button type="submit" className={`w-full ${themeStyles.accent}`} disabled={authLoading}>
              {authLoading ? 'Загрузка...' : authMode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${themeStyles.app} ${themeStyles.text}`}>
      <div className={`w-80 border-r ${themeStyles.sidebar} flex flex-col`}>
        <div className={`p-4 border-b ${themeStyles.sidebar}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={BRAND_ICON} alt="Nethgram" className="w-8 h-8" />
              <div>
                <p className="font-semibold">Nethgram</p>
                <p className={`text-xs ${themeStyles.secondary}`}>@{currentUser?.username}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setShowSettings((v) => !v)}><Settings className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          {showSettings && (
            <div className={`mb-3 rounded-2xl border p-3 ${themeStyles.panel}`}>
              <p className="text-sm font-medium mb-2">Настройки</p>
              <div className="flex gap-2 mb-2">
                <Button size="sm" variant={theme === 'telegram' ? 'default' : 'outline'} className={theme === 'telegram' ? themeStyles.accent : ''} onClick={() => handleThemeChange('telegram')}>Голубо-белая</Button>
                <Button size="sm" variant={theme === 'midnight' ? 'default' : 'outline'} className={theme === 'midnight' ? themeStyles.accent : ''} onClick={() => handleThemeChange('midnight')}>Темная</Button>
              </div>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/classic')}>
                <ArrowLeftRight className="w-4 h-4 mr-2" />Старый интерфейс
              </Button>
            </div>
          )}

          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${themeStyles.secondary}`} />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск" className="pl-10" />
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="px-2 pt-2">
            {searchResults.map((user) => (
              <button key={user.id} onClick={() => selectUser(user)} className={`w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-black/5`}>
                <Avatar className="w-10 h-10"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name?.[0]}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className={`truncate text-xs ${themeStyles.secondary}`}>@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-2">
            {(conversations.length ? conversations.map((conv) => conv.user) : users).map((user) => (
              <button key={user.id} onClick={() => selectUser(user)} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl ${selectedUser?.id === user.id ? 'bg-[#2aabee]/20' : 'hover:bg-black/5'}`}>
                <div className="relative">
                  <Avatar className="w-11 h-11"><AvatarImage src={user.avatar} /><AvatarFallback>{user.name?.[0]}</AvatarFallback></Avatar>
                  {user.isOnline && <Circle className={`absolute bottom-0 right-0 w-3 h-3 fill-current ${themeStyles.online}`} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className={`text-xs truncate ${themeStyles.secondary}`}>@{user.username}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className={`p-4 border-b ${themeStyles.sidebar} flex items-center gap-3`}>
              <Avatar className="w-10 h-10"><AvatarImage src={selectedUser.avatar} /><AvatarFallback>{selectedUser.name?.[0]}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold">{selectedUser.name}</p>
                <p className={`text-xs ${themeStyles.secondary}`}>
                  {typingUser === selectedUser.id ? 'печатает...' : selectedUser.isOnline ? 'онлайн' : 'не в сети'}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((msg) => {
                  const mine = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'} animate-[slideUp_.2s_ease-out]`}>
                      <div className={`max-w-[72%] rounded-2xl px-4 py-2 ${mine ? themeStyles.outgoing : themeStyles.incoming}`}>
                        <p className="text-sm break-words">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p className={`text-[11px] ${themeStyles.secondary}`}>
                            {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className={`p-4 border-t ${themeStyles.sidebar}`}>
              <div className="flex gap-2">
                <Input value={messageInput} onChange={handleTyping} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Сообщение" className="flex-1" />
                <Button onClick={sendMessage} className={themeStyles.accent}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className={`w-16 h-16 mx-auto mb-3 ${themeStyles.secondary}`} />
              <p className="text-lg font-medium">Выберите чат</p>
              <p className={`text-sm ${themeStyles.secondary}`}>Nethgram Online</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealChat;
