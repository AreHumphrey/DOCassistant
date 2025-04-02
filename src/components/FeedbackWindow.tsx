import { useState } from "react";
import axios from "axios";
import { FeedbackPost } from "@/types/Feedback";

interface FeedbackWindowProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: string;
}

export default function FeedbackWindow({ isOpen, onClose, purpose }: FeedbackWindowProps) {
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeedback = async () => {
    if (rating < 1 || rating > 5) {
      setError("Пожалуйста, выберите рейтинг от 1 до 5");
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const feedbackData: FeedbackPost = {
      feedback_text: feedbackText,
      rating: rating,
      purpose: purpose,
    };

    try {
      await axios.post("/api/feedback", feedbackData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Отзыв успешно отправлен"); // ← добавлено

      setFeedbackText("");
      setRating(0);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка отправки отзыва");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = i <= (hoverRating || rating);
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          className={`text-[70px] cursor-pointer transition ${
            isActive ? "text-[#0A57FF]" : "text-[#D6E0F3]"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-xl p-6 border-2 border-[#ADC9FC] hover:border-[3px] transition-all">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">Оставить отзыв</h2>

        <div className="flex justify-center mb-4">{renderStars()}</div>

        <textarea
          placeholder="Ваш отзыв"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="w-full p-4 text-[16px] text-black border-2 border-[#265ACA] rounded-xl focus:outline-none focus:border-[#265ACA] focus:border-[3px] transition-all mb-4 resize-none placeholder-gray-400"
        />

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#FE7678] text-white font-semibold rounded-full hover:bg-[#EF8183] transition focus:outline-none"
          >
            Отмена
          </button>
          <button
            onClick={handleFeedback}
            disabled={loading}
            className={`px-6 py-3 font-semibold rounded-full transition focus:outline-none ${
              loading
                ? "bg-gray-300 text-gray-500"
                : "bg-[#0A57FF] text-white hover:bg-[#265ACA]"
            }`}
          >
            {loading ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </div>
    </div>
  );
}
