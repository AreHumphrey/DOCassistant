import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AppDispatch } from "@/stores/store";
import { useDispatch } from "react-redux";
import { getAnamnesFromFile } from "@/stores/anamnesSlice";

export default function AnamnesUpload() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadProgress(0);
    dispatch(
      getAnamnesFromFile({
        file,
        onProgress: (progress) => setUploadProgress(progress),
      })
    );
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (

    <div className="flex justify-end w-full px-4">
    <div
      {...getRootProps({
        className: `
          bg-[#D9E9FF] rounded-2xl px-5 py-3
          flex items-center justify-center
          w-[160px] h-[220px] sm:w-[360px] sm:h-[140px]
          cursor-pointer transition
        `,
      })}
    >
      <input {...getInputProps()} />
      <div className="text-left w-full max-w-[220px] sm:max-w-[280px]">
        <p className="text-black text-[14px] font-medium leading-[1.4]">
          Перетащите сюда дополнительные<br />
          файлы для пополнения данных<br />
          карточки пациента<br />
          в формате: PDF, DOC, TXT, XLS.
        </p>
      </div>
    </div>
  </div>
  


  );
  
}
