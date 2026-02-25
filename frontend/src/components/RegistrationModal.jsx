import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from '../hooks/use-toast';

const RegistrationModal = ({ onComplete }) => {
  const [step, setStep] = useState(1); // 1 - welcome, 2 - registration
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    displayName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAccept = () => {
    setStep(2);
  };

  const handleRegister = () => {
    // Валидация
    if (!formData.username || formData.username.length < 3) {
      toast({
        title: 'Ошибка',
        description: 'Логин должен содержать минимум 3 символа',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен содержать минимум 6 символов',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.phone || formData.phone.length < 5) {
      toast({
        title: 'Ошибка',
        description: 'Номер должен содержать минимум 5 символов',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.displayName || formData.displayName.length < 2) {
      toast({
        title: 'Ошибка',
        description: 'Имя пользователя должно содержать минимум 2 символа',
        variant: 'destructive'
      });
      return;
    }

    // Проверка уникальности номера
    const registeredUsers = JSON.parse(localStorage.getItem('cl_all_users') || '[]');
    const phoneExists = registeredUsers.some(u => u.phone === formData.phone);
    
    if (phoneExists) {
      toast({
        title: 'Ошибка',
        description: 'Этот номер уже используется другим пользователем',
        variant: 'destructive'
      });
      return;
    }

    // Сохраняем данные пользователя
    const userData = {
      id: `user-${Date.now()}`,
      username: formData.username,
      displayName: formData.displayName,
      phone: formData.phone,
      password: formData.password,
      registeredAt: new Date().toISOString(),
      isAdmin: false
    };

    // Добавляем в список всех пользователей
    registeredUsers.push(userData);
    localStorage.setItem('cl_all_users', JSON.stringify(registeredUsers));

    localStorage.setItem('cl_user_registered', 'true');
    localStorage.setItem('cl_current_user', JSON.stringify(userData));

    toast({
      title: 'Добро пожаловать в CL!',
      description: 'Регистрация успешно завершена'
    });

    onComplete(userData);
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center z-50 p-4">
        <div className="max-w-2xl w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://cdn.worldvectorlogo.com/logos/telegram-1.svg" 
              alt="CL Logo" 
              className="w-32 h-32 rounded-3xl shadow-2xl"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-3 text-white">Добро пожаловать в Nethgram!</h1>
          <p className="text-zinc-400 text-center text-lg mb-10">Версия 3.0 - "Открытие серверов"</p>

          {/* Features */}
          <div className="space-y-4 mb-10">
            <div className="bg-zinc-800/50 backdrop-blur rounded-xl p-6 border border-zinc-700">
              <h3 className="font-semibold text-lg mb-3">✨ Что нового:</h3>
              <ul className="space-y-2 text-zinc-300">
                <li>🌐 Система серверов и регистрации</li>
                <li>🤖 Умные боты с конфигурацией</li>
                <li>🎁 Коллекционные подарки и NFT</li>
                <li>⭐ Система звёзд и валюты</li>
                <li>🎨 Персонализация профиля</li>
                <li>💬 Расширенная система чатов</li>
              </ul>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur rounded-xl p-6 border border-zinc-700">
              <h3 className="font-semibold text-lg mb-3">📜 Условия использования:</h3>
              <p className="text-zinc-300">
                Продолжая, вы соглашаетесь с условиями использования Nethgram и политикой конфиденциальности. 
                Ваши данные будут сохранены локально на вашем устройстве.
              </p>
            </div>
          </div>

          {/* Accept Button */}
          <Button 
            onClick={handleAccept}
            className="w-full bg-[#2fa34e] hover:bg-[#258a3c] text-white text-xl py-8 font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Принять и продолжить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="https://cdn.worldvectorlogo.com/logos/telegram-1.svg" 
            alt="CL Logo" 
            className="w-24 h-24 rounded-2xl shadow-2xl"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Регистрация</h2>
        <p className="text-zinc-400 text-center mb-8">Создайте свой аккаунт в CL</p>

        {/* Registration Form */}
        <div className="space-y-5 mb-8">
          {/* Display Name */}
          <div>
            <Label htmlFor="displayName" className="text-sm font-medium mb-2 block text-zinc-300">
              Имя пользователя
            </Label>
            <Input
              id="displayName"
              name="displayName"
              type="text"
              placeholder="Как вас называть?"
              value={formData.displayName}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e] text-white"
            />
            <p className="text-xs text-zinc-500 mt-1">Минимум 2 символа</p>
          </div>

          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-sm font-medium mb-2 block text-zinc-300">
              Юзернейм
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="@ваш_юзернейм"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e] text-white"
            />
            <p className="text-xs text-zinc-500 mt-1">Минимум 3 символа</p>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium mb-2 block text-zinc-300">
              Пароль
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e] text-white"
            />
            <p className="text-xs text-zinc-500 mt-1">Минимум 6 символов</p>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium mb-2 block text-zinc-300">
              Номер телефона
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e] text-white"
            />
            <p className="text-xs text-zinc-500 mt-1">Минимум 5 символов</p>
          </div>
        </div>

        {/* Register Button */}
        <Button 
          onClick={handleRegister}
          className="w-full bg-[#2fa34e] hover:bg-[#258a3c] text-white text-xl py-8 font-bold shadow-xl hover:shadow-2xl transition-all mb-4"
        >
          Зарегистрироваться
        </Button>

        <p className="text-xs text-center text-zinc-500">
          Нажимая "Зарегистрироваться", вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
};

export default RegistrationModal;
