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
    phone: ''
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

    if (!formData.phone) {
      toast({
        title: 'Ошибка',
        description: 'Введите номер телефона',
        variant: 'destructive'
      });
      return;
    }

    // Сохраняем данные пользователя
    const userData = {
      username: formData.username,
      phone: formData.phone,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('cl_user_registered', 'true');
    localStorage.setItem('cl_user_data', JSON.stringify(userData));

    toast({
      title: 'Добро пожаловать в CL!',
      description: 'Регистрация успешно завершена'
    });

    onComplete(userData);
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-2xl max-w-2xl w-full p-8 border border-zinc-800 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="https://i.ibb.co/7tWc7T90/logo-round-corners.png" 
              alt="CL Logo" 
              className="w-24 h-24 rounded-2xl"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2">Добро пожаловать в CL Messenger!</h1>
          <p className="text-zinc-400 text-center mb-8">Версия 3.0 - "Открытие серверов"</p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">✨ Что нового:</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>🌐 Система серверов и регистрации</li>
                <li>🤖 Умные боты с конфигурацией</li>
                <li>🎁 Коллекционные подарки и NFT</li>
                <li>⭐ Система звёзд и валюты</li>
                <li>🎨 Персонализация профиля</li>
                <li>💬 Расширенная система чатов</li>
              </ul>
            </div>

            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📜 Условия использования:</h3>
              <p className="text-sm text-zinc-300">
                Продолжая, вы соглашаетесь с условиями использования CL Messenger и политикой конфиденциальности. 
                Ваши данные будут сохранены локально на вашем устройстве.
              </p>
            </div>
          </div>

          {/* Accept Button */}
          <Button 
            onClick={handleAccept}
            className="w-full bg-[#2fa34e] hover:bg-[#258a3c] text-white text-lg py-6 font-semibold"
          >
            Принять и продолжить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full p-8 border border-zinc-800 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.ibb.co/7tWc7T90/logo-round-corners.png" 
            alt="CL Logo" 
            className="w-20 h-20 rounded-2xl"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Регистрация</h2>
        <p className="text-zinc-400 text-center mb-6">Создайте свой аккаунт в CL</p>

        {/* Registration Form */}
        <div className="space-y-4 mb-6">
          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-sm font-medium mb-2 block">
              Логин
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Введите логин"
              value={formData.username}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e]"
            />
            <p className="text-xs text-zinc-500 mt-1">Минимум 3 символа</p>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium mb-2 block">
              Пароль
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e]"
            />
            <p className="text-xs text-zinc-500 mt-1">Минимум 6 символов</p>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
              Номер телефона
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handleInputChange}
              className="bg-zinc-800 border-zinc-700 focus:border-[#2fa34e]"
            />
            <p className="text-xs text-zinc-500 mt-1">Для восстановления доступа</p>
          </div>
        </div>

        {/* Register Button */}
        <Button 
          onClick={handleRegister}
          className="w-full bg-[#2fa34e] hover:bg-[#258a3c] text-white text-lg py-6 font-semibold mb-3"
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
