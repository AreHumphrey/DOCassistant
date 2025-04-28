import AnswerWindow from "@/components/AnswerWindow";
import FileView from "@/components/FileManager/FileView";
import Header from "@/components/Header";
import { Ananmnes } from "@/types/Anamnes";
import { FileData } from "@/types/File";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function AnswerPage() {
    const navigate = useNavigate()
    const uid = localStorage.getItem("uid")
    const pid = Number(localStorage.getItem("pid"))
    const buf_anamnes = localStorage.getItem("anamnes")
    const anamnes: Ananmnes | null = buf_anamnes ? JSON.parse(buf_anamnes) : null
    const files: FileData[] = JSON.parse(localStorage.getItem("selectedFiles")!)

    const breadcrumbs = [
        { label: "Спроси сейчас", path: "/ai/ans" },
        { label: "Создание запроса" }
      ];
    

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <Breadcrumbs items={breadcrumbs} />
            
            <div className="flex flex-col flex-grow justify-center items-center">
                <div className="flex flex-row gap-10">
                    <div className="w-3/6">
                        <AnswerWindow 
                        uid={uid ? uid : ""}
                        pid={pid}/>
                    </div>
                    <div className="flex flex-col gap-16">
                        {anamnes &&
                        <div className="flex flex-col mt-6 p-4 border border-gray-300 rounded-lg bg-white shadow-md max-w-2xl w-full">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Данные карты пациента</h2>
                            <p>{anamnes.fio} / {anamnes.scan_date} / {anamnes.birthday} / {anamnes.uid}</p>
                            <p>{anamnes.anamnes}</p>
                        </div>
                        }
                        <div className="grid grid-cols-3 gap-4">
                            {files.map((file, index) => (
                                <div className="flex flex-col">
                                    <FileView file={file} key={index}/>
                                    <p>{file.filename}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Новый запрос
                </button>
            </div>
        </div>
    )
}