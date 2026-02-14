# CL Messenger - Product Requirements Document

## Original Problem Statement
Клон мессенджера "ICQ New" с полной системой чатов, ботов, подарков и валюты звёзд. Позже переименован в "CL Messenger".

## Current State
**Frontend-only React приложение** с данными в localStorage. Нет backend/database.

## Core Features (Implemented)

### 1. Admin/User Role System ✅ (Dec 2025)
- Вкладка "Консоль" в настройках
- Команда `/login hhsqs000091demyan_icqToCLxd` для входа как админ
- Команда `/logout` для выхода
- Команда `/status` для проверки статуса
- Команда `/logs` для просмотра логов регистрации (админ)
- Скрытие админских ботов (Debug Bot, Gift Bot, Config Bot) для обычных пользователей
- Лимиты создания ботов/каналов (5 макс) для обычных пользователей
- Ограничение аватара (только галерея) для обычных пользователей
- Команда `/sub` только для админов

### 2. Chat System ✅
- Личные чаты, каналы, боты
- Сообщения с временными метками
- Система стикеров
- Настраиваемые фоны чата

### 3. Bot System ✅
- Simpson Bot, Peter Bot - развлекательные
- Helper Bot - справочная информация
- Stars Bot - управление звёздами
- Debug Bot - отладка (админ)
- Gift Bot - подарки (админ)
- Config Bot - конфигурации (админ)

### 4. Gift & Currency System ✅
- Валюта "звёзды" (★)
- Ежедневные награды (+500★)
- 9 видов подарков (15-5000★)
- Создание кастомных подарков
- NFT градиенты

### 5. Registration & Profile ✅
- Полноэкранная регистрация
- Редактирование профиля
- Множественные юзернеймы
- Верификация телефона

### 6. Settings & Customization ✅
- Темы (ICQ New / Telegram)
- Переключатели функций
- Система конфигов ботов

## Technical Stack
- **Frontend**: React 18, Tailwind CSS, shadcn/ui
- **State**: React Hooks + localStorage
- **No Backend**: Все данные в localStorage

## Key Files
- `/app/frontend/src/pages/ChatApp.jsx` - главный компонент
- `/app/frontend/src/components/SettingsModal.jsx` - настройки + консоль
- `/app/frontend/src/mockData.js` - моки данных
- `/app/frontend/src/utils/localStorage.js` - работа с localStorage

## Admin Credentials
- **Login Command**: `/login hhsqs000091demyan_icqToCLxd`
- **Admin Bots**: Debug Bot, Gift Bot, Config Bot

## P1 Backlog (Upcoming)
1. Поиск пользователей по username
2. Автоподписка на Fun Channel при регистрации

## P2 Backlog (Future)
1. NFT система для подарков (уникальные серийные номера, градиенты)
2. Система /keyword для автоответов ботов

## P3 Backlog
1. Миграция на backend (FastAPI + MongoDB)
2. Реальная мультипользовательская система

## Testing
- Test Report: `/app/test_reports/iteration_1.json`
- Success Rate: 100% frontend

## User Language
Russian (Русский)
