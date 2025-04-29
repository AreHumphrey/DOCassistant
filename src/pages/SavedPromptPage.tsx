import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { fetchAnamneseByUid, fetchSavedPromptsByUid } from "@/stores/savedPromptSlice";
import { setAnswer } from "@/stores/aiSlice";
import { fetchFileByName, resetFiles } from "@/stores/filesSlice";

import AnamnesProfile from "@/components/Anamnes/AnamnesProfile";
import FileItem from "@/components/FileManager/FileItem";
import Breadcrumbs from "@/components/Breadcrumbs";
import SavedPromptsWindow from "@/components/SavedPromptsWindow";
import AnswerWindow from "@/components/AnswerWindow";
import Header from "@/components/Header";

export default function SavedPromptPage() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);

  const { requireAuth } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { anamnes, savedPromptsList, loading } = useSelector((state: RootState) => state.savedPrompts);
  const { files } = useSelector((state: RootState) => state.files);

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
    dispatch(resetFiles());
    if (selectedPrompt !== null) {
      const filenames = savedPromptsList[selectedPrompt]?.filenames || [];
      if (filenames.length > 0) {
        filenames.forEach((filename) => {
          if (filename && !files.some((file) => file.servername === filename)) {
            dispatch(fetchFileByName(filename));
          }
        });
      } else {
        dispatch(setAnswer(""));
      }
      dispatch(setAnswer(savedPromptsList[selectedPrompt]?.gpt_answer || ""));
    }
  }, [selectedPrompt, dispatch, savedPromptsList, files]);

  return (
    <>
      <Header />
      
      <div className="px-8 py-6 bg-gray-50 min-h-screen">
        {!loading && anamnes && (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_320px] gap-8">
            <div>
              <AnamnesProfile />
            </div>

            <div className="flex flex-col gap-6">
              <SavedPromptsWindow savedPromptsList={savedPromptsList} setSelectedPrompt={setSelectedPrompt} />
              <AnswerWindow
                uid={uid !== null ? uid : ""}
                pid={selectedPrompt !== null ? savedPromptsList[selectedPrompt].id : null}
              />
            </div>

            <div className="flex flex-col gap-4">
              {files.length > 0 ? (
                files.map((file, index) => (
                  <FileItem key={index} file={file} />
                ))
              ) : (
                <p className="text-gray-400 text-sm">Файлы не найдены или загружаются...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
