import plushPepeLottie from './assets/lottie/gifts/plush-pepe.json';
import candyCaneLottie from './assets/lottie/gifts/candy-cane.json';
import scaredCatLottie from './assets/lottie/gifts/scared-cat.json';
import cakeLottie from './assets/lottie/gifts/cake.json';
import wineLottie from './assets/lottie/gifts/wine.json';
import lollipopLottie from './assets/lottie/gifts/lollipop.json';
import spyAgaricLottie from './assets/lottie/gifts/spy-agaric.json';
import astralShardLottie from './assets/lottie/gifts/astral-shard.json';
import duckLottie from './assets/lottie/gifts/duck.json';
import testGift1Lottie from './assets/lottie/gifts/test-gift-1.json';
import testGift2Lottie from './assets/lottie/gifts/test-gift-2.json';
import heartLottie from './assets/lottie/gifts/heart.json';
import durovCapLottie from './assets/lottie/gifts/durov-cap.json';

export const currentUser = {
  id: 'user-1',
  name: 'You',
  usernames: ['myusername'],
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  phone: '+1 234 567 8900',
  status: 'online',
  about: 'Hey there! I am using Nethgram',
  stars: 0,
  lastDailyReward: null,
  receivedGifts: [],
  verification: null,
  keywords: {}
};

// Доступные подарки с тиражами
export const availableGifts = [
  { id: 'plush-pepe', name: 'Plush pepe', nameRu: 'Plush pepe', price: 2000, totalSupply: 500, mintedCount: 0, lottieData: plushPepeLottie, isExclusive: true },
  { id: 'candy-cane', name: 'Candy cane', nameRu: 'Candy cane', price: 15, totalSupply: 5000, mintedCount: 0, lottieData: candyCaneLottie },
  { id: 'scared-cat', name: 'Scared cat', nameRu: 'Scared cat', price: 100, totalSupply: 500, mintedCount: 0, lottieData: scaredCatLottie },
  { id: 'cake', name: 'Cake', nameRu: 'Cake', price: 500, totalSupply: 3000, mintedCount: 0, lottieData: cakeLottie },
  { id: 'wine', name: 'Wine', nameRu: 'Wine', price: 50, totalSupply: 450, mintedCount: 0, lottieData: wineLottie },
  { id: 'lollipop', name: 'Lollipop', nameRu: 'Lollipop', price: 75, totalSupply: 1000, mintedCount: 0, lottieData: lollipopLottie },
  { id: 'spy-agaric', name: 'Spy agaric', nameRu: 'Spy agaric', price: 200, totalSupply: 4000, mintedCount: 0, lottieData: spyAgaricLottie },
  { id: 'astral-shard', name: 'Astral shard', nameRu: 'Astral shard', price: 555, totalSupply: 1487, mintedCount: 0, lottieData: astralShardLottie },
  { id: 'duck', name: 'Duck', nameRu: 'Duck', price: 7000, totalSupply: 6500, mintedCount: 0, lottieData: duckLottie, isPremium: true },
  { id: 'test-gift-1', name: 'Test gift 1', nameRu: 'Test gift 1', price: 10, totalSupply: 5, mintedCount: 0, lottieData: testGift1Lottie, adminOnly: true },
  { id: 'test-gift-2', name: 'Test gift 2', nameRu: 'Test gift 2', price: 15, totalSupply: 10, mintedCount: 0, lottieData: testGift2Lottie, adminOnly: true },
  { id: 'heart', name: 'Heart', nameRu: 'Heart', price: 175, totalSupply: null, mintedCount: 0, lottieData: heartLottie },
  { id: 'durov-cap', name: 'Durov cap', nameRu: 'Durov cap', price: 10000, totalSupply: null, mintedCount: 0, lottieData: durovCapLottie, isLegendary: true }
];

// NFT градиенты
export const nftGradients = [
  { id: 1, name: 'Фиолетово-желтый', gradient: 'linear-gradient(135deg, #f5ed16, #ab158a)' },
  { id: 2, name: 'Кроваво-черный', gradient: 'linear-gradient(135deg, #a11212, #000000)' },
  { id: 3, name: 'Розово-синий', gradient: 'linear-gradient(135deg, #1697ba, #bd194d)' },
  { id: 4, name: 'Зелено-голубой', gradient: 'linear-gradient(135deg, #199fbd, #57bd19)' },
  { id: 5, name: 'Абсолютно черный', gradient: 'linear-gradient(135deg, #000000, #000000)' },
  { id: 6, name: 'Зелено-красный', gradient: 'linear-gradient(135deg, #0ccc8c, #de1212)' }
];

export const initialContacts = [
  {
    id: 'favorites',
    name: 'Избранное',
    usernames: ['favorites'],
    avatar: 'https://cdn-icons-png.flaticon.com/512/7656/7656139.png',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Ваши сохранённые сообщения',
    lastMessageTime: '',
    isBot: false,
    isFavorite: true,
    isPinned: true
  },
  {
    id: 'demka',
    name: 'Demka',
    usernames: ['developer', 'abc'],
    avatar: 'https://www.pngfind.com/pngs/m/145-1458913_emojis-burger-png-download-hamburger-emoji-apple-transparent.png',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Привет!',
    lastMessageTime: '10:45 AM',
    isBot: false
  },
  {
    id: 'test',
    name: 'Тест',
    usernames: ['test'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
    status: 'offline',
    lastSeen: '2 часа назад',
    unreadCount: 0,
    lastMessage: 'Тестирую...',
    lastMessageTime: '9:30 AM',
    isBot: false
  },
  {
    id: 'goose',
    name: 'Гусь',
    usernames: ['gus', 'Therealgus', '4real111'],
    avatar: 'https://symbl-cdn.com/i/webp/21/dfe0b9e30973b15cdf3d4142961fc0.webp',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Кря кря кря!',
    lastMessageTime: 'Вчера',
    isBot: false
  },
  {
    id: 'burger',
    name: 'Бургер',
    usernames: ['burger', 'I\'m', 'krabs'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Burger',
    status: 'away',
    lastSeen: '15 минут назад',
    unreadCount: 0,
    lastMessage: 'Вкусно!',
    lastMessageTime: '2 дня назад',
    isBot: false
  },
  {
    id: 'fun-channel',
    name: 'Fun Channel',
    usernames: ['funchannel'],
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbkhBwErXuC5PkJ9XkKEB3l2GOHRhOa_GgiMNpcWT5V_QJc3sC4CYnApFeBspJsleVTIg&usqp=CAU',
    status: 'channel',
    members: 7000000,
    unreadCount: 0,
    lastMessage: 'Смотрите последний пост!',
    lastMessageTime: '1 час назад',
    isChannel: true
  },
  {
    id: 'simpson-bot',
    name: 'Симпсон Бот',
    usernames: ['simpson_bot'],
    avatar: 'https://pngimg.com/d/simpsons_PNG15.png',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Напиши /hello чтобы начать!',
    lastMessageTime: '5 мин назад',
    isBot: true
  },
  {
    id: 'help-bot',
    name: 'Справочный Бот',
    usernames: ['help', 'bot', 'always_online'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=HelpBot',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Чем могу помочь?',
    lastMessageTime: '10 мин назад',
    isBot: true
  },
  {
    id: 'debug-bot',
    name: 'Отладочный Бот',
    usernames: ['debug', 'imp'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DebugBot',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Готов к командам!',
    lastMessageTime: '3 мин назад',
    isBot: true,
    adminOnly: true
  },
  {
    id: 'stars-bot',
    name: 'Stars Bot',
    usernames: ['stars'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=StarsBot&backgroundColor=FFD700',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Управляйте своими звёздами!',
    lastMessageTime: '1 мин назад',
    isBot: true,
    adminOnly: true
  },
  {
    id: 'gift-bot',
    name: 'Gift Bot',
    usernames: ['gift', 'present'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GiftBot&backgroundColor=FF69B4',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Помощник по подаркам и звёздам',
    lastMessageTime: '30 сек назад',
    isBot: true,
    adminOnly: true
  },
  {
    id: 'config-bot',
    name: 'Config Bot',
    usernames: ['config', 'constructor'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ConfigBot&backgroundColor=4169E1',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Конструктор ботов готов к работе!',
    lastMessageTime: '1 мин назад',
    isBot: true,
    adminOnly: true
  },
  {
    id: 'peter-bot',
    name: 'Peter Bot',
    usernames: ['peter', 'griffin'],
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=PeterBot&backgroundColor=FFD700',
    status: 'online',
    lastSeen: null,
    unreadCount: 0,
    lastMessage: 'Хе-хе-хе! Готов веселиться!',
    lastMessageTime: '2 мин назад',
    isBot: true
  }
];

export const initialMessages = {
  'favorites': [],
  'demka': [
    {
      id: 'msg-1',
      senderId: 'demka',
      content: 'Привет! Добро пожаловать в ICQ New!',
      timestamp: '10:30 AM',
      type: 'text',
      status: 'read'
    },
    {
      id: 'msg-2',
      senderId: 'user-1',
      content: 'Привет! Выглядит отлично!',
      timestamp: '10:45 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'simpson-bot': [
    {
      id: 'msg-bot-1',
      senderId: 'simpson-bot',
      content: 'Доу! Привет! Я Гомер... то есть, Симпсон Бот! Напиши /hello чтобы начать или /commands чтобы увидеть, что я умею!',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'help-bot': [
    {
      id: 'msg-help-1',
      senderId: 'help-bot',
      content: 'Добро пожаловать в ICQ New! Я твой помощник. Напиши /commands чтобы увидеть все доступные команды.',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'debug-bot': [
    {
      id: 'msg-debug-1',
      senderId: 'debug-bot',
      content: '🛠️ Отладочный бот инициализирован!\n\nКоманды:\n/addchat [имя] - создать чат\n/dark - переключить тему\n/tell [текст] [1-5] - отправить несколько раз\n/unlim [число] - получить звёзды\n/create [название] [цена] [ссылка] - создать подарок\n\nИспользуй /commands для подробностей.',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'fun-channel': [
    {
      id: 'msg-channel-1',
      senderId: 'fun-channel',
      content: 'Добро пожаловать в Fun Channel! 🎉 7 млн подписчиков с нами!',
      timestamp: '1 час назад',
      type: 'text',
      status: 'read'
    }
  ],
  'stars-bot': [
    {
      id: 'msg-stars-1',
      senderId: 'stars-bot',
      content: '⭐ Привет! Я Stars Bot - твой помощник по управлению звёздами!\n\nИспользуй команды:\n/daily - Получить 500 звёзд (раз в 24 часа)\n/balance - Проверить баланс\n\nНачни с команды /daily чтобы получить свои первые звёзды! ✨',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'gift-bot': [
    {
      id: 'msg-gift-1',
      senderId: 'gift-bot',
      content: '🎁 Привет! Я Gift Bot - помощник по подаркам и звёздам!\n\nСтатус: Дарит настроение ✨\n\nКоманды:\n/create [имя] [цена] [ссылка] - создать свой подарок\n/send [название] [1-20] - отправить подарок себе\n\nПример:\n/create Роза 25 https://example.com/rose.png\n/send Lolipop 5\n\nМин. цена: 10★, макс. цена: 5000★',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'config-bot': [
    {
      id: 'msg-config-1',
      senderId: 'config-bot',
      content: '⚙️ Config Bot активирован!\n\nЯ помогу вам клонировать функционал между ботами!\n\nКоманды:\n/config load [шаблон] - загрузить конфиг\n/config save [название] - сохранить конфиг\n/manual - полное руководство\n\nДоступные шаблоны:\n- GiftBotConfig\n- SimpsonBotConfig\n- DebugBotConfig\n- PeterBotConfig\n- HelperBotConfig',
      timestamp: '9:00 AM',
      type: 'text',
      status: 'read'
    }
  ],
  'peter-bot': [
    {
      id: 'msg-peter-1',
      senderId: 'peter-bot',
      content: 'Хе-хе-хе! Привет! Я Питер Гриффин! 🍔\n\nГотов повеселиться? Вот мои команды:\n/peter - приветствие\n/bird - птица!\n/burger - мммм бургеры\n/beer - пиво!\n/family - моя семейка\n/joke - шутка от Питера\n/dance - танцы!\n/chicken - цыпленок!\n\nИспользуй /commands для полного списка!',
      timestamp: '9:00 AM',
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
    '/hello': 'Доу! Привет! Я Гомер... то есть, Симпсон Бот! Ммм... пончики... 🍩',
    '/burger': 'Бургеры вкусные :) 🍔 Ммм... бургеры...',
    '/gus': 'Кря кря кря, гусь 🦆',
    '/ps': '🎮 Секретное пасхальное яйцо обнаружено! Ты нашёл отсылку к PlayStation! Доу!',
    '/sosiska': 'Сосиска! 🌭 Гомер тоже любит сосиски!',
    '/commands': 'Доступные команды:\n/hello - Приветствие\n/burger - Бургеры вкусные\n/gus - Звук гуся\n/ps - Секретное пасхальное яйцо\n/sosiska - Сосиска'
  },
  'help-bot': {
    '/commands': 'Доступные команды:\n/commands - Список всех команд\n/project - Информация о проекте\n/connect - Контакты для связи\n/update - Информация об обновлениях\n/addusername [имя] - Добавить имя пользователя в профиль\n/clear - Очистить историю чата',
    '/project': 'ICQ New Мессенджер - Современное приложение для общения с расширенным функционалом ботов и красивым интерфейсом. Создано для комфортного общения и тестирования.',
    '/connect': 'Свяжитесь с нами:\n📧 Email: support@icqnew.local\n🌐 Сайт: icqnew.local\n💬 Сообщество: @icqnew',
    '/update': 'Последние обновления:\n✨ Новые команды ботов\n🎨 Улучшенный UI/UX\n💾 Поддержка локального хранилища\n🌙 Тёмная/Светлая темы\n⚡️ Быстрая производительность',
    '/addusername': 'Использование: /addusername [имя]\nПример: /addusername новоеимя'
  },
  'debug-bot': {
    '/addchat': 'Использование: /addchat [имя]\nПример: /addchat НовыйДруг\nПримечание: Максимум 10 чатов',
    '/dark': 'Тема переключена! ✨',
    '/tell': 'Использование: /tell [сообщение] [1-5]\nПример: /tell Привет 3\nЭто отправит "Привет" 3 раза',
    '/unlim': 'Использование: /unlim [количество]\nПример: /unlim 1000\nМгновенно получить указанное количество звёзд',
    '/create': 'Использование: /create [название] [цена] [ссылка]\nПример: /create Ракета 300 https://example.com/rocket.png\nМин. цена: 10★, макс. цена: 5000★',
    '/addverif': 'Использование: /addverif [текст]\nПример: /addverif Официальный представитель\n/addverif (пусто) - убрать верификацию',
    '/addusernamebot': 'Использование: /addusernamebot [юзернейм]\nПример: /addusernamebot @helper\nДобавляет дополнительный юзернейм боту',
    '/keyword': 'Использование: /keyword [слово] [ответ]\nПример: /keyword привет Привет! 😊\nБот будет отвечать автоматически',
    '/commands': 'Доступные команды:\n/addchat [имя] - Создать чат\n/dark - Переключить тему\n/tell [текст] [1-5] - Отправить несколько раз\n/unlim [число] - Получить звёзды\n/create [название] [цена] [ссылка] - Создать подарок\n/addverif [текст] - Добавить верификацию\n/addusernamebot [юзернейм] - Добавить юзернейм боту\n/keyword [слово] [ответ] - Добавить авто-ответ'
  },
  'stars-bot': {
    '/balance': 'balance_check',
    '/daily': 'daily_reward',
    '/commands': 'Доступные команды:\n/daily - Получить 500 звёзд (раз в 24 часа)\n/balance - Проверить текущий баланс'
  },
  'gift-bot': {
    '/create': 'create_gift',
    '/send': 'send_gift',
    '/commands': 'Доступные команды:\n/create [имя] [цена] [ссылка] - создать свой подарок\n/send [название] [1-20] - отправить подарок себе\n\nПример:\n/create Роза 25 https://example.com/rose.png\n/send Lolipop 5\n\nМин. цена: 10★, макс. цена: 5000★'
  },
  'config-bot': {
    '/config': 'config_action',
    '/manual': 'Полное руководство Config Bot:\n\n/config load [шаблон] - загрузить конфиг\n/config save [название] - сохранить конфиг\n\nДоступные шаблоны:\n- GiftBotConfig\n- SimpsonBotConfig\n- DebugBotConfig\n- PeterBotConfig\n- HelperBotConfig',
    '/commands': 'Доступные команды:\n/config load [шаблон] - загрузить конфиг бота\n/config save [название] - сохранить текущий конфиг\n/manual - показать полное руководство'
  },
  'peter-bot': {
    '/peter': 'Хе-хе-хе! Привет, я Питер! 🍔',
    '/bird': 'Птица, птица! Бе-бе-бе! 🐦🐔',
    '/burger': 'Ммм... бургеры! Кто сказал "бургер"? 🍔',
    '/beer': 'Пиво Duff - лучшее пиво в Куахоге! 🍺',
    '/family': 'Моя семья: Лоис, Крис, Мег и Стьюи! 👨‍👩‍👧‍👦',
    '/joke': 'Знаешь, почему я смешной? Потому что я Питер Гриффин! Хе-хе-хе! 😄',
    '/dance': 'Смотри как я танцую! 💃 *делает нелепые движения*',
    '/fight': 'Чик-чирик, птица! 👊 *дерется с гигантским цыпленком*',
    '/chicken': 'Бе-бе-бе! Цыпленок! 🐔 *начинается эпичная битва*',
    '/quagmire': 'Гигиги! 👌 Привет, соседи!',
    '/stewie': 'Проклятье вас, противный человек! 👶',
    '/lois': 'Лоис, дорогая! Где мое пиво? ❤️',
    '/commands': 'Мои команды:\n/peter /bird /burger /beer\n/family /joke /dance /fight\n/chicken /quagmire /stewie /lois'
  }
};

// Common commands for all chats
export const commonCommands = {
  '/clear': 'Чат очищен! 🧹'
};

// Предустановленные конфиги ботов
export const botConfigs = {
  'GiftBotConfig': {
    name: 'Gift Bot Config',
    commands: {
      '/create': 'create_gift',
      '/send': 'send_gift',
      '/commands': 'Доступные команды Gift Bot'
    },
    description: 'Функции создания и отправки подарков'
  },
  'SimpsonBotConfig': {
    name: 'Simpson Bot Config',
    commands: {
      '/hello': 'D\'oh! Привет!',
      '/burger': 'Ммм... бургеры! 🍔',
      '/doh': 'D\'oh! 😵',
      '/beer': 'Пиво Duff! 🍺',
      '/donut': 'Ммм... пончики! 🍩'
    },
    description: '12 команд в стиле Гомера Симпсона'
  },
  'DebugBotConfig': {
    name: 'Debug Bot Config',
    commands: {
      '/addchat': 'Создать чат',
      '/dark': 'Переключить тему',
      '/unlim': 'Получить звёзды',
      '/addverif': 'Добавить верификацию'
    },
    description: 'Инструменты отладки и разработки'
  },
  'PeterBotConfig': {
    name: 'Peter Bot Config',  
    commands: {
      '/peter': 'Хе-хе-хе! 😄',
      '/bird': 'Птица! 🐦',
      '/burger': 'Бургеры! 🍔',
      '/beer': 'Пиво! 🍺',
      '/family': 'Моя семья! 👨‍👩‍👧‍👦'
    },
    description: 'Юмор Питера Гриффина'
  },
  'ConfigBotConfig': {
    name: 'Config Bot Config',
    commands: {
      '/config': 'Управление конфигами',
      '/manual': 'Руководство',
      '/commands': 'Список команд'
    },
    description: 'Система управления конфигами'
  },
  'HelperBotConfig': {
    name: 'Helper Bot Config',
    commands: {
      '/help': 'Помощь',
      '/profile': 'Профиль',
      '/stars': 'Звёзды',
      '/commands': 'Команды'
    },
    description: 'Базовые команды помощника'
  }
};