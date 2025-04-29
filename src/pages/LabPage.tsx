import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import Header from "@/components/Header";
import PromptWindow from "@/components/PromptWindow";
import AnswerWindow from "@/components/AnswerWindow";
import FeedbackWindow from "@/components/FeedbackWindow";
import FileItem from "@/components/FileManager/FileItem";
import Footer from '@/components/Footer';
import AnamnesUpload from "@/components/FileManager/AnamnesUpload";


import Breadcrumbs from "@/components/Breadcrumbs";

import { useAuth } from "@/contexts/AuthContext";
import { generateAssistant, continueAssistant } from "@/stores/aiSlice";
import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { loadFromStorage } from "@/stores/filesSlice";

export default function LabPage() {
  const purpose = "LAB";
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { requireAuth } = useAuth();

  const breadcrumbs = [
    { label: "Расшифровка лаб. анализов", path: "/ai/lab" },
    { label: "Карта пациента", path: "/med" },
    { label: "Выбор файлов", path: "/files" },
    { label: "Создание запроса" }
  ];

  const { files } = useSelector((state: RootState) => state.files);
  const { prompt, thread_id, answer, saved_prompt_id } = useSelector((state: RootState) => state.ai);
  const { anamnes } = useSelector((state: RootState) => state.anamnes);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [localSelection, setLocalSelection] = useState<Record<number, boolean>>({});
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  useEffect(() => {
    const defaultSelection: Record<number, boolean> = {};
    files.forEach((_, i) => {
      defaultSelection[i] = true;
    });
    setLocalSelection(defaultSelection);
  }, [files]);

  const handleGenerate = async () => {
    const filenames = files
      .filter((_, index) => localSelection[index])
      .map((file) => file.servername);

    const uid = anamnes?.uid || "";

    if (!prompt) {
      alert("Введите запрос перед отправкой.");
      return;
    }

    if (filenames.length === 0) {
      alert("Выберите хотя бы один файл для отправки.");
      return;
    }

    try {
      if (!thread_id) {
        await dispatch(generateAssistant({ uid, filenames, prompt, purpose }));
      } else {
        await dispatch(continueAssistant({ uid, filenames, prompt, purpose, thread_id }));
      }
      setShowPrompt(false);
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Произошла ошибка на сервере. Пожалуйста, попробуйте позже.");
    }
  };

  const handleContinue = () => {
    localStorage.setItem("answer", answer);
    localStorage.setItem("pid", saved_prompt_id ? saved_prompt_id.toString() : "");
    localStorage.setItem("anamnes", anamnes ? JSON.stringify(anamnes) : "");
    navigate("/answer");
  };

  const toggleSelection = (index: number) => {
    setLocalSelection((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div>
      <Header />


      <Breadcrumbs items={breadcrumbs} />

      <div className="flex flex-col gap-4 py-8 px-0">
        <div className="flex flex-row justify-around px-6">
          <AnamnesProfile />
          <AnamnesUpload />
        </div>

        {/* Ответ ИИ и кнопка отзыва */}
        {answer && (
          <div className="w-full">
            <AnswerWindow uid={anamnes?.uid ?? ""} pid={saved_prompt_id} />
            <div className="w-full px-10 mt-4">
              <button
                onClick={() => setFeedbackOpen(true)}
                className="bg-[#0A57FF] text-white text-sm font-semibold pl-6 pr-10 py-3 rounded-full shadow-md hover:bg-[#084fd6] transition w-[320px] text-left"
              >
                Оставить отзыв
              </button>
            </div>
          </div>
        )}

        {/* Блок с файлами */}
        <div className="w-full px-10">
          <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Загруженные снимки:</h2>
          <div className="bg-gray-100 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-2 px-2">
              <span
                className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                ИЗМЕНИТЬ НАБОР СНИМКОВ
              </span>
              <span
                className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline"
                onClick={() => setIsEditMode(false)}
              >
                СОХРАНИТЬ
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <div className="grid grid-cols-5 gap-3">
              {files.map((file, index) => {
                const isSelected = localSelection[index];
                if (!isSelected && !isEditMode) return null;
                return (
                  <div
                    key={index}
                    onClick={() => isEditMode && toggleSelection(index)}
                    className={`relative w-full aspect-video bg-gray-200 rounded overflow-hidden shadow-sm flex items-center justify-center cursor-pointer ${isEditMode ? 'hover:opacity-70' : ''} ${isEditMode && isSelected ? 'border-4 border-blue-500' : ''}`}
                  >
                    <img
                      src={file.fileUrl}
                      alt="Снимок"
                      className="object-cover w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Окно ввода запроса и кнопка */}
        {showPrompt && (
          <>
            <PromptWindow />
            <div className="w-full flex justify-start px-10">
              <button
                onClick={handleGenerate}
                className="bg-[#0A57FF] text-white text-sm font-semibold pl-6 pr-10 py-3 rounded-full shadow-md hover:bg-[#084fd6] transition w-[320px] text-left"
              >
                ОТПРАВИТЬ ЗАПРОС ИИ
              </button>
            </div>
          </>
        )}


        <div className="w-full flex justify-start px-10">
            <button
              onClick={handleContinue}
              className="w-36 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Далее
            </button>

      </div>
      </div>

      <FeedbackWindow
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        purpose={purpose}
      />

      <Footer />
    </div>
  );
}
