import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '@/images/bg.png';
import redCrossIcon from '@/images/logo.svg';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/forget-password', { email });
      setMessage('Ссылка для сброса пароля отправлена на почту.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при отправке. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Логотип */}
      <div className="absolute top-0 left-0 transform -translate-y-[220px]">
        <img src={redCrossIcon} alt="DocAssistant" className="w-[550px] h-[550px]" />
      </div>

      {/* Форма восстановления */}
      <div className="bg-[#61A4FA] bg-opacity-80 p-20 rounded-3xl shadow-lg w-full max-w-xl pb-10">
        <form onSubmit={handleSubmit} className="space-y-10 -translate-y-[10%]">
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-xl font-medium text-white">
              Введите ваш e-mail:
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

          {message && <p className="text-green-300 text-xl text-center">{message}</p>}
          {error && <p className="text-red-500 text-xl text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black py-3 px-3 text-white border ring-2 ring-[#0A57FF] rounded-full hover:bg-gray-800 transition transform translate-y-[40%]"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'ВОССТАНОВИТЬ'}
          </button>

          <div className="text-center mt-2">
            <a href="/login" className="text-white text-xl hover:text-white active:text-white focus:outline-none hover:underline text-center w-full sm:w-auto">
              Вернуться к входу
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
