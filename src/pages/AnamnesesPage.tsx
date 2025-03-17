import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import AnamnesUpload from "@/components/FileManager/AnamnesUpload";
import Header from "@/components/Header";
import AnamnesAddModal from "@/components/Anamnes/AnamnesAddModal";

import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

export default function AnamnesesPage() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const navigate = useNavigate()

    const { anamnes} = useSelector(
        (state: RootState) => state.anamnes
    );

    const handelContinue = () => {
      localStorage.setItem("uid", anamnes?.uid || "")
      navigate(`/files`)
    }


    return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col flex-grow justify-center items-center">
        <div className="flex flex-row items-center gap-36 p-6">
            <AnamnesProfile />
            <div className="flex flex-col gap-1 items-center">
                <AnamnesUpload />
                <button
                className="w-80 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => setIsOpen(true)}>Добавить вручную</button>
            </div>
        </div>
        <button 
        className="w-36 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={() => handelContinue()}
        >
            Далее
        </button>
      </div>
      <AnamnesAddModal isOpen={isOpen} onClose={setIsOpen}/>
    </div>
  );
}
