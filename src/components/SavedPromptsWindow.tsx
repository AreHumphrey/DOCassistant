import React, { useState } from "react";
import { SavedPrompt } from "@/types/SavedPrompt";

interface SavedPromptsWindowProps {
  savedPromptsList: SavedPrompt[];
  setSelectedPrompt: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function SavedPromptsWindow({ savedPromptsList, setSelectedPrompt }: SavedPromptsWindowProps) {
  const [searchName, setSearchName] = useState<string>("");
  const [searchPrompt, setSearchPrompt] = useState<string>("");
  const [searchPurpose, setSearchPurpose] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const formatDate = (date: string | undefined): string => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const filteredPrompts = savedPromptsList.filter((savedPrompt) => {
    const matchesName = savedPrompt.prompt_name
      ? savedPrompt.prompt_name.toLowerCase().includes(searchName.toLowerCase())
      : searchName === "";
    const matchesPrompt = savedPrompt.prompt.toLowerCase().includes(searchPrompt.toLowerCase());
    const matchesPurpose = savedPrompt.purpose.toLowerCase().includes(searchPurpose.toLowerCase());

    return matchesName && matchesPrompt && matchesPurpose;
  });

  const handleSelect = (index: number) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setSelectedPrompt(null);
    } else {
      setSelectedIndex(index);
      setSelectedPrompt(index);
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-2 w-full text-sm">
        <input
          type="text"
          placeholder="Имя запроса"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Текст запроса"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
        />
        <input
          type="text"
          placeholder="ФИО"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          value={searchPurpose}
          onChange={(e) => setSearchPurpose(e.target.value)}
        />
      </div>

      {/* Список запросов */}
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((saved_prompt, index) => (
            <li
              key={saved_prompt.id}
              className={`p-3 rounded-xl cursor-pointer transition-all text-sm ${
                selectedIndex === index
                  ? "bg-blue-600 text-white font-semibold shadow-md"
                  : "bg-gray-100 hover:bg-blue-50"
              }`}
              onClick={() => handleSelect(index)}
            >
              {saved_prompt.prompt_name || "Без названия"} | {formatDate(saved_prompt.created_at)} | {saved_prompt.prompt}
            </li>
          ))
        ) : (
          <p className="text-gray-400 text-sm">Запросы не найдены или загружаются...</p>
        )}
      </ul>
    </div>
  );
}
