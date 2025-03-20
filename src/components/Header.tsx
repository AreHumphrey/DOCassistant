import React from "react";
import { useSearchParams } from "react-router-dom";
import redCrossIcon from '@/images/logo.svg';
import HelpIcon from '@/images/del_app.svg';

const Header: React.FC = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');

  return (
    <header className="w-screen bg-white shadow-md h-auto sm:h-[100px] flex flex-col sm:flex-row items-center">
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
        <nav className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-24 text-[#000000] text-lg justify-center sm:translate-x-[-15%]">
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
        <div className="flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <a 
            href="#" 
            className="text-[#0A57FF] text-lg font-semibold sm:-ml-20 hover:text-red-500"
          >
            Иванов А.С.
          </a>

          <div
            className="cursor-pointer transition-all duration-200 active:brightness-90"
          >
            <a href="https://example.com" target="_blank" rel="noopener noreferrer">
              <img
                src={HelpIcon}
                alt="Тех помощь"
                className="w-[150px] h-auto"
              />
            </a>
          </div>
          <div className="mt-4 block sm:hidden">
          </div>


        </div>
      </div>
    </header>
  );
};

export default Header;
