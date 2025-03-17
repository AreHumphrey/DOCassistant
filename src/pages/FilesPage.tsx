import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FileWindow from "@/components/FileManager/FileWindow";
import Header from "@/components/Header";

import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

export default function FilesPage() {
    const [_, setUploadedFiles] = useState<File[]>([])
    const navigate = useNavigate()

    const { files } = useSelector((state: RootState) => state.files)

    const handelContinue = () => {
        const selectedFiles = files.filter((file) => file.isSelected);
        localStorage.setItem("selectedFiles", JSON.stringify(selectedFiles));
        navigate(`/ai/${localStorage.getItem("ai")}?uid=${localStorage.getItem("uid")}`)
    }
    
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow flex-col justify-center items-center">
                <FileWindow setUploadedFiles={setUploadedFiles} />
                <button 
                className="w-36 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => handelContinue()}
                >
                    Далее
                </button>
            </div>
        </div>
    );
}