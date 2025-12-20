import React, { useState } from 'react';
import { X, Star, Gift, Settings as SettingsIcon, Info, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from '../hooks/use-toast';

const SettingsModal = ({ isOpen, onClose, appSettings, onSaveSettings, user, onOpenProfile, onOpenStars }) => {
  const [settings, setSettings] = useState(appSettings);

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
          <TabsList className="grid w-full grid-cols-5 bg-zinc-800">
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
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              О программе
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
                  </RadioGroup>
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

          {/* О программе */}
          <TabsContent value="about" className="mt-4">
            <div className="space-y-4 p-4">
              <div className="bg-zinc-800 rounded-lg p-6 text-center">
                <div className="w-20 h-20 bg-[#2fa34e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">ICQ New Messenger</h2>
                <p className="text-zinc-400 mb-4">Версия 2.0 - "Персональные боты и коллекции"</p>
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
                  © 2025 ICQ New Messenger<br/>
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
