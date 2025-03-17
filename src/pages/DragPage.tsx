import { useEffect, useState } from "react";
import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import Header from "@/components/Header";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/stores/store";
import { AppDispatch } from "@/stores/store";

import { fetchAnamneseByUid } from "@/stores/savedPromptSlice"
import { drugsAssistant } from "@/stores/aiSlice"

import DrugsSearch from "@/components/Drugs/DrugsSearch";
import AnswerWindow from "@/components/AnswerWindow";
import DrugsList from "@/components/Drugs/DrugsList";
import FeedbackWindow from "@/components/FeedbackWindow";

export default function DrugPage() {
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid"); // Извлекаем параметр "uid"
    const purpose = "FAR"

    const { requireAuth } = useAuth();

    const dispatch = useDispatch<AppDispatch>()
    const { choosenDrugsList } = useSelector((state: RootState) => state.drug)

    const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false)

    useEffect(() => {
        requireAuth();
    }, [requireAuth]);

    useEffect(() => {
        if (uid) {
            dispatch(fetchAnamneseByUid(uid))
        }
    }, [uid])

    const handleGenerate = async () => {
        if (uid && choosenDrugsList.length > 0) {
            dispatch(drugsAssistant({uid: uid, drugs: choosenDrugsList}))
        }
    }

    return (
        <div>
            <Header />
            <div className="flex flex-row gap-4 p-8">
                <AnamnesProfile />
                <div className="w-full flex flex-col gap-4">
                    <AnswerWindow uid={uid ? uid : ""} pid={null}/>
                    <DrugsSearch />
                    <DrugsList />
                    <button onClick={handleGenerate}>Отправить</button>
                    <button onClick={() => setFeedbackOpen(true)}>Оставить отзыв</button>
                </div>
            </div>
            <FeedbackWindow isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} purpose={purpose} />
        </div>
    )
}