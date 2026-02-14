import React, { useState } from 'react';
import { X, Star, Gift, Settings as SettingsIcon, Info, User, Terminal, Shield, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { toast } from '../hooks/use-toast';

const SettingsModal = ({ isOpen, onClose, appSettings, onSaveSettings, user, onOpenProfile, onOpenStars, isAdmin, onAdminLogin, onAdminLogout, registrationLogs, onlineUsers, onDeleteGift, customGifts }) => {
  const [settings, setSettings] = useState(appSettings);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState([
    { type: 'system', text: 'CL Console v1.0 - Добро пожаловать!' },
    { type: 'system', text: 'Введите /help для списка команд' }
  ]);

  const handleConsoleCommand = () => {
    if (!consoleInput.trim()) return;
    
    const cmd = consoleInput.trim();
    const newOutput = [...consoleOutput, { type: 'input', text: `> ${cmd}` }];
    
    if (cmd === '/help') {
      let helpText = 'Доступные команды:\n/login [код] - войти как администратор\n/logout - выйти из админ-режима\n/status - проверить статус\n/logs - просмотр логов (только для админов)\n/clear - очистить консоль';
      if (isAdmin) {
        helpText += '\n\n📌 Админ-команды:\n/online - список онлайн пользователей\n/delgift [название] - удалить подарок';
      }
      newOutput.push({ type: 'output', text: helpText });
    } else if (cmd.startsWith('/login ')) {
      const code = cmd.split(' ')[1];
      if (code === 'hhsqs000091demyan_icqToCLxd') {
        onAdminLogin();
        newOutput.push({ type: 'success', text: '✅ Успешный вход! Вы теперь администратор.' });
        newOutput.push({ type: 'system', text: 'Доступны административные функции и боты.' });
      } else {
        newOutput.push({ type: 'error', text: '❌ Неверный код доступа!' });
      }
    } else if (cmd === '/logout') {
      if (isAdmin) {
        onAdminLogout();
        newOutput.push({ type: 'success', text: '✅ Вы вышли из режима администратора.' });
      } else {
        newOutput.push({ type: 'error', text: '❌ Вы не авторизованы как администратор.' });
      }
    } else if (cmd === '/status') {
      newOutput.push({ type: 'output', text: `Статус: ${isAdmin ? '🔓 Администратор' : '🔒 Обычный пользователь'}\nПользователь: ${user.name}\nЗвёзды: ${user.stars || 0}★` });
    } else if (cmd === '/logs') {
      if (isAdmin) {
        if (registrationLogs && registrationLogs.length > 0) {
          const logsText = registrationLogs.slice(-10).map(log => 
            `[${log.date}] ${log.username} - ${log.name}`
          ).join('\n');
          newOutput.push({ type: 'output', text: `📋 Последние регистрации:\n${logsText}` });
        } else {
          newOutput.push({ type: 'output', text: '📋 Логи регистраций пусты.' });
        }
      } else {
        newOutput.push({ type: 'error', text: '❌ Доступ запрещён. Требуются права администратора.' });
      }
    } else if (cmd === '/online') {
      if (isAdmin) {
        if (onlineUsers && onlineUsers.length > 0) {
          const onlineText = onlineUsers.map(u => `🟢 ${u.name} (@${u.username})`).join('\n');
          newOutput.push({ type: 'output', text: `👥 Онлайн пользователи (${onlineUsers.length}):\n${onlineText}` });
        } else {
          newOutput.push({ type: 'output', text: '👥 Нет онлайн пользователей (кроме вас)' });
        }
      } else {
        newOutput.push({ type: 'error', text: '❌ Доступ запрещён. Требуются права администратора.' });
      }
    } else if (cmd.startsWith('/delgift ')) {
      if (isAdmin) {
        const giftName = cmd.slice(9).trim();
        if (giftName) {
          const deleted = onDeleteGift && onDeleteGift(giftName);
          if (deleted) {
            newOutput.push({ type: 'success', text: `✅ Подарок "${giftName}" удалён!` });
          } else {
            newOutput.push({ type: 'error', text: `❌ Подарок "${giftName}" не найден` });
          }
        } else {
          newOutput.push({ type: 'output', text: 'Использование: /delgift [название подарка]\nПример: /delgift Цветок' });
        }
      } else {
        newOutput.push({ type: 'error', text: '❌ Доступ запрещён. Требуются права администратора.' });
      }
    } else if (cmd === '/clear') {
      setConsoleOutput([{ type: 'system', text: 'Консоль очищена.' }]);
      setConsoleInput('');
      return;
    } else {
      newOutput.push({ type: 'error', text: `❌ Неизвестная команда: ${cmd}` });
    }
    
    setConsoleOutput(newOutput);
    setConsoleInput('');
  };

  const handleToggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleThemeChange = (value) => {
    setSettings({
      ...settings,
      designTheme: value
    });
  };

  const handleSave = () => {
    onSaveSettings(settings);
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения успешно применены'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-zinc-900 border-zinc-800 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Настройки</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-zinc-800">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="stars" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Звёзды
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Подарки
            </TabsTrigger>
            <TabsTrigger value="params" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Параметры
            </TabsTrigger>
            <TabsTrigger value="console" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Консоль
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              О CL
            </TabsTrigger>
          </TabsList>

          {/* Профиль */}
          <TabsContent value="profile" className="mt-4">
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">Мой профиль</h3>
                  <p className="text-sm text-zinc-400">Управление личными данными</p>
                </div>
                <Button onClick={onOpenProfile} className="bg-[#2fa34e] hover:bg-[#258a3c]">
                  Открыть профиль
                </Button>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Текущая информация</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-zinc-400">Имя:</span> {user.name}</p>
                  <p><span className="text-zinc-400">Username:</span> @{user.usernames?.[0] || 'не установлен'}</p>
                  <p><span className="text-zinc-400">Статус:</span> {user.status}</p>
                  {user.verification && (
                    <p><span className="text-zinc-400">Верификация:</span> ✅ {user.verification}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Звёзды */}
          <TabsContent value="stars" className="mt-4">
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">Управление звёздами</h3>
                  <p className="text-sm text-zinc-400">Ваш текущий баланс и операции</p>
                </div>
                <Button onClick={onOpenStars} className="bg-yellow-600 hover:bg-yellow-700">
                  Открыть Stars
                </Button>
              </div>

              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-4xl font-bold text-yellow-500 mb-2">
                  <Star className="w-10 h-10 fill-yellow-500" />
                  {user.stars || 0}
                </div>
                <p className="text-zinc-400">Текущий баланс звёзд</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Как получить звёзды?</h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li>💫 Ежедневная награда через Stars Bot - 500★</li>
                  <li>🎮 Выполнение заданий и достижений</li>
                  <li>🎁 Участие в событиях</li>
                  <li>🛠️ Тестирование через Debug Bot - /unlim</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Подарки */}
          <TabsContent value="gifts" className="mt-4">
            <div className="space-y-4 p-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Моя коллекция подарков</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-zinc-900 rounded-lg">
                    <Gift className="w-8 h-8 text-[#2fa34e] mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user.receivedGifts?.length || 0}</p>
                    <p className="text-xs text-zinc-400">Получено подарков</p>
                  </div>
                  <div className="text-center p-4 bg-zinc-900 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{user.stars || 0}</p>
                    <p className="text-xs text-zinc-400">Звёзд доступно</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Доступные подарки</h4>
                <p className="text-sm text-zinc-300 mb-3">
                  В магазине доступно 9 уникальных подарков с различной редкостью
                </p>
                <ul className="space-y-1 text-sm text-zinc-400">
                  <li>🍬 Базовые: 15-100★</li>
                  <li>🧸 Редкие: 200-555★</li>
                  <li>💎 Премиум: 1,700-2,000★</li>
                  <li>✨ Легендарные: 5,000★</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Параметры */}
          <TabsContent value="params" className="mt-4">
            <div className="space-y-6 p-4">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Параметры интерфейса
                </h3>

                <div className="space-y-4">
                  {/* Показывать "Изменить подписчиков" */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="subscriber-edit" className="text-sm font-medium cursor-pointer">
                        Показывать "Изменить подписчиков в каналах"
                      </Label>
                      <p className="text-xs text-zinc-400 mt-1">
                        Отображает кнопку редактирования количества подписчиков
                      </p>
                    </div>
                    <Switch
                      id="subscriber-edit"
                      checked={settings.showSubscriberEdit}
                      onCheckedChange={() => handleToggle('showSubscriberEdit')}
                      className="data-[state=checked]:bg-[#2fa34e]"
                    />
                  </div>

                  {/* Показывать "Создать контакт" */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="create-contact" className="text-sm font-medium cursor-pointer">
                        Показывать "Создать контакт"
                      </Label>
                      <p className="text-xs text-zinc-400 mt-1">
                        Отображает кнопку создания новых контактов
                      </p>
                    </div>
                    <Switch
                      id="create-contact"
                      checked={settings.showCreateContact}
                      onCheckedChange={() => handleToggle('showCreateContact')}
                      className="data-[state=checked]:bg-[#2fa34e]"
                    />
                  </div>

                  {/* Использовать /config */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor="use-config" className="text-sm font-medium cursor-pointer">
                        Использовать /config
                      </Label>
                      <p className="text-xs text-zinc-400 mt-1">
                        Активирует систему конфигов для всех ботов
                      </p>
                    </div>
                    <Switch
                      id="use-config"
                      checked={settings.useConfigSystem}
                      onCheckedChange={() => handleToggle('useConfigSystem')}
                      className="data-[state=checked]:bg-[#2fa34e]"
                    />
                  </div>
                </div>
              </div>

              {/* Дизайн интерфейса */}
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">🎨 Дизайн интерфейса</h3>
                
                <RadioGroup value={settings.designTheme} onValueChange={handleThemeChange}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800">
                      <RadioGroupItem value="icq" id="theme-icq" className="border-[#2fa34e]" />
                      <Label htmlFor="theme-icq" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">ICQ New (бирюзовый)</span>
                          <span className="text-2xl">🟢</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Бирюзовая тема с закруглениями 8px
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800">
                      <RadioGroupItem value="telegram" id="theme-telegram" className="border-blue-500" />
                      <Label htmlFor="theme-telegram" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Telegram (синий)</span>
                          <span className="text-2xl">🔵</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                          Синяя тема с круглыми сообщениями (20px)
                        </p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Кнопка сохранения */}
              <Button 
                onClick={handleSave} 
                className="w-full bg-[#2fa34e] hover:bg-[#258a3c] text-white font-semibold py-3"
              >
                Сохранить настройки
              </Button>
            </div>
          </TabsContent>

          {/* Консоль */}
          <TabsContent value="console" className="mt-4">
            <div className="space-y-4 p-4">
              {/* Статус администратора */}
              <div className={`flex items-center justify-between p-4 rounded-lg ${isAdmin ? 'bg-green-900/30 border border-green-700' : 'bg-zinc-800'}`}>
                <div className="flex items-center gap-3">
                  {isAdmin ? (
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                  ) : (
                    <Shield className="w-8 h-8 text-zinc-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {isAdmin ? 'Режим администратора' : 'Обычный пользователь'}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {isAdmin ? 'Все функции доступны' : 'Ограниченный доступ'}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <Button 
                    onClick={onAdminLogout} 
                    variant="outline" 
                    className="border-red-700 text-red-400 hover:bg-red-900/30"
                  >
                    Выйти
                  </Button>
                )}
              </div>

              {/* Консоль */}
              <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
                <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-mono text-zinc-400">CL Console</span>
                </div>
                <ScrollArea className="h-64 p-4 font-mono text-sm">
                  {consoleOutput.map((line, idx) => (
                    <div key={idx} className={`mb-1 ${
                      line.type === 'input' ? 'text-blue-400' :
                      line.type === 'output' ? 'text-zinc-300 whitespace-pre-wrap' :
                      line.type === 'success' ? 'text-green-400' :
                      line.type === 'error' ? 'text-red-400' :
                      'text-zinc-500'
                    }`}>
                      {line.text}
                    </div>
                  ))}
                </ScrollArea>
                <div className="border-t border-zinc-800 p-2 flex gap-2">
                  <span className="text-green-500 font-mono">{'>'}</span>
                  <Input
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleConsoleCommand()}
                    placeholder="Введите команду..."
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 font-mono text-sm h-8 p-0"
                  />
                  <Button 
                    onClick={handleConsoleCommand}
                    size="sm"
                    className="bg-green-700 hover:bg-green-600 h-8"
                  >
                    Enter
                  </Button>
                </div>
              </div>

              {/* Подсказки */}
              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm">Доступные команды:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
                  <div>/help - справка</div>
                  <div>/status - статус</div>
                  <div>/login [код] - вход</div>
                  <div>/logout - выход</div>
                  <div>/logs - логи (админ)</div>
                  <div>/clear - очистить</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* О программе */}
          <TabsContent value="about" className="mt-4">
            <div className="space-y-4 p-4">
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-[#2fa34e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <img 
                    src="https://i.ibb.co/7tWc7T90/logo-round-corners.png" 
                    alt="CL Logo" 
                    className="w-16 h-16 rounded-xl"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">CL Messenger</h2>
                <p className="text-zinc-400 mb-4">Версия 3.0 - "Открытие серверов"</p>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Возможности</h4>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li>✅ Система подарков и NFT</li>
                  <li>✅ Умные боты с конфигами</li>
                  <li>✅ Ключевые слова и авто-ответы</li>
                  <li>✅ Коллекционные предметы</li>
                  <li>✅ Система звёзд и валюты</li>
                  <li>✅ Персонализация профиля</li>
                </ul>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4 text-center">
                <p className="text-sm text-zinc-400">
                  © 2025 CL Messenger<br/>
                  Все права защищены
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
