import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import redCrossIcon from '@/images/logo.svg';
import bgVideo from '@/images/bg_video.mp4';

export default function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/reset-password', {
        secret_token: token,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      navigate('/login');
    } catch (err: any) {
      const errors = err.response?.data?.detail || err.response?.data?.message;
      setError(Array.isArray(errors) ? errors.join(', ') : errors || 'Ошибка при смене пароля.');
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
        <img src={redCrossIcon} alt="DocAssistant" className="w-[550px] h-[550px]" />
      </div>

      {/* Форма смены пароля */}
      <div className="relative z-10 bg-[#61A4FA] bg-opacity-80 p-20 rounded-3xl shadow-lg w-full max-w-xl pb-10">
        <form onSubmit={handleSubmit} className="space-y-10 -translate-y-[10%]">
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-2 text-xl font-medium text-white">
              Новый пароль:
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-3 px-3 border ring-2 ring-[#0A57FF] rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-xl font-medium text-white">
              Подтвердите пароль:
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3 px-3 border ring-2 ring-[#0A57FF] rounded-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xl text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black py-3 px-3 text-white border ring-2 ring-[#0A57FF] rounded-full hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'СМЕНИТЬ ПАРОЛЬ'}
          </button>

          <div className="text-center mt-2">
            <a href="/login" className="text-white text-xl">
              Вернуться к входу
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
