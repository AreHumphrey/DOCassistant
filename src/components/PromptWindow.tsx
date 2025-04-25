import { setPrompt } from "@/stores/aiSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";

export default function PromptWindow() {
  const dispatch = useDispatch<AppDispatch>();
  const { prompt } = useSelector((state: RootState) => state.ai);

  return (
    <div className="w-full rounded-lg shadow overflow-hidden">
      {/* Белый заголовок */}
      <div className="bg-white px-10 py-4">
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Создание запроса ИИ:</h2>

      </div>

      {/* Серый блок с textarea */}
      <div className="bg-[#F5F5F5] px-6 py-6">
        <textarea
          value={prompt || ""}
          onChange={(e) => dispatch(setPrompt(e.target.value))}
          placeholder="Введите запрос..."
          className="w-full h-48 resize-none p-4 rounded-xl border border-blue-300 outline-none bg-[#F5F5F5] text-black"
        />
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => dispatch(setPrompt(null))}
            className="text-sm text-gray-500 hover:underline"
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
