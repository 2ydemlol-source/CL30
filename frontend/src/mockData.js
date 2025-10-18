export const currentUser = {
  id: 'user-1',
  name: 'You',
  username: 'myusername',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  phone: '+1 234 567 8900',
  status: 'online',
  about: 'Hey there! I am using ICQ New'
};

export const contacts = [
  {
    id: 'user-2',
    name: 'Sarah Wilson',
    username: 'sarah_w',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'online',
    lastSeen: null,
    unreadCount: 3,
    lastMessage: 'See you tomorrow!',
    lastMessageTime: '10:45 AM',
    typing: false
  },
  {
    id: 'user-3',
    name: 'Michael Brown',
    username: 'mike_b',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Thanks for the help!',
    lastMessageTime: '9:30 AM',
    typing: false
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    username: 'emily_d',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'away',
    lastSeen: '15 minutes ago',
    unreadCount: 1,
    lastMessage: 'Got it!',
    lastMessageTime: 'Yesterday',
    typing: false
  },
  {
    id: 'group-1',
    name: 'Team Project',
    username: null,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=TeamProject',
    status: 'group',
    members: 12,
    unreadCount: 5,
    lastMessage: 'John: Let\'s meet at 3 PM',
    lastMessageTime: '11:20 AM',
    isGroup: true
  },
  {
    id: 'user-5',
    name: 'David Miller',
    username: 'david_m',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'offline',
    lastSeen: '2 hours ago',
    unreadCount: 0,
    lastMessage: 'Sure thing!',
    lastMessageTime: '2 days ago',
    typing: false
  },
  {
    id: 'user-6',
    name: 'Jessica Taylor',
    username: 'jess_t',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Sounds good!',
    lastMessageTime: '3 days ago',
    typing: false
  },
  {
    id: 'group-2',
    name: 'Family Chat',
    username: null,
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=FamilyChat',
    status: 'group',
    members: 8,
    unreadCount: 0,
    lastMessage: 'Mom: Dinner at 7?',
    lastMessageTime: 'Monday',
    isGroup: true
  }
];

export const messages = {
  'user-2': [
    {
      id: 'msg-1',
      senderId: 'user-2',
      content: 'Hey! How are you doing?',
      timestamp: '10:30 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      content: 'I\'m doing great! Just finished a big project.',
      timestamp: '10:32 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-3',
      senderId: 'user-2',
      content: 'That\'s awesome! Congrats! 🎉',
      timestamp: '10:33 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-4',
      senderId: 'user-1',
      content: 'Thanks! Want to grab coffee tomorrow?',
      timestamp: '10:35 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-5',
      senderId: 'user-2',
      content: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      timestamp: '10:40 AM',
      type: 'image',
      status: 'read',
      caption: 'This cafe looks perfect!'
    },
    {
      id: 'msg-6',
      senderId: 'user-2',
      content: 'See you tomorrow!',
      timestamp: '10:45 AM',
      type: 'text',
      status: 'delivered'
    }
  ],
  'user-3': [
    {
      id: 'msg-7',
      senderId: 'user-3',
      content: 'Hey, can you help me with that code issue?',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-8',
      senderId: 'user-1',
      content: 'Sure! What\'s the problem?',
      timestamp: '9:05 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-9',
      senderId: 'user-3',
      content: 'I\'m getting an error with the API call.',
      timestamp: '9:10 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-10',
      senderId: 'user-1',
      content: 'Try checking the headers. Make sure you\'re sending the auth token.',
      timestamp: '9:15 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-11',
      senderId: 'user-3',
      content: 'That worked! Thanks for the help!',
      timestamp: '9:30 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'user-4': [
    {
      id: 'msg-12',
      senderId: 'user-1',
      content: 'Don\'t forget about the meeting tomorrow!',
      timestamp: 'Yesterday 3:00 PM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-13',
      senderId: 'user-4',
      content: 'Got it!',
      timestamp: 'Yesterday 3:05 PM',
      type: 'text',
      status: 'read'
    }
  ]
};

export const mediaGallery = {
  'user-2': {
    photos: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      'https://images.unsplash.com/photo-1506812574058-fc75fa93fead?w=400',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400'
    ],
    videos: [
      { thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400', duration: '2:34' },
      { thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400', duration: '1:15' }
    ],
    files: [
      { name: 'Project_Report.pdf', size: '2.4 MB', date: '10/15/2025' },
      { name: 'Design_Mockup.fig', size: '8.1 MB', date: '10/12/2025' },
      { name: 'Budget_2025.xlsx', size: '156 KB', date: '10/10/2025' }
    ],
    links: [
      { url: 'https://github.com', title: 'GitHub Repository', preview: 'github.com' },
      { url: 'https://figma.com', title: 'Design Files', preview: 'figma.com' },
      { url: 'https://notion.so', title: 'Project Notes', preview: 'notion.so' }
    ],
    voice: [
      { duration: '0:45', date: '10:30 AM' },
      { duration: '1:20', date: '9:15 AM' },
      { duration: '0:33', date: 'Yesterday' }
    ]
  }
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
  { id: 10, emoji: '🙏', name: 'Prayer' }
];