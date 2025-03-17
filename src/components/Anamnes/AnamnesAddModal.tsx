import axios from "axios";
import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from '@/stores/store';
import { addAnamnes } from "@/stores/anamnesSlice";

interface AnamnesAddModalProps {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AnamnesAddModal({
  isOpen,
  onClose,
}: AnamnesAddModalProps) {
  const [fio, setFio] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [scan_date, setScan_date] = useState<string>("");
  const [anamnes, setAnamnes] = useState<string>("");

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  if (!isOpen) return null; // Не отображаем окно, если оно закрыто

  const handleAdd = async () => {
    try {
        setLoading(true)
        const token = localStorage.getItem("token");
        const response = await axios.post('/api/anamnes', {
            fio,
            birthday,
            scan_date,
            anamnes
        },
        {
            headers: {
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
              "Content-Type": "application/json",
            },
        }
        );

        const updatedAnamnes = {
            ...response.data, // Полученные обновлённые данные
            birthday: response.data.birthday,
            scan_date: response.data.scan_date,
        };
    
        // Обновляем состояние через Redux
        dispatch(addAnamnes(updatedAnamnes));

        onClose(false); // Закрываем модальное окно после сохранения
    }
    catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка при отправке анамнеза. проверьте данные');
    }
    finally {
        setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Добавить анамнез</h2>
        {/* Поле для ввода ФИО */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО
          </label>
          <input
            type="text"
            value={fio}
            onChange={(e) => setFio(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Введите ФИО"
          />
        </div>

        {/* Поле для ввода даты рождения */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата рождения
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Поле для ввода даты снимка */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата снимка
          </label>
          <input
            type="date"
            value={scan_date}
            onChange={(e) => setScan_date(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Поле для ввода анамнеза */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Анамнез
          </label>
          <textarea
            value={anamnes}
            onChange={(e) => setAnamnes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
            placeholder="Введите анамнез"
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Кнопки */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={() => {
              handleAdd();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
