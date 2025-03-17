import React, { useState } from "react";
import { SavedPrompt } from "@/types/SavedPrompt";


interface SavedPromptsWindowProps {
  savedPromptsList: SavedPrompt[];
  setSelectedPrompt: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function SavedPromptsWindow({
  savedPromptsList,
  setSelectedPrompt,
}: SavedPromptsWindowProps) {
  const [searchName, setSearchName] = useState<string>(""); // Фильтр по названию промпта
  const [searchPrompt, setSearchPrompt] = useState<string>(""); // Фильтр по тексту запроса
  const [searchPurpose, setSearchPurpose] = useState<string>(""); // Фильтр по назначению (ФИО)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const formatDate = (date: string | undefined): string => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // Фильтрация списка запросов
  const filteredPrompts = savedPromptsList.filter((savedPrompt) => {
    const matchesName = savedPrompt.prompt_name
    ? savedPrompt.prompt_name.toLowerCase().includes(searchName.toLowerCase())
    : searchName === ""; // Если имени нет, оно соответствует пустому фильтру
    const matchesPrompt = savedPrompt.prompt
      .toLowerCase()
      .includes(searchPrompt.toLowerCase());
    const matchesPurpose = savedPrompt.purpose
      .toLowerCase()
      .includes(searchPurpose.toLowerCase());

    return matchesName && matchesPrompt && matchesPurpose;
  });

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      // Если нажали на уже выбранный элемент, снимаем выделение
      setSelectedIndex(null);
      setSelectedPrompt(null);
    } else {
      // Если нажали на новый элемент, выделяем его
      setSelectedIndex(index);
      setSelectedPrompt(index);
    }
  };

  return (
    <div className="max-w-full max-h-80 flex flex-col gap-4 p-4 bg-gray-100 rounded shadow">
      {/* Фильтры */}
      <div className="flex flex-row gap-2 w-full text-xs">
        <input
          type="text"
          placeholder="Имя запроса"
          className="p-2 border rounded"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Текст запроса"
          className="p-2 border rounded"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
        />
        <input
          type="text"
          placeholder="ФИО"
          className="p-2 border rounded"
          value={searchPurpose}
          onChange={(e) => setSearchPurpose(e.target.value)}
        />
      </div>

      {/* Список запросов с ограниченной высотой и прокруткой */}
      <ul className="space-y-2 mb-3 max-h-64 overflow-y-auto border p-2 rounded">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((saved_prompt, index) => (
            <li
              className={`flex flex-row p-2 rounded shadow cursor-pointer ${
                selectedIndex === index
                  ? "bg-blue-200 text-white" // Стили для выбранного элемента
                  : "bg-white hover:bg-blue-100" // Стили для обычных элементов
              }`}
              key={saved_prompt.id}
              onClick={() => handleSelect(index)}
            >
              {saved_prompt.prompt_name || "Без названия"} | {formatDate(saved_prompt.created_at)}{" "}
              | {saved_prompt.prompt}
            </li>
          ))
        ) : (
          <p>Запросы не найдены или загружаются...</p>
        )}
      </ul>
    </div>
  );
}
