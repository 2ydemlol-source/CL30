import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, Menu, Image as ImageIcon, Settings, Sun, Moon, Trash2, Bot, Users } from 'lucide-react';
import { initialContacts, initialMessages, currentUser, stickers, botCommands, commonCommands } from '../mockData';
import { saveContacts, getContacts, saveMessages, getMessages, saveTheme, getTheme, saveUser, getUser } from '../utils/localStorage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';

const ChatApp = () => {
  // Initialize state from localStorage or defaults
  const [contacts, setContacts] = useState(() => getContacts() || initialContacts);
  const [allMessages, setAllMessages] = useState(() => getMessages() || initialMessages);
  const [user, setUser] = useState(() => getUser() || currentUser);
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [chatMessages, setChatMessages] = useState(allMessages[contacts[0]?.id] || []);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGallery, setShowGallery] = useState(true);
  const [darkMode, setDarkMode] = useState(() => getTheme() === 'dark');
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    saveMessages(allMessages);
  }, [allMessages]);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveTheme(darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSelect = (contact) => {
    setSelectedChat(contact);
    setChatMessages(allMessages[contact.id] || []);
  };

  const updateMessagesForChat = (chatId, newMessages) => {
    const updatedMessages = { ...allMessages, [chatId]: newMessages };
    setAllMessages(updatedMessages);
    if (selectedChat.id === chatId) {
      setChatMessages(newMessages);
    }

    // Update contact's last message
    const updatedContacts = contacts.map(c => {
      if (c.id === chatId && newMessages.length > 0) {
        const lastMsg = newMessages[newMessages.length - 1];
        return {
          ...c,
          lastMessage: lastMsg.content.substring(0, 50),
          lastMessageTime: lastMsg.timestamp
        };
      }
      return c;
    });
    setContacts(updatedContacts);
  };

  const handleBotCommand = (command, chatId) => {
    const contact = contacts.find(c => c.id === chatId);
    if (!contact) return;

    const commandKey = command.split(' ')[0];
    let response = '';

    // Handle common commands
    if (commandKey === '/clear') {
      updateMessagesForChat(chatId, []);
      toast({ title: 'Chat Cleared', description: 'All messages have been removed' });
      return;
    }

    // Handle bot-specific commands
    if (contact.isBot && botCommands[chatId]) {
      const commands = botCommands[chatId];
      
      // Handle special commands with parameters
      if (commandKey === '/addusername' && chatId === 'help-bot') {
        const username = command.split(' ')[1];
        if (username) {
          const updatedUser = { ...user, usernames: [...user.usernames, username] };
          setUser(updatedUser);
          response = `Username "@${username}" added successfully! ✅`;
        } else {
          response = commands['/addusername'];
        }
      } else if (commandKey === '/addchat' && chatId === 'debug-bot') {
        const chatName = command.split(' ')[1];
        if (chatName) {
          if (contacts.length >= 18) {
            response = '❌ Maximum chat limit reached (10 custom chats)';
          } else {
            const newContact = {
              id: `custom-${Date.now()}`,
              name: chatName,
              usernames: [chatName.toLowerCase()],
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatName}`,
              status: 'offline',
              lastSeen: 'just now',
              unreadCount: 0,
              lastMessage: '',
              lastMessageTime: 'now',
              isBot: false
            };
            setContacts([...contacts, newContact]);
            response = `Chat "${chatName}" created successfully! ✅`;
          }
        } else {
          response = commands['/addchat'];
        }
      } else if (commandKey === '/dark' && chatId === 'debug-bot') {
        setDarkMode(!darkMode);
        response = `Theme switched to ${!darkMode ? 'dark' : 'light'} mode! ${!darkMode ? '🌙' : '☀️'}`;
      } else if (commandKey === '/tell' && chatId === 'debug-bot') {
        const parts = command.split(' ');
        const count = parseInt(parts[parts.length - 1]);
        const message = parts.slice(1, -1).join(' ');
        
        if (message && count >= 1 && count <= 5) {
          const currentMessages = allMessages[chatId] || [];
          const newMessages = [...currentMessages];
          
          for (let i = 0; i < count; i++) {
            newMessages.push({
              id: `msg-${Date.now()}-${i}`,
              senderId: user.id,
              content: message,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              type: 'text',
              status: 'sent'
            });
          }
          
          updateMessagesForChat(chatId, newMessages);
          return;
        } else {
          response = commands['/tell'];
        }
      } else {
        response = commands[commandKey] || `Unknown command. Type /commands to see available commands.`;
      }
    } else if (!contact.isBot) {
      response = '⚠️ Commands only work in bot chats!';
    }

    // Send bot response
    if (response) {
      setTimeout(() => {
        const currentMessages = allMessages[chatId] || [];
        const botResponse = {
          id: `msg-${Date.now()}-bot`,
          senderId: chatId,
          content: response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'delivered'
        };
        updateMessagesForChat(chatId, [...currentMessages, botResponse]);
      }, 500);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const currentMessages = allMessages[selectedChat.id] || [];
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        content: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sent'
      };
      
      const updatedMessages = [...currentMessages, newMessage];
      updateMessagesForChat(selectedChat.id, updatedMessages);

      // Check if message is a command
      if (messageInput.startsWith('/')) {
        handleBotCommand(messageInput, selectedChat.id);
      }

      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.usernames && contact.usernames.some(u => u.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleVideoCall = () => {
    toast({ title: 'Video Call', description: `Starting video call with ${selectedChat.name}` });
  };

  const handleVoiceCall = () => {
    toast({ title: 'Voice Call', description: `Starting voice call with ${selectedChat.name}` });
  };

  const clearChat = () => {
    updateMessagesForChat(selectedChat.id, []);
    toast({ title: 'Chat Cleared', description: 'All messages have been removed' });
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Left Sidebar - Contacts List */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xl font-bold">icq</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-800"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-zinc-900 border-zinc-800 focus:border-cyan-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleChatSelect(contact)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-zinc-800 ${
                  selectedChat.id === contact.id ? 'bg-zinc-800' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.status === 'online' && !contact.isChannel && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan-500 rounded-full border-2 border-zinc-950" />
                  )}
                  {contact.isBot && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-cyan-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {contact.isChannel && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-purple-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                      {contact.isBot && <Badge variant="secondary" className="text-xs">Bot</Badge>}
                    </div>
                    <span className="text-xs text-zinc-500">{contact.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400 truncate">
                      {contact.usernames && contact.usernames.length > 0 && (
                        <span className="text-cyan-500">@{contact.usernames[0]}</span>
                      )}
                      {contact.isChannel && (
                        <span className="text-purple-400">{contact.members?.toLocaleString()} subscribers</span>
                      )}
                      {!contact.isChannel && !contact.usernames?.length && contact.lastMessage}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-cyan-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-900">
        {/* Chat Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-zinc-800"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={selectedChat.avatar} />
              <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{selectedChat.name}</h2>
                {selectedChat.isBot && <Bot className="w-4 h-4 text-cyan-500" />}
                {selectedChat.isChannel && <Users className="w-4 h-4 text-purple-500" />}
              </div>
              <p className="text-xs text-zinc-400">
                {selectedChat.isChannel
                  ? `${selectedChat.members?.toLocaleString()} subscribers`
                  : selectedChat.isBot
                  ? 'Always online'
                  : selectedChat.status === 'online'
                  ? 'online'
                  : selectedChat.lastSeen}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800"
              onClick={handleVoiceCall}
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800"
              onClick={handleVideoCall}
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800"
              onClick={clearChat}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-zinc-800"
              onClick={() => setShowGallery(!showGallery)}
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md ${
                    message.senderId === user.id
                      ? 'bg-cyan-600 text-white rounded-l-2xl rounded-tr-2xl'
                      : 'bg-zinc-800 text-white rounded-r-2xl rounded-tl-2xl'
                  } px-4 py-2 shadow-lg`}
                >
                  {message.type === 'text' && (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
                  <Smile className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-zinc-900 border-zinc-800">
                <div className="grid grid-cols-6 gap-2">
                  {stickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      className="text-2xl p-2 hover:bg-zinc-800 rounded transition-colors"
                      onClick={() => {
                        setMessageInput(messageInput + sticker.emoji);
                      }}
                    >
                      {sticker.emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="hover:bg-zinc-800">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              placeholder="Type a message or /commands for help..."
              className="flex-1 bg-zinc-900 border-zinc-800 focus:border-cyan-500"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Profile & Info */}
      {showGallery && (
        <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-3">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
              {selectedChat.usernames && selectedChat.usernames.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {selectedChat.usernames.map((username, idx) => (
                    <span key={idx} className="text-sm text-cyan-400">@{username}</span>
                  ))}
                </div>
              )}
              {selectedChat.isBot && (
                <Badge className="mt-2 bg-cyan-600">Bot</Badge>
              )}
              {selectedChat.isChannel && (
                <p className="text-sm text-purple-400 mt-2">{selectedChat.members?.toLocaleString()} subscribers</p>
              )}
              {!selectedChat.isBot && !selectedChat.isChannel && (
                <p className="text-sm text-zinc-400 mt-1">
                  {selectedChat.status === 'online' ? 'Online' : `Last seen ${selectedChat.lastSeen}`}
                </p>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {selectedChat.isBot && (
                <div className="bg-zinc-900 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Bot Commands
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    Type /commands in chat to see all available commands for this bot.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs bg-zinc-800 p-2 rounded">
                      💬 Send commands to interact with the bot
                    </div>
                    {selectedChat.id === 'simpson-bot' && (
                      <div className="text-xs bg-zinc-800 p-2 rounded">
                        🍔 Try /burger, /gus, /sosiska
                      </div>
                    )}
                    {selectedChat.id === 'help-bot' && (
                      <div className="text-xs bg-zinc-800 p-2 rounded">
                        ℹ️ Try /project, /update, /addusername
                      </div>
                    )}
                    {selectedChat.id === 'debug-bot' && (
                      <div className="text-xs bg-zinc-800 p-2 rounded">
                        🛠️ Try /addchat, /dark, /tell
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedChat.isChannel && (
                <div className="bg-zinc-900 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Channel Info
                  </h4>
                  <p className="text-sm text-zinc-400">
                    This is a public channel for fun posts and updates. {selectedChat.members?.toLocaleString()} subscribers are enjoying the content!
                  </p>
                </div>
              )}

              <div className="bg-zinc-900 rounded-lg p-4">
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-zinc-400">
                  {selectedChat.isBot
                    ? `${selectedChat.name} is an automated bot that responds to commands.`
                    : selectedChat.isChannel
                    ? 'A channel for sharing fun content with the community.'
                    : `Chat with ${selectedChat.name}`}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-zinc-800"
                    onClick={clearChat}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat (/clear)
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
