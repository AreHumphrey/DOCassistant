import { useState } from "react";
import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { updateAnamnes } from "@/stores/anamnesSlice";

export default function AnamnesProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { anamnes, loading, error } = useSelector((state: RootState) => state.anamnes);

  const [isEditing, setIsEditing] = useState(false);
  const [editedAnamnes, setEditedAnamnes] = useState(anamnes?.anamnes || "");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedAnamnes(anamnes?.anamnes || "");
  };

  const handleSaveClick = () => {
    if (anamnes) {
      dispatch(updateAnamnes({ ...anamnes, anamnes: editedAnamnes }));
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedAnamnes(anamnes?.anamnes || "");
  };

  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-8">
      {loading && <p className="text-blue-600 mt-4">Загрузка карты пациента...</p>}
      {error && <p className="text-red-600 mt-4">Ошибка: {error}</p>}

      {anamnes && (
        <div className="w-full py-6 px-4 sm:px-6 mb-10 text-black max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-left w-full">
              <span className="text-[40px] sm:text-[64px] font-extrabold break-all block mb-4">
                {anamnes.uid}
              </span>
              <div className="text-[20px] sm:text-[24px] font-normal leading-snug break-words">
                <p className="mb-4">
                  {anamnes.fio} / {anamnes.birthday.split("-")[0]} / {calculateAge(anamnes.birthday)} лет
                </p>
                {!isEditing ? (
                  <p className="text-black text-[18px] sm:text-[22px] break-words">
                    {anamnes.anamnes || "—"}
                  </p>
                ) : (
                  <textarea
                    className="w-full mt-2 p-4 border border-gray-300 rounded-xl resize-none text-[18px] sm:text-[20px]"
                    value={editedAnamnes}
                    onChange={(e) => setEditedAnamnes(e.target.value)}
                    rows={4}
                  />
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSaveClick}
                className="px-6 py-3 bg-green-600 text-white rounded-full text-[16px] font-semibold hover:bg-green-700"
              >
                Сохранить
              </button>
              <button
                onClick={handleCancelClick}
                className="px-6 py-3 bg-red-600 text-white rounded-full text-[16px] font-semibold hover:bg-red-700"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      )}

      {!loading && !anamnes && (
        <p className="text-gray-500 mt-4">Карта пациента отсутствует.</p>
      )}
    </div>
  );
}
