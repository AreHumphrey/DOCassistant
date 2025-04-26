import { useEffect, useState } from "react";
import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import Header from "@/components/Header";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/stores/store";
import { AppDispatch } from "@/stores/store";

import { fetchAnamneseByUid } from "@/stores/savedPromptSlice";
import { drugsAssistant } from "@/stores/aiSlice";

import DrugsSearch from "@/components/Drugs/DrugsSearch";
import AnswerWindow from "@/components/AnswerWindow";
import DrugsList from "@/components/Drugs/DrugsList";
import FeedbackWindow from "@/components/FeedbackWindow";

export default function DrugPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const purpose = "FAR";

  const { requireAuth } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { choosenDrugsList } = useSelector((state: RootState) => state.drug);
  const { answer } = useSelector((state: RootState) => state.ai);

  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (uid) {
      dispatch(fetchAnamneseByUid(uid));
    }
  }, [uid]);

  const handleGenerate = async () => {
    if (uid && choosenDrugsList.length > 0) {
      await dispatch(drugsAssistant({ uid, drugs: choosenDrugsList }));
      setShowAnswer(true);
    }
  };

  return (
    <div>
      <Header />

      <main className="w-full flex flex-col items-center justify-center gap-8 px-2 sm:px-4 py-6">
        <AnamnesProfile />

        {showAnswer && answer && (
          <AnswerWindow uid={uid ?? ""} pid={null} />
        )}

      
        <DrugsSearch />
        <DrugsList />

        <div className="flex gap-4 mb-10">
          <button
            onClick={handleGenerate}
            className="bg-[#0A57FF] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#265ACA]"
          >
            Отправить
          </button>
          <button
            onClick={() => setFeedbackOpen(true)}
            className="bg-[#FE7678] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#EF8183] focus:outline-none focus:ring-0 focus:ring-transparent"
          >
            Оставить отзыв
          </button>
        </div>
      </main>

      <FeedbackWindow
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        purpose={purpose}
      />

    <Footer />
      
    </div>
    
  );
}
