import React from "react";
import { useSearchParams } from "react-router-dom";

const Header: React.FC = () => {
  const [searchParams] = useSearchParams(); // Получаем query-параметры
  const uid = searchParams.get('uid'); // Извлекаем значение параметра "uid"
  
  return (
    <header className="w-screen bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Логотип */}
        <div className="text-2xl font-bold">
          <a href="/" className="hover:text-blue-300">
            Docassistant
          </a>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-6">
          <a
            href={`/ai/lab?uid=${uid}`}
            className="text-lg hover:text-blue-300 transition duration-300"
          >
            Лаб
          </a>
          <a
            href={`/ai/rad?uid=${uid}`}
            className="text-lg hover:text-blue-300 transition duration-300"
          >
            Рад
          </a>
          <a
            href={`/ai/far?uid=${uid}`}
            className="text-lg hover:text-blue-300 transition duration-300"
          >
            Драг
          </a>
          <a
            href={`/ai/car?uid=${uid}`}
            className="text-lg hover:text-blue-300 transition duration-300"
          >
            Экг
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
