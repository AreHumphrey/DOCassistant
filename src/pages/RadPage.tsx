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

export default function RadPage() {
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
                <div className="flex flex-col">
                    {files.length === 0 ? (
                        <p>Нет файлов</p>
                    ) : (
                        files.map((file, index) => (
                            <FileItem key={index} file={file} index={index} />
                        ))
                    )}
                </div>
                <PromptWindow />
                <ChoosePurpose type="RAD" setPurpose={setPurpose} />
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