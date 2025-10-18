export const currentUser = {
  id: 'user-1',
  name: 'You',
  usernames: ['myusername'],
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  phone: '+1 234 567 8900',
  status: 'online',
  about: 'Hey there! I am using ICQ New'
};

export const initialContacts = [
  {
    id: 'demka',
    name: 'Demka',
    usernames: ['developer', 'abc'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demka',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Hi there!',
    lastMessageTime: '10:45 AM',
    isBot: false
  },
  {
    id: 'test',
    name: 'Test',
    usernames: ['test'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    status: 'offline',
    lastSeen: '2 hours ago',
    unreadCount: 0,
    lastMessage: 'Testing...',
    lastMessageTime: '9:30 AM',
    isBot: false
  },
  {
    id: 'goose',
    name: 'Goose',
    usernames: ['gus', 'Therealgus', '4real111'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Goose',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Kwa kwa kwa!',
    lastMessageTime: 'Yesterday',
    isBot: false
  },
  {
    id: 'burger',
    name: 'Burger',
    usernames: ['burger', 'I\'m', 'krabs'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Burger',
    status: 'away',
    lastSeen: '15 minutes ago',
    unreadCount: 0,
    lastMessage: 'Yummy!',
    lastMessageTime: '2 days ago',
    isBot: false
  },
  {
    id: 'fun-channel',
    name: 'Fun Channel',
    usernames: ['funchannel'],
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=FunChannel',
    status: 'channel',
    members: 7000000,
    unreadCount: 0,
    lastMessage: 'Check out the latest post!',
    lastMessageTime: '1 hour ago',
    isChannel: true
  },
  {
    id: 'simpson-bot',
    name: 'Simpson Bot',
    usernames: ['simpson_bot'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SimpsonBot',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Type /hello to start!',
    lastMessageTime: '5 min ago',
    isBot: true
  },
  {
    id: 'help-bot',
    name: 'Reference Bot',
    usernames: ['help', 'bot', 'always_online'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HelpBot',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'How can I help you?',
    lastMessageTime: '10 min ago',
    isBot: true
  },
  {
    id: 'debug-bot',
    name: 'Debug Bot',
    usernames: ['debug', 'imp'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DebugBot',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Ready for commands!',
    lastMessageTime: '3 min ago',
    isBot: true
  }
];

export const initialMessages = {
  'demka': [
    {
      id: 'msg-1',
      senderId: 'demka',
      content: 'Hi there! Welcome to ICQ New!',
      timestamp: '10:30 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      content: 'Hey! This looks great!',
      timestamp: '10:45 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'simpson-bot': [
    {
      id: 'msg-bot-1',
      senderId: 'simpson-bot',
      content: 'D\'oh! Hey there! I\'m Homer... I mean, Simpson Bot! Type /hello to start or /commands to see what I can do!',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'help-bot': [
    {
      id: 'msg-help-1',
      senderId: 'help-bot',
      content: 'Welcome to ICQ New! I\'m your assistant. Type /commands to see all available commands.',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'debug-bot': [
    {
      id: 'msg-debug-1',
      senderId: 'debug-bot',
      content: 'Debug Bot initialized. Use /addchat [name] to create chats, /dark to toggle theme, or /tell [message] [1-5] to send multiple messages.',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'fun-channel': [
    {
      id: 'msg-channel-1',
      senderId: 'fun-channel',
      content: 'Welcome to Fun Channel! 🎉 7M subscribers strong!',
      timestamp: '1 hour ago',
      type: 'text',
      status: 'read'
    }
  ]
};

export const stickers = [
  { id: 1, emoji: '😀', name: 'Happy' },
  { id: 2, emoji: '😂', name: 'Laughing' },
  { id: 3, emoji: '❤️', name: 'Love' },
  { id: 4, emoji: '👍', name: 'Thumbs Up' },
  { id: 5, emoji: '🎉', name: 'Party' },
  { id: 6, emoji: '🔥', name: 'Fire' },
  { id: 7, emoji: '😎', name: 'Cool' },
  { id: 8, emoji: '🤔', name: 'Thinking' },
  { id: 9, emoji: '😍', name: 'Heart Eyes' },
  { id: 10, emoji: '🙏', name: 'Prayer' },
  { id: 11, emoji: '🍔', name: 'Burger' },
  { id: 12, emoji: '🦆', name: 'Duck' }
];

// Bot command responses
export const botCommands = {
  'simpson-bot': {
    '/hello': 'D\'oh! Hello there! I\'m Homer... I mean, Simpson Bot! Mmm... donuts... 🍩',
    '/burger': 'Burgers are delicious :) 🍔 Mmm... burgers...',
    '/gus': 'Kwa kwa kwa, goose 🦆',
    '/ps': '🎮 Secret Easter Egg discovered! You found the PlayStation reference! D\'oh!',
    '/sosiska': 'Sausage! 🌭 Homer loves sausages too!',
    '/commands': 'Available commands:\n/hello - Welcome message\n/burger - Burgers are delicious\n/gus - Goose sound\n/ps - Secret Easter egg\n/sosiska - Sausage'
  },
  'help-bot': {
    '/commands': 'Available commands:\n/commands - List of all commands\n/project - Information about the project\n/connect - Contacts for communication\n/update - Information about updates\n/addusername [username] - Add username to profile\n/clear - Clear chat history',
    '/project': 'ICQ New Messenger - A modern messaging app with advanced bot functionality and beautiful interface. Built for comfortable communication and testing.',
    '/connect': 'Connect with us:\n📧 Email: support@icqnew.local\n🌐 Website: icqnew.local\n💬 Community: @icqnew',
    '/update': 'Latest updates:\n✨ New bot commands\n🎨 Improved UI/UX\n💾 Local storage support\n🌙 Dark/Light themes\n⚡️ Faster performance',
    '/addusername': 'Usage: /addusername [username]\nExample: /addusername mynewname'
  },
  'debug-bot': {
    '/addchat': 'Usage: /addchat [name]\nExample: /addchat NewFriend\nNote: Maximum 10 chats allowed',
    '/dark': 'Theme toggled! ✨',
    '/tell': 'Usage: /tell [message] [1-5]\nExample: /tell Hello 3\nThis will send "Hello" 3 times',
    '/commands': 'Available commands:\n/addchat [name] - Create a new chat (max 10)\n/dark - Switch dark theme\n/tell [message] [1-5] - Send message multiple times'
  }
};

// Common commands for all chats
export const commonCommands = {
  '/clear': 'Chat cleared! 🧹'
};