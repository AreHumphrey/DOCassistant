import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { AppDispatch } from "@/stores/store";
import { useDispatch } from "react-redux";
import { getAnamnesFromFile } from "@/stores/anamnesSlice";

export default function AnamnesUpload() {
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]; // Берём первый файл из массива
        if (!file) return;

        setUploadProgress(0); // Сбрасываем прогресс перед загрузкой

        // Отправка файла на сервер
        dispatch(
            getAnamnesFromFile({
              file,
              onProgress: (progress) => setUploadProgress(progress),
            })
        );
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div
            {...getRootProps({
                className: `border-dashed border-2 rounded-full p-6 
                flex flex-col items-center justify-center 
                ${isDragActive ? "bg-blue-50 border-blue-400" : "bg-gray-100 border-gray-300"}`
            })}
        >
            <input {...getInputProps()} />
            <p className="text-gray-600 text-center">
                Перетащите сюда файлы с историей болезни пациента
            </p>
            {uploadProgress !== null ? (
                <p className="text-blue-600 mt-2">Загружено {uploadProgress}%</p>
            ) : (
                <p className="text-blue-600 mt-2">Загружено 0%</p>
            )}
        </div>
    );
}
