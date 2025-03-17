import { useState } from "react";

import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { updateAnamnes } from "@/stores/anamnesSlice"; // Действие для обновления анамнеза в Redux

export default function AnamnesProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { anamnes, loading, error } = useSelector(
    (state: RootState) => state.anamnes
  );

  const [isEditing, setIsEditing] = useState(false); // Состояние редактирования
  const [editedAnamnes, setEditedAnamnes] = useState(anamnes?.anamnes || ""); // Текст анамнеза

  // Обработчик для начала редактирования
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedAnamnes(anamnes?.anamnes || ""); // Установить текущий текст анамнеза
  };

  // Обработчик для сохранения изменений
  const handleSaveClick = () => {
    if (anamnes) {
      dispatch(
        updateAnamnes({
          ...anamnes,
          anamnes: editedAnamnes, // Обновляем текст анамнеза
        })
      );
    }
    setIsEditing(false);
  };

  // Обработчик для отмены изменений
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedAnamnes(anamnes?.anamnes || ""); // Сбрасываем изменения
  };

  return (
    <div>
      {loading && <p className="text-blue-600 mt-4">Загрузка карты пациента...</p>}

      {error && (
        <p className="text-red-600 mt-4">
          Ошибка: {error}
        </p>
      )}

      {anamnes && (
        <div>
          <div className="flex-grow mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Данные карты пациента</h2>
            <p>{anamnes.fio} / {anamnes.scan_date} / {anamnes.birthday} / {anamnes.uid}</p>
            {!isEditing ? (
              <p>{anamnes.anamnes}</p>
            ) : (
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={editedAnamnes}
                onChange={(e) => setEditedAnamnes(e.target.value)}
                rows={4}
              />
            )}
          </div>

          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Изменить анамнез
            </button>
          ) : (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Сохранить
              </button>
              <button
                onClick={handleCancelClick}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && !anamnes && (
        <p className="text-gray-500 mt-4">
          Карта пациента отсутствует.
        </p>
      )}
    </div>
  );
}
