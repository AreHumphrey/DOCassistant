import { useState } from "react";
import axios from "axios";
import { FeedbackPost } from "@/types/Feedback";

interface FeedbackWindowProps {
    isOpen: boolean;
    onClose: () => void; // Функция для закрытия модального окна
    purpose: string
}

export default function FeedbackWindow({ isOpen, onClose, purpose }: FeedbackWindowProps) {
    const [feedbackText, setFeedbackText] = useState<string>(""); // Текст отзыва
    const [rating, setRating] = useState<number>(1); // Оценка
    const [loading, setLoading] = useState<boolean>(false); // Статус загрузки
    const [error, setError] = useState<string | null>(null); // Ошибка

    const handleFeedback = async () => {
        setLoading(true);
        setError(null);

        if (rating > 5 || rating < 1) {
            setError("Неправильный рейтинг")
            setLoading(false)
            return
        }

        const token = localStorage.getItem("token");
        const feedbackData: FeedbackPost = {
            feedback_text: feedbackText,
            rating: rating,
            purpose: purpose,
        };

        try {
            const response = await axios.post("/api/feedback", feedbackData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Отзыв успешно отправлен:", response.data);

            // Сбросить поля после успешной отправки
            setFeedbackText("");
            setRating(0);
            onClose(); // Закрыть модальное окно
        } catch (err: any) {
            setError(err.response?.data?.detail || "Ошибка отправки отзыва");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null; // Если окно не открыто, ничего не рендерим
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold mb-4">Оставить отзыв</h2>
                {/* Поле для текста отзыва */}
                <textarea
                    placeholder="Ваш отзыв"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full p-2 border rounded mb-4 resize-none"
                    rows={4}
                />
                {/* Поле для рейтинга */}
                <input
                    type="number"
                    placeholder="Рейтинг (1-5)"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    min={1}
                    max={5}
                    className="w-full p-2 border rounded mb-4"
                />
                {/* Ошибка */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {/* Кнопки */}
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleFeedback}
                        disabled={loading}
                        className={`px-4 py-2 rounded ${
                            loading
                                ? "bg-gray-300 text-gray-500"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "Отправка..." : "Отправить"}
                    </button>
                </div>
            </div>
        </div>
    );
}
