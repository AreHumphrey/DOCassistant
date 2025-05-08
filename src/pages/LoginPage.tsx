import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import redCrossIcon from '@/images/logo.svg';
import bgVideo from '@/images/bg_video.mp4';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      const { access_token } = response.data;

      // Сохраняем токен
      localStorage.setItem('token', access_token);
      localStorage.setItem('token_type', 'Bearer');

      // Пытаемся получить профиль
      try {
        const profileResponse = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const uid = profileResponse.data?.id;
        if (uid) {
          localStorage.setItem('uid', uid.toString());
        }
      } catch (profileErr) {
        console.warn('Не удалось получить профиль:', profileErr);
      }

      login(access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden px-4">

      {/* Фоновое видео */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      >
        <source src={bgVideo} type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      {/* Логотип */}
      <div className="absolute top-0 left-0 transform -translate-y-[220px] z-10">
        <img
          src={redCrossIcon}
          alt="DocAssistant"
          className="w-[550px] h-[550px]"
        />
      </div>

      {/* Форма входа */}
      <div className="relative z-10 bg-[#1560B7] bg-opacity-80 p-20 rounded-3xl shadow-lg w-full max-w-xl pb-10">
        <form onSubmit={handleSubmit} className="space-y-10 -translate-y-[10%]">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-xl font-medium text-white">
              Почта:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 px-3 border ring-2 ring-[#0A57FF] rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:justify-between text-xl mb-4 gap-4">
            <label className="inline-flex items-center cursor-pointer text-white text-xl font-medium">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 bg-[#FFFAFA] border-2 border-white rounded-sm peer-checked:bg-[#FFFAFA] flex items-center justify-center">
                  {rememberMe && (
                    <span className="text-red-600 text-2xl leading-none -translate-y-[1px] select-none">✚</span>
                  )}
                </div>
              </div>
              <span className="ml-2 text-xl">Сохранить</span>
            </label>

            <a
              href="/reset-password"
              className="text-white text-xl font-medium hover:text-white hover:underline"
            >
              Забыли пароль?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-xl">{error}</p>}

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