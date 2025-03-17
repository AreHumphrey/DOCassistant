import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  // Состояния для email, password и ошибки
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth()
  const navigate = useNavigate()

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Сброс ошибки
    setLoading(true);

    try {
      // Отправка запроса с axios
      const response = await axios.post('/api/login', {
        email,
        password,
      });

      // Получаем токен из ответа
      const { access_token, token_type } = response.data;

      // Сохраняем токен в localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('token_type', token_type);
      login(access_token)
      alert('Успешный вход!');
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>

        <form onSubmit={handleSubmit}>
          {/* Поле Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Введите email"
              required
            />
          </div>

          {/* Поле Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Введите пароль"
              required
            />
          </div>

          {/* Ошибка */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Кнопка */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
