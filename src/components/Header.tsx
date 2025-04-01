import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import redCrossIcon from '@/images/logo.svg';
import HelpIcon from '@/images/del_app.svg';
import { useLocation } from 'react-router-dom';


interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  origin_name: string;
}

const Header: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [uid, setUid] = useState<string | undefined>(() => {
    return searchParams.get('uid') || localStorage.getItem('uid') || undefined;
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("Token отсутствует в localStorage");
        return;
      }

      const tokenType = 'Bearer';
      const authHeader = `${tokenType} ${token}`;
      console.log("Authorization Header:", authHeader);

      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: authHeader,
          },
        });

        setUserProfile(response.data);

        if (response.data?.id) {
          const newUid = response.data.id.toString();
          localStorage.setItem('uid', newUid);
          console.log('UID сохранён в localStorage:', newUid);
          setUid(newUid);
        }
      } catch (error: any) {
        console.error("Ошибка загрузки данных профиля", error);

        if (error.response?.status === 403 || error.response?.status === 401) {
          console.warn("Доступ запрещён. Перенаправление на страницу входа.");
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };

    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        fetchUserProfile();
      }
    }, 200);
  }, []);

  const linkWithUid = (path: string) => {
    return uid ? `${path}?uid=${uid}` : path;
  };

  const displayName = userProfile
    ? `${userProfile.last_name} ${userProfile.first_name?.[0] || ''}.${userProfile.middle_name?.[0] || ''}.`
    : 'Пользователь';

  return (
    <header className="w-screen bg-white h-auto sm:h-[100px] flex flex-col sm:flex-row items-center">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between py-4 px-6 w-full">
        <a href="/" className="flex items-center font-bold text-2xl sm:-ml-10 -mt-[60%] -mb-[60%] sm:mt-[-12px] sm:mb-0">
          <img 
            src={redCrossIcon} 
            alt="DocAssistant" 
            className="w-[600px] h-[600px] sm:w-[400px] sm:h-[400px] object-contain"
          />
        </a>

        <nav className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-24 text-[#000000] text-lg justify-center sm:-translate-x-[30px]">
        <a
          href={linkWithUid('/patients')}
          className="text-[#000000] hover:text-red-500 active:text-red-500 transition duration-300"
        >
          Карточки пациентов
        </a>

          <a
            href={linkWithUid('/ai/rad')}
            className="text-[#000000] hover:text-red-500 active:text-red-500 transition duration-300"
          >
            История запросов
          </a>
          <a
            href={linkWithUid('/ai/far')}
            className="text-[#000000] hover:text-red-500 active:text-red-500 transition duration-300"
          >
            Контакты
          </a>
        </nav>

        <div className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0 sm:-translate-x-[30px]">
          <a 
            href="/profile" 
            className="text-[#0A57FF] text-lg font-semibold hover:text-red-500"
          >
            {displayName}
          </a>

          <div
            className="cursor-pointer transition-all duration-200 translate-y-1.5 translate-x-2 active:brightness-90"
          >
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              <img
                src={HelpIcon}
                alt="Тех помощь"
                className="w-[150px] h-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
