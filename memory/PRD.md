# CL Messenger - Product Requirements Document

## Original Problem Statement
Клон мессенджера "ICQ New" с полной системой чатов, ботов, подарков и валюты звёзд. Позже переименован в "CL Messenger".

## Current State - Version 3.1
**Frontend-only React приложение** с данными в localStorage. Нет backend/database.

## Core Features (Implemented)

### 1. Admin/User Role System ✅ (Dec 2025)
- Вкладка "Консоль" в настройках
- Команда `/login hhsqs000091demyan_icqToCLxd` для входа как админ
- Команда `/logout` для выхода
- Команда `/status` для проверки статуса
- Команда `/logs` для просмотра логов регистрации (админ)
- Команда `/online` для просмотра онлайн пользователей (админ) ✅ NEW
- Команда `/delgift [название]` для удаления подарков (админ) ✅ NEW
- Скрытие админских ботов (Debug Bot, Gift Bot, Config Bot, Stars Bot) для обычных пользователей
- Лимиты создания ботов/каналов (5 макс) для обычных пользователей
- Ограничение аватара (только галерея) для обычных пользователей
- Команда `/sub` только для админов
- **Изменение подписчиков** - только для админов ✅ v3.1
- **Fun Channel** - обычные пользователи не могут писать ✅ v3.1

### 2. User Search & Groups ✅ v3.1 NEW
- **Поиск пользователей** по юзернеймам
- **Список зарегистрированных пользователей** отображается в поиске
- **Создание групп** с:
  - Название группы
  - Юзернейм группы
  - Выбор аватара из галереи
  - Поиск и добавление участников по юзернейму

### 3. Chat System ✅
- Личные чаты, каналы, боты, группы
- Сообщения с временными метками
- Система стикеров
- Настраиваемые фоны чата

### 4. Bot System ✅
- Simpson Bot, Peter Bot - развлекательные
- Helper Bot - справочная информация
- Stars Bot - управление звёздами (АДМИН)
- Debug Bot - отладка (АДМИН)
- Gift Bot - подарки (АДМИН)
- Config Bot - конфигурации (АДМИН)

### 5. Gift & Currency System ✅
- Валюта "звёзды" (★)
- Ежедневные награды (+500★)
- 9 видов подарков (15-5000★)
- Создание кастомных подарков
- Удаление подарков через /delgift (админ) ✅ v3.1
- NFT градиенты

### 6. Registration & Profile ✅
- Полноэкранная регистрация
- Редактирование профиля
- Множественные юзернеймы
- Верификация телефона

### 7. Settings & Customization ✅
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
- **Admin Bots**: Debug Bot, Gift Bot, Config Bot, Stars Bot

## localStorage Keys
- `cl_user_registered` - статус регистрации
- `cl_admin_status` - статус админа
- `cl_registered_users` - зарегистрированные пользователи
- `cl_online_users` - онлайн пользователи
- `cl_registration_logs` - логи регистрации
- `icq_custom_gifts` - кастомные подарки

## P2 Backlog (Future)
1. NFT система для подарков (уникальные серийные номера, градиенты)
2. Система /keyword для автоответов ботов

## P3 Backlog
1. Миграция на backend (FastAPI + MongoDB)
2. Реальная мультипользовательская система

## Testing
- Test Report: `/app/test_reports/iteration_2.json`
- Success Rate: 100% frontend

## User Language
Russian (Русский)
