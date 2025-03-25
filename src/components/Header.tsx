import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import redCrossIcon from '@/images/logo.svg';
import HelpIcon from '@/images/del_app.svg';

interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  origin_name: string;
}

const Header: React.FC = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const tokenType = localStorage.getItem('token_type');
      
      if (!token || !tokenType) return;

      try {
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `${tokenType} ${token}`
          }
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error("Ошибка загрузки данных профиля", error);
      }
    };

    fetchUserProfile();
  }, []);

  const displayName = userProfile
    ? `${userProfile.last_name} ${userProfile.first_name[0]}.${userProfile.middle_name[0]}.`
    : 'Пользователь';

  return (
    <header className="w-screen bg-white h-auto sm:h-[100px] flex flex-col sm:flex-row items-center">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between py-4 px-6 w-full">

        {/* Логотип */}
        <div className="flex items-center font-bold text-2xl sm:-ml-10 -mt-[60%] -mb-[60%] sm:mt-[-12px] sm:mb-0">
          <img 
            src={redCrossIcon} 
            alt="DocAssistant" 
            className="w-[600px] h-[600px] sm:w-[400px] sm:h-[400px] object-contain"
          />
        </div>

        {/* Навигация */}
        <nav className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-24 text-[#000000] text-lg justify-center sm:-translate-x-[30px]">
          <a
            href={`/ai/lab?uid=${uid}`}
            className="text-[#000000] hover:text-red-500 active:text-red-500 transition duration-300"
          >
            Карточки пациентов
          </a>
          <a
            href={`/ai/rad?uid=${uid}`}
            className="text-[#000000] hover:text-red-500 active:text-red-500 transition duration-300"
          >
            История запросов
          </a>
          <a
            href={`/ai/far?uid=${uid}`}
            className="text-[#000000] hover:text-red-500 active:text-red-500 transition duration-300"
          >
            Контакты
          </a>
        </nav>

        {/* Блок с именем пользователя и техподдержкой */}
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
