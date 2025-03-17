import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { fetchAnamneseByUid, fetchSavedPromptsByUid } from "@/stores/savedPromptSlice";
import { setAnswer } from "@/stores/aiSlice"
import { fetchFileByName, resetFiles } from "@/stores/filesSlice"; // Импорт нового действия для получения файла
import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import FileItem from "@/components/FileManager/FileItem";
import SavedPromptsWindow from "@/components/SavedPromptsWindow";
import AnswerWindow from "@/components/AnswerWindow";
import Header from "@/components/Header";

export default function SavedPromptPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid"); // Извлекаем параметр "uid"

  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null); // Для отслеживания выбранного промпта

  const { requireAuth } = useAuth();

  const dispatch = useDispatch<AppDispatch>();
  const { anamnes, savedPromptsList, loading } = useSelector(
    (state: RootState) => state.savedPrompts
  );
  const { files } = useSelector((state: RootState) => state.files); // Все файлы из Redux состояния

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  useEffect(() => {
    if (uid) {
      dispatch(fetchAnamneseByUid(uid));
      dispatch(fetchSavedPromptsByUid(uid));
    }
  }, [uid]);

  useEffect(() => {
    dispatch(resetFiles())
    if (selectedPrompt !== null) {
      const filenames = savedPromptsList[selectedPrompt].filenames
      if (filenames && filenames.length > 0) {
        filenames.map((filename) => {
          if (filename && !files.some((file) => file.servername === filename)) {
            dispatch(fetchFileByName(filename));
          }
        })
      }
      else {
        dispatch(setAnswer(""))
      }
      dispatch(setAnswer(savedPromptsList[selectedPrompt].gpt_answer))
    }
  }, [selectedPrompt, dispatch]);

  return (
    <>
    <Header />
    <div className="p-8">
      {!loading && anamnes && (
        <div className="flex flex-row gap-20">
          <AnamnesProfile />
          <div className="max-w-screen-sm flex flex-col gap-7">
            <SavedPromptsWindow savedPromptsList={savedPromptsList} setSelectedPrompt={setSelectedPrompt}/>
            <AnswerWindow
            uid={uid !== null ? uid : ""}
            pid={selectedPrompt !== null ? savedPromptsList[selectedPrompt].id : null}/>
          </div>
          <div className="flex flex-col gap-1">
            {/* Отображаем первый файл из первого промпта */}
            {files.length > 0 && files.map((file, index) => (
              <FileItem
                key={index}
                file={file}
              />
            )
            )}
            {files.length === 0 && <p>Файл не найден или загружается...</p>}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
