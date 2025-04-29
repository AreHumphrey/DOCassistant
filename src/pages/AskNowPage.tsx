import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptWindow from "@/components/PromptWindow";
import AnswerWindow from "@/components/AnswerWindow";
import FeedbackWindow from "@/components/FeedbackWindow";

import { useAuth } from "@/contexts/AuthContext";
import { generateAssistant, continueAssistant } from "@/stores/aiSlice";
import { RootState, AppDispatch } from "@/stores/store";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AskNowPage() {
  const purpose = "ASK_NOW"; // Используем ASK_NOW
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { requireAuth } = useAuth();

  const { prompt, thread_id, answer, saved_prompt_id } = useSelector((state: RootState) => state.ai);
  const [searchParams] = useSearchParams();

  const uidFromUrl = searchParams.get("uid") ?? "";

  const breadcrumbs = [
    { label: "Спроси сейчас", path: "/ai/ans" },
    { label: "Создание запроса" }
  ];

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  const handleGenerate = async () => {
    if (!prompt) {
      alert("Введите запрос перед отправкой.");
      return;
    }

    try {
      if (!thread_id) {
        await dispatch(generateAssistant({ uid: "", filenames: [], prompt, purpose }));
      } else {
        await dispatch(continueAssistant({ uid: "", filenames: [], prompt, purpose, thread_id }));
      }

    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Произошла ошибка на сервере. Пожалуйста, попробуйте позже.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <Breadcrumbs items={breadcrumbs} />
     

      <main className="flex flex-col items-center justify-start gap-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Задайте ваш вопрос ИИ</h1>


      {answer && (
          <div className="w-full">
            <AnswerWindow uid={uidFromUrl} pid={saved_prompt_id} />
            <div className="w-full flex justify-start mt-4 px-10">
              <button
                onClick={() => setFeedbackOpen(true)}
                className="bg-[#0A57FF] text-white text-sm font-semibold px-6 py-3 rounded-full shadow-md hover:bg-[#084fd6] transition text-left"
              >
                Оставить отзыв
              </button>
            </div>

          </div>
        )}
        {}
        <>
          <PromptWindow />
          <div className="w-full flex justify-center">
            <button
              onClick={handleGenerate}
              className="mt-4 bg-[#0A57FF] text-white text-sm font-semibold pl-6 pr-10 py-3 rounded-full shadow-md hover:bg-[#084fd6] transition w-[320px] text-center"
            >
              ОТПРАВИТЬ ЗАПРОС ИИ
            </button>
          </div>
        </>

        
      </main>

      <FeedbackWindow isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} purpose={purpose} />
      <Footer />
    </div>
  );
}
