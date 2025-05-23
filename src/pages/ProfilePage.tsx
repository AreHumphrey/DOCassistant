import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserIcon from '@/images/profile.svg'; 
import Breadcrumbs from "@/components/Breadcrumbs";

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
        const tokenType = 'Bearer';
        

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

      <Breadcrumbs
              items={[
                { label: "Профиль" }
              ]}
      />

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
          <div className="bg-white border-[3px] border-[#367DFF] p-10 rounded-3xl w-full max-w-3xl text-black text-center">
          {loading && <p className="text-lg text-center">Загрузка данных...</p>}
  {error && <p className="text-red-500 text-lg text-center">{error}</p>}

  {userProfile && (
    <div className="text-left">
      <div className="py-3 border-b-[3px] border-[#367DFF]">
        <span className="block text-sm uppercase tracking-wide text-gray-500">Имя</span>
        <span className="block text-lg font-semibold">{userProfile.first_name}</span>
      </div>

      <div className="py-3 border-b-[3px] border-[#367DFF]">
        <span className="block text-sm uppercase tracking-wide text-gray-500">Фамилия</span>
        <span className="block text-lg font-semibold">{userProfile.last_name}</span>
      </div>

      <div className="py-3 border-b-[3px] border-[#367DFF]">
        <span className="block text-sm uppercase tracking-wide text-gray-500">Отчество</span>
        <span className="block text-lg font-semibold">{userProfile.middle_name}</span>
      </div>

      <div className="py-3 border-b-[3px] border-[#367DFF]">
        <span className="block text-sm uppercase tracking-wide text-gray-500">E-mail</span>
        <span className="block text-lg font-semibold">{userProfile.email}</span>
      </div>

      <div className="py-3">
        <span className="block text-sm uppercase tracking-wide text-gray-500">Клиника</span>
        <span className="block text-lg font-semibold">{userProfile.origin_name}</span>
      </div>
    </div>
  )}
</div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
