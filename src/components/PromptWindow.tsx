import { setPrompt } from "@/stores/aiSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/stores/store";


export default function PromptWindow() {
    const dispatch = useDispatch<AppDispatch>();

    const { prompt } = useSelector((state: RootState) => state.ai)

    return (
        <div className="max-w-full min-h-64 flex flex-col p-4 bg-gray-100 rounded shadow">
            <div className="flex flex-row">
                <h3 className="flex-grow">Введите ваш запрос</h3>
                <button className="px-2 text-xs"
                onClick={() => dispatch(setPrompt(null))}>
                    Отчистить
                </button>
            </div>
            <textarea
            className="flex-grow resize-none p-2"
            value={prompt || ""}
            onChange={(e) => dispatch(setPrompt(e.target.value))}>
            </textarea>
        </div>
    )
}