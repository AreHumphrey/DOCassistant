import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import Header from "@/components/Header";
import PromptWindow from "@/components/PromptWindow";
import AnswerWindow from "@/components/AnswerWindow";
import FeedbackWindow from "@/components/FeedbackWindow";
import FileItem from "@/components/FileManager/FileItem";
import AnamnesUpload from "@/components/FileManager/AnamnesUpload";

import { useAuth } from "@/contexts/AuthContext";
import { generateAssistant, continueAssistant } from "@/stores/aiSlice"
import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { loadFromStorage } from "@/stores/filesSlice";

export default function RadPage() {
    const [purpose, setPurpose] = useState("")
    const navigate = useNavigate()

    const { requireAuth } = useAuth();

    const dispatch = useDispatch<AppDispatch>();
    const { files } = useSelector((state: RootState) => state.files);
    const { prompt, thread_id, answer, saved_prompt_id } = useSelector((state: RootState) => state.ai)
    const { anamnes } = useSelector((state: RootState) => state.anamnes)

    const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false)
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>(files.map((_, i) => i))

    useEffect(() => {
        requireAuth();
    }, [requireAuth]);

    useEffect(() => {
        dispatch(loadFromStorage())
    }, [])

    const handleGenerate = async () => {
        const filenames = files
        .filter((_, index) => selectedIndexes.includes(index))
        .map((file) => file.servername)
        const uid = anamnes !== undefined && anamnes ? anamnes.uid : "" 

        if (!thread_id) {
            dispatch(generateAssistant({uid: uid!, filenames: filenames, prompt: prompt!, purpose: purpose}))
        }
        else {
            dispatch(continueAssistant({uid: uid!, filenames: filenames, prompt: prompt!, purpose: purpose, thread_id: thread_id}))
        }
    }

    const handelContinue = () => {
        localStorage.setItem("answer", answer)
        localStorage.setItem("pid", saved_prompt_id ? saved_prompt_id.toString() : "")
        localStorage.setItem("anamnes", anamnes ? JSON.stringify(anamnes) : "")
        navigate("/answer")
    }

    const toggleSelection = (index: number) => {
        if (selectedIndexes.includes(index)) {
            setSelectedIndexes(selectedIndexes.filter((i) => i !== index))
        } else {
            setSelectedIndexes([...selectedIndexes, index])
        }
    }

    return (
        <div>
            <Header />
            <div className="flex flex-col gap-4 p-8">
                <div className="flex flex-row justify-around">
                    <AnamnesProfile />
                    <AnamnesUpload />
                </div>

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
                    <div className="bg-white p-4 rounded-lg overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                        <div className="grid grid-cols-5 gap-3">
                            {files.map((file, index) => {
                                const isSelected = selectedIndexes.includes(index)
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
                                )
                            })}
                        </div>
                    </div>
                </div>

                <PromptWindow />
                <div className="flex flex-col flex-grow gap-4">
                    <AnswerWindow 
                    uid={anamnes !== undefined && anamnes ? anamnes.uid : ""}
                    pid={saved_prompt_id}/>
                    <button onClick={() => handleGenerate()}>Отправить</button>
                    <button onClick={() => setFeedbackOpen(true)}>Оставить отзыв</button>
                </div>
                <button 
                className="w-36 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => handelContinue()}
                >Далее
                </button>
            </div>
            <FeedbackWindow isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} purpose={purpose} />
        </div>
    )
}