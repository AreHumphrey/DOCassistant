import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerWindow from "@/components/AnswerWindow";
import FileView from "@/components/FileManager/FileView";
import { Ananmnes } from "@/types/Anamnes";
import { FileData } from "@/types/File";

export default function AnswerPage() {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const pid = Number(localStorage.getItem("pid"));
  const buf_anamnes = localStorage.getItem("anamnes");
  const anamnes: Ananmnes | null = buf_anamnes ? JSON.parse(buf_anamnes) : null;
  const files: FileData[] = JSON.parse(localStorage.getItem("selectedFiles") || "[]");

  const ai = localStorage.getItem("ai") || "lab";

  const getBreadcrumbs = () => {
    const directions: Record<string, { label: string; path: string }> = {
      lab: { label: "Расшифровка лаб. анализов", path: "/ai/lab" },
      rad: { label: "Лучевая диагностика", path: "/ai/rad" },
      far: { label: "Совместимость лекарств", path: "/ai/far" },
      car: { label: "ЭКГ", path: "/ai/car" },
      ans: { label: "Спроси сейчас", path: "/ai/ans" },
    };

    const current = directions[ai];

    return current
      ? [
          { label: current.label, path: current.path },
          { label: "Создание карты пациента", path: "/anamnes" },
          { label: "Выбор файлов", path: "/files" },
          { label: "Создание запроса", path: "/prompt" },
          { label: "Сохранение запроса" },
        ]
      : [{ label: "Сохранение запроса" }];
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Breadcrumbs items={getBreadcrumbs()} />

      <main className="flex flex-col items-center justify-start flex-grow px-4 py-10">
        <div className="w-full max-w-7xl flex flex-col gap-12">
          
          {/* Ответ ИИ */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-black mb-6">Ответ ИИ</h1>
            <AnswerWindow uid={uid || ""} pid={pid} />
          </div>

          {/* Карта пациента + файлы */}
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Карта пациента */}
            {anamnes && (
              <div className="flex-1 bg-white border border-gray-300 rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-semibold text-black mb-4">Данные пациента</h2>
                <div className="text-black space-y-2">
                  <p><strong>ФИО:</strong> {anamnes.fio}</p>
                  <p><strong>Дата рождения:</strong> {anamnes.birthday}</p>
                  <p><strong>Дата снимка:</strong> {anamnes.scan_date}</p>
                  <p><strong>UID:</strong> {anamnes.uid}</p>
                  <p><strong>Заметки:</strong> {anamnes.anamnes}</p>
                </div>
              </div>
            )}

            {/* Загруженные файлы */}
            <div className="flex-1 bg-white border border-gray-300 rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-black mb-4">Загруженные файлы</h2>
              <div className="grid grid-cols-2 gap-4">
                {files.length > 0 ? (
                  files.map((file, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <FileView file={file} />
                      <p className="text-sm text-black font-medium text-center">{file.filename}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Файлы не найдены.</p>
                )}
              </div>
            </div>

          </div>

          {/* Кнопка Новый Запрос */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/")}
              className="bg-[#0A57FF] hover:bg-blue-700 transition text-white font-bold py-3 px-8 rounded-full text-lg"
            >
              Новый запрос
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
