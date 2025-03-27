import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import bgImage from '@/images/bg.png';
import { useNavigate } from 'react-router-dom';
import redCrossIcon from '@/images/logo.svg';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });
  
      const { access_token, token_type } = response.data;
  
      if (rememberMe) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('token_type', token_type);
      } else {
        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('token_type', token_type);
      }
  
      login(access_token);
      alert('Успешный вход!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`
      }}
    >
      {/* Логотип */}  

      <div className="absolute top-0 left-0 transform -translate-y-[220px]">
  <img 
    src={redCrossIcon} 
    alt="DocAssistant" 
    className="w-[550px] h-[550px]"
  />
</div>


      {/* Форма входа */}
      <div className="bg-[#61A4FA] bg-opacity-80 p-20  rounded-3xl shadow-lg w-full max-w-xl pb-10" >

        <form onSubmit={handleSubmit} className="space-y-10 -translate-y-[10%]">
          {/* Поле Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-xl font-medium text-white">
              Eмейл:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-3 border ring-2 ring-[#0A57FF] rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"

              placeholder=" "
              required
            />
          </div>

          {/* Поле Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-xl font-medium text-white">
              Пароль:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-3 border ring-2 ring-[#0A57FF] rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:justify-between text-xl mb-4 gap-4">
            {/* Чекбокс */}
            <label className="inline-flex items-center cursor-pointer text-white text-xl font-medium">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 bg-white border-2 border-white rounded-sm peer-checked:bg-white peer-checked:border-white flex items-center justify-center">
                  {rememberMe && (
                    <span className="text-red-600 text-2xl leading-none -translate-y-[1px] select-none">✚</span>
                  )}
                </div>
              </div>
              <span className="ml-2 text-xl">Сохранить</span>
            </label>

            {/* Ссылка */}
            <a
              href="/reset-password"
              className="text-white text-xl font-medium hover:text-white active:text-white focus:outline-none hover:underline text-center w-full sm:w-auto"
            >
              Забыли пароль?
            </a>
          </div>


          {/* Ошибка */}
          {error && <p className="text-red-500 text-sm mb-4 text-xl">{error}</p>}

          {/* Кнопка */}
          <button
            type="submit"
            className="w-full bg-black py-3 px-3 text-white border ring-2 ring-[#0A57FF] rounded-full hover:bg-gray-800 transition transform translate-y-[40%]"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'ВОЙТИ'}
          </button>

        </form>
      </div>
    </div>
  );
}
