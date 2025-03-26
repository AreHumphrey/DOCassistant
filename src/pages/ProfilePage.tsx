import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserIcon from '@/images/profile.svg'; 

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  origin_name: string;
}

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const tokenType = localStorage.getItem('token_type');

      if (!token || !tokenType) {
        setError('Ошибка авторизации. Войдите в систему.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        });

        setUserProfile(response.data);
      } catch (err) {
        console.error('Ошибка при получении данных профиля:', err);
        setError('Ошибка при загрузке данных профиля.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChangePassword = () => {
    alert('Переход на страницу смены пароля.');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b  overflow-x-hidden">
      <Header />

      {/* ПК ВЕРСИЯ - ГОРИЗОНТАЛЬНАЯ РАЗМЕТКА */}
      <div className="flex-grow flex flex-col sm:flex-row items-center justify-center px-4 mt-[5%] sm:mb-[10%]">

        {/* Левая сторона - Иконка и приветствие */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-0 sm:mr-12 w-full max-w-[400px]">

        {/* Иконка */}
        <div className="flex flex-col items-center">
        <img 
            src={UserIcon} 
            alt="Пользователь" 
            className="w-40 h-40 sm:w-80 sm:h-80 mb-4 transition-all duration-300"
        />

        {/* Приветствие по центру относительно иконки */}
        {userProfile && (
            <h1 className="text-4xl font-bold mt-4"> {/* Добавлен mt-4 вместо margin offset */}
            Привет, {userProfile.first_name}!
            </h1>
        )}
        </div>
        </div>


        {/* Правая сторона - Блок с информацией */}
        <div className="bg-[#61A4FA] bg-opacity-90 p-10 rounded-3xl shadow-lg w-full max-w-3xl text-white text-center border-t-4 border-white">

          {/* Состояния загрузки или ошибок */}
          {loading && <p className="text-lg text-center">Загрузка данных...</p>}
          {error && <p className="text-red-500 text-lg text-center">{error}</p>}

          {/* Данные профиля */}
          {userProfile && (
            <div className="space-y-6 text-left divide-y divide-white/50">
              <div className="py-3">
                <span className="block text-sm uppercase tracking-wide text-white/70">
                  Имя
                </span>
                <span className="block text-lg font-bold">{userProfile.first_name}</span>
              </div>

              <div className="py-3">
                <span className="block text-sm uppercase tracking-wide text-white/70">
                  Фамилия
                </span>
                <span className="block text-lg font-bold">{userProfile.last_name}</span>
              </div>

              <div className="py-3">
                <span className="block text-sm uppercase tracking-wide text-white/70">
                  Отчество
                </span>
                <span className="block text-lg font-bold">{userProfile.middle_name}</span>
              </div>

              <div className="py-3">
                <span className="block text-sm uppercase tracking-wide text-white/70">
                  E-mail
                </span>
                <span className="block text-lg font-bold">{userProfile.email}</span>
              </div>

              <div className="py-3">
                <span className="block text-sm uppercase tracking-wide text-white/70">
                  Клиника
                </span>
                <span className="block text-lg font-bold">{userProfile.origin_name}</span>
              </div>

              {/* Кнопка смены пароля */}
              <div className="flex justify-center pt-6 mt-12 mb-8">
                <button
                  onClick={handleChangePassword}
                  className="bg-[#61A4FA] text-white border-2 border-white py-3 px-6 rounded-full text-lg hover:border-white hover:bg-[#5290E8] transition"
                >
                  Сменить пароль
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
