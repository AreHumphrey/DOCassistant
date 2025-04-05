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
import ChoosePurpose from "@/components/ChoosePurpose";

export default function CarPage() {
    const [purpose, setPurpose] = useState("")
    const navigate = useNavigate()

    const { requireAuth } = useAuth();

    const dispatch = useDispatch<AppDispatch>();
    const { files } = useSelector((state: RootState) => state.files);
    const { prompt, thread_id, answer, saved_prompt_id } = useSelector((state: RootState) => state.ai)
    const { anamnes } = useSelector((state: RootState) => state.anamnes)

    const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false)

    useEffect(() => {
        requireAuth();
    }, [requireAuth]);

    useEffect(() => {
        dispatch(loadFromStorage())
    }, [])

    const handleGenerate = async () => {
        const filenames = files
        .filter((file) => file.isSelected)
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

    return (
        <div>
            <Header />
            <div className="flex flex-col gap-4 p-8">
                <div className="flex flex-row justify-around">
                    <AnamnesProfile />
                    <AnamnesUpload />
                </div>

                {/* Галерея загруженных файлов */}
                <div className="bg-gray-100 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-semibold text-gray-800">Загруженные снимки:</h2>
                        <div className="flex gap-6 text-sm font-semibold text-blue-600">
                            <button className="hover:underline">ИЗМЕНИТЬ НАБОР СНИМКОВ</button>
                            <button className="hover:underline">СОХРАНИТЬ</button>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                        <div className="grid grid-cols-5 gap-3">
                            {files.length === 0 ? (
                                <p className="text-gray-600 col-span-5">Нет файлов</p>
                            ) : (
                                files.map((file, index) => (
                                    <div key={index} className="w-full aspect-video bg-gray-200 rounded overflow-hidden shadow-sm flex items-center justify-center">
                                        <img
                                          src={file.fileUrl}
                                          alt="Снимок"
                                          className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <PromptWindow />
                <ChoosePurpose type="CAR" setPurpose={setPurpose} />
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
