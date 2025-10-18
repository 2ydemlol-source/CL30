import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, ArrowLeft, Menu, Image as ImageIcon, File, Link as LinkIcon, Mic, Users, Settings, Sun, Moon } from 'lucide-react';
import { contacts, messages, currentUser, mediaGallery, stickers } from '../mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from '../hooks/use-toast';

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [chatMessages, setChatMessages] = useState(messages[contacts[0].id] || []);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGallery, setShowGallery] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
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
    setChatMessages(messages[contact.id] || []);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        content: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sent'
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput('');
      toast({ title: 'Message sent', description: 'Your message has been delivered' });
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
    (contact.username && contact.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleVideoCall = () => {
    toast({ title: 'Video Call', description: 'Starting video call with ' + selectedChat.name });
  };

  const handleVoiceCall = () => {
    toast({ title: 'Voice Call', description: 'Starting voice call with ' + selectedChat.name });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Left Sidebar - Contacts List */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z" />
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
              className="pl-10 bg-zinc-900 border-zinc-800 focus:border-emerald-500"
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
                  {contact.status === 'online' && !contact.isGroup && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950" />
                  )}
                  {contact.isGroup && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-zinc-700 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Users className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">{contact.name}</h3>
                    <span className="text-xs text-zinc-500">{contact.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400 truncate">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
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
              <h2 className="font-semibold">{selectedChat.name}</h2>
              <p className="text-xs text-zinc-400">
                {selectedChat.isGroup
                  ? `${selectedChat.members} members`
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
                className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md ${
                    message.senderId === currentUser.id
                      ? 'bg-emerald-600 text-white rounded-l-2xl rounded-tr-2xl'
                      : 'bg-zinc-800 text-white rounded-r-2xl rounded-tl-2xl'
                  } px-4 py-2 shadow-lg`}
                >
                  {message.type === 'text' && <p className="text-sm">{message.content}</p>}
                  {message.type === 'image' && (
                    <div>
                      <img
                        src={message.content}
                        alt="Shared"
                        className="rounded-lg max-w-xs cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openImageModal(message.content)}
                      />
                      {message.caption && <p className="text-sm mt-2">{message.caption}</p>}
                    </div>
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
                <div className="grid grid-cols-5 gap-2">
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
              placeholder="Type a message..."
              className="flex-1 bg-zinc-900 border-zinc-800 focus:border-emerald-500"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Gallery & Profile */}
      {showGallery && (
        <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-3">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
              {selectedChat.username && (
                <p className="text-sm text-zinc-400">@{selectedChat.username}</p>
              )}
              {selectedChat.isGroup && (
                <p className="text-sm text-zinc-400 mt-1">{selectedChat.members} members</p>
              )}
            </div>
          </div>

          <Tabs defaultValue="media" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 bg-zinc-900 rounded-none">
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="media" className="p-4 mt-0">
                <div className="grid grid-cols-3 gap-2">
                  {mediaGallery[selectedChat.id]?.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Media ${index + 1}`}
                      className="aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openImageModal(photo)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="files" className="p-4 mt-0">
                <div className="space-y-2">
                  {mediaGallery[selectedChat.id]?.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <File className="w-8 h-8 text-emerald-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-zinc-400">{file.size} • {file.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="links" className="p-4 mt-0">
                <div className="space-y-2">
                  {mediaGallery[selectedChat.id]?.links.map((link, index) => (
                    <div
                      key={index}
                      className="p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <LinkIcon className="w-5 h-5 text-emerald-500 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{link.title}</p>
                          <p className="text-xs text-zinc-400 truncate">{link.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="voice" className="p-4 mt-0">
                <div className="space-y-2">
                  {mediaGallery[selectedChat.id]?.voice.map((voice, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <Mic className="w-6 h-6 text-emerald-500" />
                      <div className="flex-1">
                        <div className="h-8 bg-zinc-800 rounded-full flex items-center px-3">
                          <div className="h-1 flex-1 bg-zinc-700 rounded-full">
                            <div className="h-1 w-1/3 bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {voice.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      )}

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <img src={selectedImage} alt="Preview" className="w-full rounded-lg" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatApp;