import React, { useState, useEffect, useRef } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Smile, Menu, Image as ImageIcon, Settings, Sun, Moon, Trash2, Bot, Users, Edit2, Save, X, Plus, Gift } from 'lucide-react';
import { initialContacts, initialMessages, currentUser, stickers, botCommands, commonCommands, availableGifts, botConfigs } from '../mockData';
import { saveContacts, getContacts, saveMessages, getMessages, saveTheme, getTheme, saveUser, getUser, saveCustomCommands, getCustomCommands, saveCustomGifts, getCustomGifts, saveAppSettings, getAppSettings, saveBotConfigs, getBotConfigs, saveAdminStatus, getAdminStatus, saveRegistrationLogs, getRegistrationLogs, addRegistrationLog } from '../utils/localStorage';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';
import GiftShop from '../components/GiftShop';
import GiftMessage from '../components/GiftMessage';
import MyProfileModal from '../components/MyProfileModal';
import SettingsModal from '../components/SettingsModal';
import RegistrationModal from '../components/RegistrationModal';

const ChatApp = () => {
  // Initialize state from localStorage or defaults
  const [contacts, setContacts] = useState(() => {
    const savedContacts = getContacts();
    if (savedContacts) {
      // Ensure all contacts have receivedGifts array
      return savedContacts.map(c => ({
        ...c,
        receivedGifts: c.receivedGifts || []
      }));
    }
    // Initialize with receivedGifts for new contacts
    return initialContacts.map(c => ({
      ...c,
      receivedGifts: []
    }));
  });
  const [allMessages, setAllMessages] = useState(() => getMessages() || initialMessages);
  const [user, setUser] = useState(() => getUser() || currentUser);
  const [customCommands, setCustomCommands] = useState(() => getCustomCommands() || {});
  const [selectedChat, setSelectedChat] = useState(contacts[0]);
  const [chatMessages, setChatMessages] = useState(allMessages[contacts[0]?.id] || []);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGallery, setShowGallery] = useState(true);
  const [darkMode, setDarkMode] = useState(() => getTheme() === 'dark');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [showCreateContact, setShowCreateContact] = useState(false);
  const [newContactForm, setNewContactForm] = useState({
    name: '',
    username: '',
    avatar: '',
    type: 'contact' // contact, bot, or channel
  });
  const [editingSubscribers, setEditingSubscribers] = useState(false);
  const [tempSubscriberCount, setTempSubscriberCount] = useState('');
  const [showStarsSettings, setShowStarsSettings] = useState(false);
  const [showGiftShop, setShowGiftShop] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRegistration, setShowRegistration] = useState(() => {
    return !localStorage.getItem('cl_user_registered');
  });
  const [customGifts, setCustomGifts] = useState(() => getCustomGifts() || []);
  const [appSettings, setAppSettings] = useState(() => getAppSettings());
  const [savedBotConfigs, setSavedBotConfigs] = useState(() => getBotConfigs());
  const [customBackground, setCustomBackground] = useState(() => localStorage.getItem('icq_background') || 'https://abrakadabra.fun/uploads/posts/2022-03/1646124201_2-abrakadabra-fun-p-temnii-fon-dlya-telegramm-4.jpg');
  const [editingContact, setEditingContact] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', avatar: '', about: '', phone: '' });
  const [isAdmin, setIsAdmin] = useState(() => getAdminStatus());
  const [registrationLogs, setRegistrationLogs] = useState(() => getRegistrationLogs());
  const messagesEndRef = useRef(null);

  // Admin functions
  const handleAdminLogin = () => {
    setIsAdmin(true);
    saveAdminStatus(true);
    toast({ title: '🔓 Режим администратора', description: 'Все функции разблокированы!' });
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    saveAdminStatus(false);
    toast({ title: '🔒 Выход из админ-режима', description: 'Административные функции отключены' });
  };

  // Limits for regular users
  const MAX_USER_CHANNELS = 5;
  const MAX_USER_BOTS = 5;

  // Count user-created bots and channels
  const userCreatedBots = contacts.filter(c => c.isBot && c.id.startsWith('user-')).length;
  const userCreatedChannels = contacts.filter(c => c.isChannel && c.id.startsWith('user-')).length;

  // Helper function to validate image URL
  const isValidImageUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];
      const pathname = urlObj.pathname.toLowerCase();
      return validExtensions.some(ext => pathname.endsWith(ext)) || 
             pathname.includes('/images/') || 
             pathname.includes('image') ||
             url.includes('cdn') ||
             url.includes('dicebear') ||
             url.includes('flaticon');
    } catch {
      return false;
    }
  };

  // Background options
  const backgroundOptions = [
    { id: 1, url: 'https://abrakadabra.fun/uploads/posts/2022-03/1646124201_2-abrakadabra-fun-p-temnii-fon-dlya-telegramm-4.jpg', name: 'Тёмный узор' },
    { id: 2, url: 'https://phonoteka.org/uploads/posts/2022-02/1645162587_54-phonoteka-org-p-temnii-fon-dlya-telegram-57.jpg', name: 'Абстракция' },
    { id: 3, url: 'https://i.pinimg.com/originals/00/1d/55/001d5504e393f1f6eb37e062551cf0e2.jpg', name: 'Космос' },
    { id: 4, url: 'https://w.forfun.com/fetch/6d/6d3a3e3c4d5f4f5a6e3c8c0f7f5f5f5f.jpeg', name: 'Геометрия' },
    { id: 5, url: 'none', name: 'Без фона' }
  ];

  // Preset avatar options
  const presetAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Bot1',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Bot2',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Bot3',
    'https://pngimg.com/d/simpsons_PNG15.png',
    'https://www.pngfind.com/pngs/m/145-1458913_emojis-burger-png-download-hamburger-emoji-apple-transparent.png',
    'https://symbl-cdn.com/i/webp/21/dfe0b9e30973b15cdf3d4142961fc0.webp',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbkhBwErXuC5PkJ9XkKEB3l2GOHRhOa_GgiMNpcWT5V_QJc3sC4CYnApFeBspJsleVTIg&usqp=CAU',
    'https://api.dicebear.com/7.x/identicon/svg?seed=Channel1',
    'https://api.dicebear.com/7.x/identicon/svg?seed=Channel2',
    'https://api.dicebear.com/7.x/shapes/svg?seed=Shape1',
    'https://api.dicebear.com/7.x/shapes/svg?seed=Shape2',
    'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel1'
  ];

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
    saveCustomCommands(customCommands);
  }, [customCommands]);

  useEffect(() => {
    saveCustomGifts(customGifts);
  }, [customGifts]);

  useEffect(() => {
    saveAppSettings(appSettings);
  }, [appSettings]);

  useEffect(() => {
    saveBotConfigs(savedBotConfigs);
  }, [savedBotConfigs]);

  useEffect(() => {
    localStorage.setItem('icq_background', customBackground);
  }, [customBackground]);

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
        let lastMessageText = '';
        
        if (lastMsg.type === 'gift') {
          lastMessageText = `🎁 ${lastMsg.gift.nameRu}`;
        } else if (lastMsg.content) {
          lastMessageText = lastMsg.content.substring(0, 50);
        }
        
        return {
          ...c,
          lastMessage: lastMessageText,
          lastMessageTime: lastMsg.timestamp
        };
      }
      return c;
    });
    setContacts(updatedContacts);
  };

  const handleBotCommand = (command, chatId, messagesWithCommand) => {
    const contact = contacts.find(c => c.id === chatId);
    if (!contact) return;

    const commandKey = command.split(' ')[0];
    let response = '';

    // Handle common commands
    if (commandKey === '/clear') {
      updateMessagesForChat(chatId, []);
      toast({ title: 'Чат очищен', description: 'Все сообщения удалены' });
      return;
    }

    // Handle /sub command for Fun Channel
    if (commandKey === '/sub' && chatId === 'fun-channel') {
      const subscriberCount = parseInt(command.split(' ')[1]);
      if (!isNaN(subscriberCount) && subscriberCount >= 0) {
        const updatedContacts = contacts.map(c => {
          if (c.id === 'fun-channel') {
            return { ...c, members: subscriberCount };
          }
          return c;
        });
        setContacts(updatedContacts);
        if (selectedChat.id === 'fun-channel') {
          setSelectedChat({ ...selectedChat, members: subscriberCount });
        }
        response = `✅ Количество подписчиков изменено на ${subscriberCount.toLocaleString()}!`;
      } else {
        response = 'Использование: /sub [число]\nПример: /sub 8000000';
      }
    }
    // Handle /addcommand - works in all chats except Fun Channel
    else if (commandKey === '/addcommand' && !contact.isChannel) {
      const parts = command.split(' ');
      if (parts.length >= 3) {
        const newCommand = parts[1];
        const commandResponse = parts.slice(2).join(' ');
        
        if (newCommand.startsWith('/')) {
          // Add to custom commands for this chat
          const updatedCommands = {
            ...customCommands,
            [chatId]: {
              ...(customCommands[chatId] || {}),
              [newCommand]: commandResponse
            }
          };
          setCustomCommands(updatedCommands);
          response = `✅ Команда ${newCommand} успешно добавлена!`;
        } else {
          response = '❌ Команда должна начинаться с символа /';
        }
      } else {
        response = 'Использование: /addcommand /команда ответ\nПример: /addcommand /wow WOW';
      }
    }
    // Check for custom commands for this chat (except Fun Channel)
    else if (!contact.isChannel && customCommands[chatId] && customCommands[chatId][commandKey]) {
      response = customCommands[chatId][commandKey];
    }
    // Handle bot-specific commands
    else if (contact.isBot && botCommands[chatId]) {
      const commands = botCommands[chatId];
      
      // Handle special commands with parameters
      if (commandKey === '/addusername' && chatId === 'help-bot') {
        const username = command.split(' ')[1];
        if (username) {
          const updatedUser = { ...user, usernames: [...user.usernames, username] };
          setUser(updatedUser);
          response = `Имя пользователя "@${username}" успешно добавлено! ✅`;
        } else {
          response = commands['/addusername'];
        }
      } else if (commandKey === '/addchat' && chatId === 'debug-bot') {
        const chatName = command.split(' ')[1];
        if (chatName) {
          if (contacts.length >= 18) {
            response = '❌ Достигнут максимальный лимит чатов (10 пользовательских чатов)';
          } else {
            const newContact = {
              id: `custom-${Date.now()}`,
              name: chatName,
              usernames: [chatName.toLowerCase()],
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chatName}`,
              status: 'offline',
              lastSeen: 'только что',
              unreadCount: 0,
              lastMessage: '',
              lastMessageTime: 'сейчас',
              isBot: false
            };
            setContacts([...contacts, newContact]);
            response = `Чат "${chatName}" успешно создан! ✅`;
          }
        } else {
          response = commands['/addchat'];
        }
      } else if (commandKey === '/dark' && chatId === 'debug-bot') {
        setDarkMode(!darkMode);
        response = `Тема переключена на ${!darkMode ? 'тёмную' : 'светлую'}! ${!darkMode ? '🌙' : '☀️'}`;
      } else if (chatId === 'stars-bot') {
        if (commandKey === '/balance') {
          response = `⭐ Ваш текущий баланс: ${user.stars || 0} звёзд\n\nИспользуйте звёзды для получения бонусов и специальных функций!`;
        } else if (commandKey === '/daily') {
          const now = Date.now();
          const lastReward = user.lastDailyReward || 0;
          const timeDiff = now - lastReward;
          const hoursLeft = 24 - Math.floor(timeDiff / (1000 * 60 * 60));
          
          if (timeDiff >= 24 * 60 * 60 * 1000) {
            const updatedUser = {
              ...user,
              stars: (user.stars || 0) + 500,
              lastDailyReward: now
            };
            setUser(updatedUser);
            response = `🎉 Ежедневная награда получена!\n+500 ⭐\n\nТекущий баланс: ${updatedUser.stars} звёзд\n\nВозвращайтесь через 24 часа за новой наградой!`;
          } else {
            response = `⏰ Ежедневная награда уже получена!\n\nСледующая награда через: ${hoursLeft} ч.\n\nТекущий баланс: ${user.stars || 0} звёзд`;
          }
        } else if (commandKey === '/unlimited') {
          const amount = parseInt(command.split(' ')[1]);
          if (!isNaN(amount) && amount > 0) {
            const updatedUser = {
              ...user,
              stars: (user.stars || 0) + amount
            };
            setUser(updatedUser);
            response = `✨ Добавлено ${amount} звёзд!\n\nТекущий баланс: ${updatedUser.stars} звёзд`;
          } else {
            response = 'Использование: /unlimited [число]\nПример: /unlimited 1000';
          }
        } else {
          response = commands[commandKey] || `Неизвестная команда. Напиши /commands чтобы увидеть доступные команды.`;
        }
      } else if (commandKey === '/tell' && chatId === 'debug-bot') {
        const parts = command.split(' ');
        const count = parseInt(parts[parts.length - 1]);
        const message = parts.slice(1, -1).join(' ');
        
        if (message && count >= 1 && count <= 5) {
          // Use messagesWithCommand to preserve the command message
          const newMessages = [...messagesWithCommand];
          
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
      } else if (commandKey === '/unlim' && chatId === 'debug-bot') {
        const amount = parseInt(command.split(' ')[1]);
        if (!isNaN(amount) && amount > 0) {
          const updatedUser = {
            ...user,
            stars: (user.stars || 0) + amount
          };
          setUser(updatedUser);
          response = `✅ Получено ${amount} звёзд! Новый баланс: ${updatedUser.stars}★`;
        } else {
          response = commands['/unlim'];
        }
      } else if (commandKey === '/create' && (chatId === 'gift-bot' || chatId === 'debug-bot')) {
        const parts = command.split(' ');
        if (parts.length >= 4) {
          const giftName = parts[1];
          const giftPrice = parseInt(parts[2]);
          const giftImage = parts.slice(3).join(' ');
          
          // Validation
          if (giftName.length < 2 || giftName.length > 50) {
            response = '❌ Название должно быть от 2 до 50 символов!';
          } else if (!isValidImageUrl(giftImage)) {
            response = '❌ Неверная ссылка на изображение!\n\nИспользуйте валидный URL изображения (PNG, JPG, WebP, GIF, SVG)';
          } else if (!isNaN(giftPrice) && giftPrice >= 10 && giftPrice <= 5000) {
            const newGift = {
              id: `custom-gift-${Date.now()}`,
              name: giftName,
              nameRu: giftName,
              price: giftPrice,
              image: giftImage,
              createdBy: user.name,
              createdAt: new Date().toISOString(),
              isCustom: true
            };
            
            setCustomGifts([...customGifts, newGift]);
            response = `✅ Подарок "${giftName}" создан!\n\n💰 Цена: ${giftPrice}★\n👤 Создатель: ${user.name}\n📅 Дата: ${new Date().toLocaleDateString('ru-RU')}\n\nТеперь этот подарок доступен для дарения всем пользователям!`;
          } else {
            response = '❌ Цена должна быть от 10 до 5000 звёзд!';
          }
        } else {
          response = commands['/create'];
        }
      } else if (commandKey === '/config') {
        // Система конфигов - работает для всех ботов и контактов
        const parts = command.split(' ');
        const action = parts[1];
        const param = parts.slice(2).join(' ');

        if (action === 'save' && param) {
          // Сохранение текущего конфига
          const currentConfig = {
            name: param,
            botId: chatId,
            botName: contact.name,
            commands: customCommands[chatId] || {},
            keywords: user.keywords?.[chatId] || {},
            createdAt: new Date().toISOString()
          };
          
          const updatedConfigs = {
            ...savedBotConfigs,
            [param]: currentConfig
          };
          setSavedBotConfigs(updatedConfigs);
          
          const commandCount = Object.keys(currentConfig.commands).length;
          const keywordCount = Object.keys(currentConfig.keywords).length;
          response = `✅ Конфиг "${param}" сохранен!\n\nСохранено:\n• ${commandCount} команд\n• ${keywordCount} ключевых слов\n\nДата создания: ${new Date().toLocaleDateString('ru-RU')}`;
          
        } else if (action === 'load' && param) {
          // Загрузка конфига
          let configToLoad = null;
          
          // Проверяем предустановленные конфиги
          if (botConfigs[param]) {
            configToLoad = botConfigs[param];
            
            // Применяем команды к текущему боту
            const updatedCustomCommands = {
              ...customCommands,
              [chatId]: {
                ...(customCommands[chatId] || {}),
                ...configToLoad.commands
              }
            };
            setCustomCommands(updatedCustomCommands);
            
            const commandList = Object.keys(configToLoad.commands)
              .slice(0, 5)
              .map(cmd => `• ${cmd}`)
              .join('\n');
            
            const moreCommands = Object.keys(configToLoad.commands).length - 5;
            response = `✅ Конфиг "${param}" загружен!\n\nТеперь я умею:\n${commandList}${moreCommands > 0 ? `\n... и еще ${moreCommands} команд` : ''}\n\n📝 ${configToLoad.description}`;
            
          } else if (savedBotConfigs[param]) {
            // Загружаем пользовательский конфиг
            configToLoad = savedBotConfigs[param];
            
            const updatedCustomCommands = {
              ...customCommands,
              [chatId]: {
                ...(customCommands[chatId] || {}),
                ...configToLoad.commands
              }
            };
            setCustomCommands(updatedCustomCommands);
            
            response = `✅ Конфиг "${param}" загружен!\n\nКоманд загружено: ${Object.keys(configToLoad.commands).length}\nКлючевых слов: ${Object.keys(configToLoad.keywords || {}).length}`;
          } else {
            response = `❌ Конфиг "${param}" не найден!\n\nДоступные предустановленные:\n${Object.keys(botConfigs).join(', ')}\n\nВаши конфиги: ${Object.keys(savedBotConfigs).length > 0 ? Object.keys(savedBotConfigs).join(', ') : 'нет'}`;
          }
          
        } else if (action === 'list') {
          // Список конфигов
          const presetList = Object.keys(botConfigs).map(name => `📦 ${name}`).join('\n');
          const userList = Object.keys(savedBotConfigs).length > 0
            ? Object.keys(savedBotConfigs).map(name => `💾 ${name}`).join('\n')
            : 'Нет сохраненных конфигов';
          
          response = `📋 Доступные конфиги:\n\n🔧 Предустановленные:\n${presetList}\n\n👤 Ваши конфиги:\n${userList}\n\nИспользуйте: /config load [название]`;
          
        } else if (action === 'delete' && param) {
          // Удаление конфига
          if (savedBotConfigs[param]) {
            const updatedConfigs = { ...savedBotConfigs };
            delete updatedConfigs[param];
            setSavedBotConfigs(updatedConfigs);
            response = `✅ Конфиг "${param}" удален!`;
          } else {
            response = `❌ Конфиг "${param}" не найден!`;
          }
          
        } else if (action === 'info' && param) {
          // Информация о конфиге
          let configInfo = null;
          
          if (botConfigs[param]) {
            configInfo = botConfigs[param];
            const commandList = Object.keys(configInfo.commands).map(cmd => `• ${cmd}`).join('\n');
            response = `ℹ️ Информация о конфиге "${param}"\n\n📝 ${configInfo.description}\n\n📋 Команды:\n${commandList}\n\n🏷️ Тип: Предустановленный`;
          } else if (savedBotConfigs[param]) {
            configInfo = savedBotConfigs[param];
            response = `ℹ️ Информация о конфиге "${param}"\n\n🤖 Бот: ${configInfo.botName}\n📋 Команд: ${Object.keys(configInfo.commands).length}\n🔑 Ключевых слов: ${Object.keys(configInfo.keywords || {}).length}\n📅 Создан: ${new Date(configInfo.createdAt).toLocaleDateString('ru-RU')}\n\n🏷️ Тип: Пользовательский`;
          } else {
            response = `❌ Конфиг "${param}" не найден!`;
          }
          
        } else {
          response = `🔧 Система конфигов\n\nИспользование:\n/config save [название] - сохранить текущий конфиг\n/config load [название] - загрузить конфиг\n/config list - показать все конфиги\n/config delete [название] - удалить конфиг\n/config info [название] - информация о конфиге\n\nПример:\n/config load SimpsonBotConfig`;
        }
      } else {
        response = commands[commandKey] || `Неизвестная команда. Напиши /commands чтобы увидеть доступные команды.`;
      }
    } else if (contact.isChannel && commandKey !== '/sub') {
      response = '⚠️ В каналах доступна только команда /sub для изменения числа подписчиков!';
    } else if (!contact.isBot && commandKey !== '/addcommand') {
      response = '⚠️ Команды работают только в чатах с ботами или используйте /addcommand для создания пользовательских команд!';
    }

    // Send bot response
    if (response) {
      setTimeout(() => {
        // Use messagesWithCommand to include the user's command message
        const botResponse = {
          id: `msg-${Date.now()}-bot`,
          senderId: chatId,
          content: response,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'delivered'
        };
        updateMessagesForChat(chatId, [...messagesWithCommand, botResponse]);
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
        // Pass the updated messages so bot response includes the user's command message
        handleBotCommand(messageInput, selectedChat.id, updatedMessages);
      }

      setMessageInput('');
    }
  };

  const handleSendGift = (gift) => {
    // Deduct stars from user
    const giftData = {
      id: `gift-${Date.now()}`,
      gift: gift,
      from: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      },
      timestamp: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    let updatedUser = {
      ...user,
      stars: (user.stars || 0) - gift.price
    };

    // If gifting to self, update user's receivedGifts
    if (selectedChat.id === user.id) {
      const receivedGifts = user.receivedGifts || [];
      updatedUser = {
        ...updatedUser,
        receivedGifts: [...receivedGifts, giftData]
      };
    }
    
    setUser(updatedUser);

    // Add gift to recipient's received gifts (for contacts)
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedChat.id) {
        const receivedGifts = c.receivedGifts || [];
        return {
          ...c,
          receivedGifts: [...receivedGifts, giftData]
        };
      }
      return c;
    });
    setContacts(updatedContacts);

    // Add gift message to chat
    const currentMessages = allMessages[selectedChat.id] || [];
    const giftMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      type: 'gift',
      gift: gift,
      recipient: {
        id: selectedChat.id,
        name: selectedChat.name,
        avatar: selectedChat.avatar
      },
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    updateMessagesForChat(selectedChat.id, [...currentMessages, giftMessage]);
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
    toast({ title: 'Видеозвонок', description: `Начинаем видеозвонок с ${selectedChat.name}` });
  };

  const handleVoiceCall = () => {
    toast({ title: 'Голосовой звонок', description: `Начинаем голосовой звонок с ${selectedChat.name}` });
  };

  const clearChat = () => {
    updateMessagesForChat(selectedChat.id, []);
    toast({ title: 'Чат очищен', description: 'Все сообщения удалены' });
  };

  const openEditProfile = () => {
    setEditForm({
      name: user.name,
      avatar: user.avatar,
      about: user.about || '',
      phone: user.phone || ''
    });
    setShowEditProfileModal(true);
  };

  const handlePhoneVerification = () => {
    if (tempPhone && tempPhone.length >= 10) {
      setShowPhoneVerification(true);
    } else {
      toast({ 
        title: 'Ошибка', 
        description: 'Введите корректный номер телефона',
        variant: 'destructive'
      });
    }
  };

  const verifyPhone = () => {
    if (verificationCode === '1111') {
      setEditForm({ ...editForm, phone: tempPhone });
      setShowPhoneVerification(false);
      setVerificationCode('');
      setTempPhone('');
      toast({ 
        title: 'Успешно', 
        description: 'Номер телефона подтверждён!' 
      });
    } else {
      toast({ 
        title: 'Ошибка', 
        description: 'Неверный код. Введите 1111',
        variant: 'destructive'
      });
    }
  };

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      name: editForm.name,
      avatar: editForm.avatar,
      about: editForm.about,
      phone: editForm.phone
    };
    setUser(updatedUser);
    setShowEditProfileModal(false);
    toast({ title: 'Профиль обновлён', description: 'Ваш профиль успешно сохранён' });
  };

  const addUsername = () => {
    if (newUsername.length < 4) {
      toast({ 
        title: 'Ошибка', 
        description: 'Имя пользователя должно содержать минимум 4 символа',
        variant: 'destructive'
      });
      return;
    }
    
    if (user.usernames.includes(newUsername)) {
      toast({ 
        title: 'Ошибка', 
        description: 'Это имя пользователя уже добавлено',
        variant: 'destructive'
      });
      return;
    }

    const updatedUser = {
      ...user,
      usernames: [...user.usernames, newUsername]
    };
    setUser(updatedUser);
    setNewUsername('');
    toast({ 
      title: 'Успешно', 
      description: `Имя пользователя @${newUsername} добавлено!` 
    });
  };

  const removeUsername = (usernameToRemove) => {
    const updatedUser = {
      ...user,
      usernames: user.usernames.filter(u => u !== usernameToRemove)
    };
    setUser(updatedUser);
    toast({ 
      title: 'Удалено', 
      description: `Имя пользователя @${usernameToRemove} удалено` 
    });
  };

  const createNewContact = () => {
    if (!newContactForm.name || !newContactForm.username) {
      toast({ 
        title: 'Ошибка', 
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    if (newContactForm.username.length < 4) {
      toast({ 
        title: 'Ошибка', 
        description: 'Имя пользователя должно содержать минимум 4 символа',
        variant: 'destructive'
      });
      return;
    }

    const newContact = {
      id: `user-${Date.now()}`,
      name: newContactForm.name,
      usernames: [newContactForm.username],
      avatar: newContactForm.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newContactForm.name}`,
      status: newContactForm.type === 'bot' ? 'online' : 'offline',
      lastSeen: newContactForm.type === 'bot' ? null : 'только что',
      unreadCount: 0,
      lastMessage: '',
      lastMessageTime: 'сейчас',
      isBot: newContactForm.type === 'bot',
      isChannel: newContactForm.type === 'channel',
      members: newContactForm.type === 'channel' ? 0 : undefined
    };

    setContacts([...contacts, newContact]);
    setAllMessages({ ...allMessages, [newContact.id]: [] });
    setShowCreateContact(false);
    setNewContactForm({ name: '', username: '', avatar: '', type: 'contact' });
    
    toast({ 
      title: 'Создано!', 
      description: `${newContactForm.type === 'bot' ? 'Бот' : newContactForm.type === 'channel' ? 'Канал' : 'Контакт'} "${newContactForm.name}" успешно создан` 
    });
  };

  const claimDailyReward = () => {
    const now = Date.now();
    const lastReward = user.lastDailyReward || 0;
    const timeDiff = now - lastReward;
    const hoursLeft = 24 - Math.floor(timeDiff / (1000 * 60 * 60));
    
    if (timeDiff >= 24 * 60 * 60 * 1000) {
      const updatedUser = {
        ...user,
        stars: (user.stars || 0) + 500,
        lastDailyReward: now
      };
      setUser(updatedUser);
      toast({ 
        title: '🎉 Награда получена!', 
        description: '+500 ⭐ Текущий баланс: ' + updatedUser.stars 
      });
    } else {
      toast({ 
        title: '⏰ Уже получено', 
        description: `Следующая награда через: ${hoursLeft} ч.`,
        variant: 'destructive'
      });
    }
  };

  const updateSubscriberCount = () => {
    const newCount = parseInt(tempSubscriberCount);
    if (isNaN(newCount) || newCount < 0) {
      toast({ 
        title: 'Ошибка', 
        description: 'Введите корректное число',
        variant: 'destructive'
      });
      return;
    }

    const updatedContacts = contacts.map(c => {
      if (c.id === selectedChat.id && c.isChannel) {
        return { ...c, members: newCount };
      }
      return c;
    });
    
    setContacts(updatedContacts);
    setSelectedChat({ ...selectedChat, members: newCount });
    setEditingSubscribers(false);
    setTempSubscriberCount('');
    
    toast({ 
      title: 'Обновлено', 
      description: `Количество подписчиков: ${newCount.toLocaleString()}` 
    });
  };

  const openEditContact = (contact) => {
    setEditingContact(contact);
    setEditForm({
      name: contact.name,
      avatar: contact.avatar,
      about: ''
    });
    setShowEditContactModal(true);
  };

  const saveContactEdit = () => {
    const updatedContacts = contacts.map(c => {
      if (c.id === editingContact.id) {
        return {
          ...c,
          name: editForm.name,
          avatar: editForm.avatar
        };
      }
      return c;
    });
    setContacts(updatedContacts);
    
    // Update selected chat if it's the one being edited
    if (selectedChat.id === editingContact.id) {
      setSelectedChat({
        ...selectedChat,
        name: editForm.name,
        avatar: editForm.avatar
      });
    }
    
    setShowEditContactModal(false);
    setEditingContact(null);
    toast({ title: 'Контакт обновлён', description: 'Контакт успешно сохранён' });
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Left Sidebar - Contacts List */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.ibb.co/7tWc7T90/logo-round-corners.png" 
                alt="CL Logo" 
                className="w-10 h-10 object-contain rounded-lg"
              />
              <span className="text-xl font-bold">CL</span>
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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-zinc-800"
                onClick={() => setShowStarsSettings(true)}
                title="Звёзды"
              >
                <span className="text-xl">⭐</span>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-zinc-800"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 bg-zinc-900 border-zinc-800">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-zinc-800"
                      onClick={() => setShowMyProfile(true)}
                    >
                      Мой профиль
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-zinc-800"
                      onClick={openEditProfile}
                    >
                      Редактировать профиль
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-zinc-800"
                      onClick={() => setShowSettings(true)}
                    >
                      Настройки
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Поиск чатов..."
              className="pl-10 bg-zinc-900 border-zinc-800 focus:border-[#2fa34e]"
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
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#2fa34e] rounded-full border-2 border-zinc-950" />
                  )}
                  {contact.isBot && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#2fa34e] rounded-full border-2 border-zinc-950 flex items-center justify-center">
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
                      {contact.isBot && <Badge variant="secondary" className="text-xs">Бот</Badge>}
                    </div>
                    <span className="text-xs text-zinc-500">{contact.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-400 truncate">
                      {contact.usernames && contact.usernames.length > 0 && (
                        <span className="text-[#2fa34e]">@{contact.usernames[0]}</span>
                      )}
                      {contact.isChannel && (
                        <span className="text-purple-400">{contact.members?.toLocaleString()} подписчиков</span>
                      )}
                      {!contact.isChannel && !contact.usernames?.length && contact.lastMessage}
                    </p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-[#2fa34e] text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Create Contact Button - conditional */}
        {appSettings.showCreateContact && (
          <div className="p-4 border-t border-zinc-800">
            <Button
              onClick={() => setShowCreateContact(true)}
              className="w-full bg-[#2fa34e] hover:bg-[#258a3c] text-white flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Создать контакт
            </Button>
          </div>
        )}
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
                {selectedChat.isBot && <Bot className="w-4 h-4 text-[#2fa34e]" />}
                {selectedChat.isChannel && <Users className="w-4 h-4 text-purple-500" />}
              </div>
              <p className="text-xs text-zinc-400">
                {selectedChat.isChannel
                  ? `${selectedChat.members?.toLocaleString()} подписчиков`
                  : selectedChat.isBot
                  ? 'Всегда онлайн'
                  : selectedChat.status === 'online'
                  ? 'онлайн'
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
              onClick={() => setShowBackgroundSelector(true)}
              title="Изменить фон"
            >
              <ImageIcon className="w-5 h-5" />
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
        <ScrollArea className="flex-1 p-4 relative" style={{
          backgroundImage: customBackground !== 'none' ? `url(${customBackground})` : 'none',
          backgroundColor: customBackground === 'none' ? '#18181b' : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}>
          <div className={`absolute inset-0 ${customBackground !== 'none' ? 'bg-zinc-900/70 backdrop-blur-[1px]' : ''}`}></div>
          <div className="space-y-4 max-w-4xl mx-auto relative z-10">
            {chatMessages.map((message) => (
              <div key={message.id}>
                {message.type === 'gift' ? (
                  <GiftMessage
                    gift={message.gift}
                    sender={user}
                    recipient={message.recipient}
                    isReceived={message.senderId !== user.id}
                  />
                ) : (
                  <div
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md ${
                        message.senderId === user.id
                          ? `${appSettings.designTheme === 'telegram' ? 'bg-blue-600' : 'bg-[#2fa34e]'} text-white ${appSettings.designTheme === 'telegram' ? 'rounded-[20px]' : 'rounded-l-2xl rounded-tr-2xl'}`
                          : `bg-zinc-800 text-white ${appSettings.designTheme === 'telegram' ? 'rounded-[20px]' : 'rounded-r-2xl rounded-tl-2xl'}`
                      } px-4 py-2 shadow-lg`}
                    >
                      {message.type === 'text' && (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                      <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                    </div>
                  </div>
                )}
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
              placeholder="Напишите сообщение или /commands для помощи..."
              className="flex-1 bg-zinc-900 border-zinc-800 focus:border-[#2fa34e]"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-[#2fa34e] hover:bg-[#258a3c] text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Profile & Info */}
      {showGallery && (
        <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex flex-col items-center relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 hover:bg-zinc-800"
                onClick={() => openEditContact(selectedChat)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Avatar className="w-24 h-24 mb-3">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
              {selectedChat.usernames && selectedChat.usernames.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {selectedChat.usernames.map((username, idx) => (
                    <span key={idx} className="text-sm text-[#2fa34e]">@{username}</span>
                  ))}
                </div>
              )}
              {selectedChat.isBot && (
                <Badge className="mt-2 bg-[#2fa34e]">Бот</Badge>
              )}
              {selectedChat.isChannel && (
                <div className="mt-2 flex flex-col items-center gap-2">
                  {!editingSubscribers ? (
                    <>
                      <p className="text-sm text-purple-400">{selectedChat.members?.toLocaleString()} подписчиков</p>
                      {appSettings.showSubscriberEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-zinc-700 hover:bg-zinc-800"
                          onClick={() => {
                            setEditingSubscribers(true);
                            setTempSubscriberCount(selectedChat.members?.toString() || '0');
                          }}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Изменить подписчиков
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        value={tempSubscriberCount}
                        onChange={(e) => setTempSubscriberCount(e.target.value)}
                        className="w-32 bg-zinc-800 border-zinc-700 text-center"
                        min="0"
                      />
                      <Button
                        size="sm"
                        className="bg-[#2fa34e] hover:bg-[#258a3c]"
                        onClick={updateSubscriberCount}
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingSubscribers(false);
                          setTempSubscriberCount('');
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {!selectedChat.isBot && !selectedChat.isChannel && (
                <p className="text-sm text-zinc-400 mt-1">
                  {selectedChat.status === 'online' ? 'Онлайн' : `Был в сети ${selectedChat.lastSeen}`}
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
                    Команды бота
                  </h4>
                  <p className="text-sm text-zinc-400 mb-3">
                    Напишите /commands в чате, чтобы увидеть все доступные команды для этого бота.
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
                    Информация о канале
                  </h4>
                  <p className="text-sm text-zinc-400">
                    Это публичный канал для развлекательных постов и обновлений. {selectedChat.members?.toLocaleString()} подписчиков наслаждаются контентом!
                  </p>
                </div>
              )}

              <div className="bg-zinc-900 rounded-lg p-4">
                <h4 className="font-semibold mb-2">О контакте</h4>
                <p className="text-sm text-zinc-400">
                  {selectedChat.isBot
                    ? `${selectedChat.name} is an automated bot that responds to commands.`
                    : selectedChat.isChannel
                    ? 'A channel for sharing fun content with the community.'
                    : `Chat with ${selectedChat.name}`}
                </p>
              </div>

              <div className="bg-zinc-900 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Быстрые действия</h4>
                <div className="space-y-2">
                  {/* Gift Button - Show for contacts and channels, but not bots or self */}
                  {!selectedChat.isBot && selectedChat.id !== user.id && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm hover:bg-zinc-800 text-[#2fa34e] hover:text-[#2fa34e]"
                      onClick={() => setShowGiftShop(true)}
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Подарить подарок 🎁
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm hover:bg-zinc-800"
                    onClick={clearChat}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Очистить чат (/clear)
                  </Button>
                </div>
              </div>

              {/* Gifts Received Section */}
              {selectedChat.receivedGifts && selectedChat.receivedGifts.length > 0 && (
                <div className="bg-zinc-900 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#2fa34e]" />
                    Полученные подарки ({selectedChat.receivedGifts.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedChat.receivedGifts.slice(-3).reverse().map((receivedGift) => (
                      <div key={receivedGift.id} className="bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
                        <img
                          src={receivedGift.gift.image}
                          alt={receivedGift.gift.nameRu}
                          className="w-12 h-12 object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{receivedGift.gift.nameRu}</p>
                          <p className="text-xs text-zinc-400 truncate">От: {receivedGift.from.name}</p>
                          <p className="text-xs text-zinc-500">{receivedGift.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfileModal} onOpenChange={setShowEditProfileModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Измените свой профиль и аватар
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Имя</Label>
              <Input
                id="profile-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Выберите аватар из галереи</Label>
              <ScrollArea className="h-48 border border-zinc-700 rounded-lg p-2">
                <div className="grid grid-cols-6 gap-2">
                  {presetAvatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setEditForm({ ...editForm, avatar: avatarUrl })}
                      className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-[#2fa34e] transition-all ${
                        editForm.avatar === avatarUrl ? 'ring-2 ring-[#2fa34e]' : ''
                      }`}
                    >
                      <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-avatar">Или введите URL аватара</Label>
              <Input
                id="profile-avatar"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                placeholder="https://example.com/avatar.png"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Номер телефона</Label>
              <div className="flex gap-2">
                <Input
                  id="profile-phone"
                  value={editForm.phone || tempPhone}
                  onChange={(e) => {
                    if (!editForm.phone) {
                      setTempPhone(e.target.value);
                    }
                  }}
                  placeholder="+7 999 123 45 67"
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  disabled={!!editForm.phone}
                />
                {!editForm.phone && tempPhone && (
                  <Button
                    onClick={handlePhoneVerification}
                    className="bg-[#2fa34e] hover:bg-[#258a3c]"
                  >
                    Подтвердить
                  </Button>
                )}
                {editForm.phone && (
                  <Button
                    onClick={() => {
                      setEditForm({ ...editForm, phone: '' });
                      setTempPhone('');
                    }}
                    variant="outline"
                    className="border-zinc-700"
                  >
                    Изменить
                  </Button>
                )}
              </div>
              {editForm.phone && (
                <p className="text-xs text-[#2fa34e]">✓ Номер подтверждён</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-about">О себе</Label>
              <Input
                id="profile-about"
                value={editForm.about}
                onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                placeholder="Расскажите о себе..."
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Имена пользователя</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {user.usernames.map((username, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-[#2fa34e]">@{username}</span>
                    <button
                      onClick={() => removeUsername(username)}
                      className="text-zinc-400 hover:text-red-500 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                  placeholder="Новое имя пользователя (мин. 4 символа)"
                  className="bg-zinc-800 border-zinc-700 flex-1"
                  maxLength={20}
                />
                <Button
                  onClick={addUsername}
                  className="bg-[#2fa34e] hover:bg-[#258a3c]"
                  disabled={newUsername.length < 4}
                >
                  Добавить
                </Button>
              </div>
              <p className="text-xs text-zinc-500">
                Минимум 4 символа. Без пробелов и спецсимволов.
              </p>
            </div>

            {editForm.avatar && (
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={editForm.avatar} />
                  <AvatarFallback>{editForm.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowEditProfileModal(false)}
              className="hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={saveProfile}
              className="bg-[#2fa34e] hover:bg-[#258a3c]"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phone Verification Modal */}
      <Dialog open={showPhoneVerification} onOpenChange={setShowPhoneVerification}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Подтверждение номера</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Введите код подтверждения, отправленный на {tempPhone}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Код подтверждения</Label>
              <Input
                id="verification-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Введите код"
                className="bg-zinc-800 border-zinc-700 text-center text-2xl tracking-widest"
                maxLength={4}
                autoFocus
              />
              <p className="text-xs text-zinc-500 text-center">
                Подсказка: код - 1111
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowPhoneVerification(false);
                setVerificationCode('');
              }}
              className="hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={verifyPhone}
              className="bg-[#2fa34e] hover:bg-[#258a3c]"
            >
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Selector Modal */}
      <Dialog open={showBackgroundSelector} onOpenChange={setShowBackgroundSelector}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Выберите фон чата</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Выберите фон для области сообщений
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {backgroundOptions.map((bg) => (
              <button
                key={bg.id}
                onClick={() => {
                  setCustomBackground(bg.url);
                  setShowBackgroundSelector(false);
                  toast({ title: 'Фон изменён', description: `Установлен фон: ${bg.name}` });
                }}
                className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-[#2fa34e] transition-all ${
                  customBackground === bg.url ? 'ring-2 ring-[#2fa34e]' : ''
                } h-32`}
              >
                {bg.url !== 'none' ? (
                  <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-400">Без фона</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm py-2 px-3">
                  {bg.name}
                </div>
                {customBackground === bg.url && (
                  <div className="absolute top-2 right-2 bg-[#2fa34e] text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Или введите URL своего фона</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/background.jpg"
                className="bg-zinc-800 border-zinc-700 flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setCustomBackground(e.target.value);
                    setShowBackgroundSelector(false);
                    toast({ title: 'Фон изменён', description: 'Установлен пользовательский фон' });
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowBackgroundSelector(false)}
              className="hover:bg-zinc-800"
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Contact Modal */}
      <Dialog open={showCreateContact} onOpenChange={setShowCreateContact}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать новый контакт</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Создайте новый контакт, бота или канал
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-type">Тип</Label>
              <select
                id="contact-type"
                value={newContactForm.type}
                onChange={(e) => setNewContactForm({ ...newContactForm, type: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
              >
                <option value="contact">Контакт</option>
                <option value="bot">Бот</option>
                <option value="channel">Канал</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contact-name">Имя *</Label>
              <Input
                id="new-contact-name"
                value={newContactForm.name}
                onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                placeholder="Введите имя"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contact-username">Имя пользователя *</Label>
              <Input
                id="new-contact-username"
                value={newContactForm.username}
                onChange={(e) => setNewContactForm({ ...newContactForm, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                placeholder="username (мин. 4 символа)"
                className="bg-zinc-800 border-zinc-700"
                maxLength={20}
              />
              <p className="text-xs text-zinc-500">
                Минимум 4 символа. Без пробелов и спецсимволов.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Выберите аватар из галереи</Label>
              <ScrollArea className="h-48 border border-zinc-700 rounded-lg p-2">
                <div className="grid grid-cols-6 gap-2">
                  {presetAvatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setNewContactForm({ ...newContactForm, avatar: avatarUrl })}
                      className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-[#2fa34e] transition-all ${
                        newContactForm.avatar === avatarUrl ? 'ring-2 ring-[#2fa34e]' : ''
                      }`}
                    >
                      <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contact-avatar">Или введите URL аватара</Label>
              <Input
                id="new-contact-avatar"
                value={newContactForm.avatar}
                onChange={(e) => setNewContactForm({ ...newContactForm, avatar: e.target.value })}
                placeholder="https://example.com/avatar.png"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            {newContactForm.avatar && (
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={newContactForm.avatar} />
                  <AvatarFallback>{newContactForm.name[0] || '?'}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateContact(false);
                setNewContactForm({ name: '', username: '', avatar: '', type: 'contact' });
              }}
              className="hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={createNewContact}
              className="bg-[#2fa34e] hover:bg-[#258a3c]"
            >
              <Save className="w-4 h-4 mr-2" />
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={showEditContactModal} onOpenChange={setShowEditContactModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать контакт</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Измените имя и аватар {editingContact?.isBot ? 'бота' : editingContact?.isChannel ? 'канала' : 'контакта'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Имя</Label>
              <Input
                id="contact-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Выберите аватар из галереи</Label>
              <ScrollArea className="h-48 border border-zinc-700 rounded-lg p-2">
                <div className="grid grid-cols-6 gap-2">
                  {presetAvatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setEditForm({ ...editForm, avatar: avatarUrl })}
                      className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-[#2fa34e] transition-all ${
                        editForm.avatar === avatarUrl ? 'ring-2 ring-[#2fa34e]' : ''
                      }`}
                    >
                      <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-avatar">Или введите URL аватара</Label>
              <Input
                id="contact-avatar"
                value={editForm.avatar}
                onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                placeholder="https://example.com/avatar.png"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            {editForm.avatar && (
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={editForm.avatar} />
                  <AvatarFallback>{editForm.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowEditContactModal(false)}
              className="hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={saveContactEdit}
              className="bg-[#2fa34e] hover:bg-[#258a3c]"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Avatar Gallery - Manage All Contacts */}
      <Dialog open={showAvatarGallery} onOpenChange={setShowAvatarGallery}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Управление аватарами контактов</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Измените аватары всех ваших контактов, ботов и каналов
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[600px] py-4">
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      {contact.name}
                      {contact.isBot && <Badge variant="secondary" className="text-xs">Бот</Badge>}
                      {contact.isChannel && <Badge variant="secondary" className="text-xs bg-purple-600">Канал</Badge>}
                    </h3>
                    {contact.usernames && contact.usernames.length > 0 && (
                      <p className="text-sm text-cyan-400">@{contact.usernames[0]}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-700 hover:bg-zinc-600 border-zinc-600"
                    onClick={() => {
                      setShowAvatarGallery(false);
                      openEditContact(contact);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Изменить
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowAvatarGallery(false)}
              className="hover:bg-zinc-800"
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Contact Modal */}
      <Dialog open={showCreateContact} onOpenChange={setShowCreateContact}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать новый контакт</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Создайте новый контакт, бота или канал
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contact-type">Тип</Label>
              <select
                id="contact-type"
                value={newContactForm.type}
                onChange={(e) => setNewContactForm({ ...newContactForm, type: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
              >
                <option value="contact">Контакт</option>
                <option value="bot">Бот</option>
                <option value="channel">Канал</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contact-name">Имя *</Label>
              <Input
                id="new-contact-name"
                value={newContactForm.name}
                onChange={(e) => setNewContactForm({ ...newContactForm, name: e.target.value })}
                placeholder="Введите имя"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contact-username">Имя пользователя *</Label>
              <Input
                id="new-contact-username"
                value={newContactForm.username}
                onChange={(e) => setNewContactForm({ ...newContactForm, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                placeholder="username (мин. 4 символа)"
                className="bg-zinc-800 border-zinc-700"
                maxLength={20}
              />
              <p className="text-xs text-zinc-500">
                Минимум 4 символа. Без пробелов и спецсимволов.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Выберите аватар из галереи</Label>
              <ScrollArea className="h-48 border border-zinc-700 rounded-lg p-2">
                <div className="grid grid-cols-6 gap-2">
                  {presetAvatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setNewContactForm({ ...newContactForm, avatar: avatarUrl })}
                      className={`relative rounded-lg overflow-hidden hover:ring-2 hover:ring-[#2fa34e] transition-all ${
                        newContactForm.avatar === avatarUrl ? 'ring-2 ring-[#2fa34e]' : ''
                      }`}
                    >
                      <img src={avatarUrl} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contact-avatar">Или введите URL аватара</Label>
              <Input
                id="new-contact-avatar"
                value={newContactForm.avatar}
                onChange={(e) => setNewContactForm({ ...newContactForm, avatar: e.target.value })}
                placeholder="https://example.com/avatar.png"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            {newContactForm.avatar && (
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={newContactForm.avatar} />
                  <AvatarFallback>{newContactForm.name[0] || '?'}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateContact(false);
                setNewContactForm({ name: '', username: '', avatar: '', type: 'contact' });
              }}
              className="hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              Отмена
            </Button>
            <Button
              onClick={createNewContact}
              className="bg-[#2fa34e] hover:bg-[#258a3c]"
              disabled={!newContactForm.name || !newContactForm.username}
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stars Settings Modal */}
      <Dialog open={showStarsSettings} onOpenChange={setShowStarsSettings}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              Звёзды
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Управление звёздами и бонусами
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {user.stars || 0}
              </div>
              <p className="text-sm text-zinc-400">Ваш баланс звёзд</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  🎁 Ежедневная награда
                </h4>
                <p className="text-sm text-zinc-400 mb-3">
                  Получайте 500 звёзд каждый день!
                </p>
                <Button
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => {
                    claimDailyReward();
                  }}
                >
                  Получить награду
                </Button>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2">💡 Как использовать звёзды</h4>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• Разблокировка премиум функций</li>
                  <li>• Специальные стикеры и эмодзи</li>
                  <li>• Дополнительные возможности чата</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowStarsSettings(false)}
              className="hover:bg-zinc-800"
            >
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gift Shop Modal */}
      <GiftShop
        isOpen={showGiftShop}
        onClose={() => setShowGiftShop(false)}
        recipient={selectedChat}
        userStars={user.stars || 0}
        onSendGift={handleSendGift}
        customGifts={customGifts}
      />

      {/* My Profile Modal */}
      <MyProfileModal
        isOpen={showMyProfile}
        onClose={() => setShowMyProfile(false)}
        user={user}
        onGiftToSelf={() => {
          setShowMyProfile(false);
          setSelectedChat({ ...user, id: user.id });
          setShowGiftShop(true);
        }}
        onEditProfile={() => {
          setShowMyProfile(false);
          openEditProfile();
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        appSettings={appSettings}
        onSaveSettings={(newSettings) => {
          setAppSettings(newSettings);
          toast({ 
            title: 'Настройки сохранены', 
            description: 'Изменения применены успешно' 
          });
        }}
        user={user}
        onOpenProfile={() => {
          setShowSettings(false);
          setShowMyProfile(true);
        }}
        onOpenStars={() => {
          setShowSettings(false);
          setShowStarsSettings(true);
        }}
      />

      {/* Registration Modal */}
      {showRegistration && (
        <RegistrationModal
          onComplete={(userData) => {
            setShowRegistration(false);
            const updatedUser = {
              ...user,
              name: userData.username,
              usernames: [userData.username],
              phone: userData.phone
            };
            setUser(updatedUser);
          }}
        />
      )}
    </div>
  );
};

export default ChatApp;
