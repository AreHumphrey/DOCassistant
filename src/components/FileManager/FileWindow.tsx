import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "@/stores/filesSlice";
import { AppDispatch, RootState } from "@/stores/store";
// @ts-ignore
import MainWindow from "@/components/ImageEditorPlugin/MainWindow.jsx";
import FileItem from "./FileItem";
import axios from "axios";

interface FileWindowProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function FileWindow({ setUploadedFiles }: FileWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { files, error, loading } = useSelector((state: RootState) => state.files);
  const { savedImageUrl } = useSelector((state: RootState) => state.editor);

  const [editorImages, setEditorImages] = useState<{ dcm_url: string[]; png_url: string }[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [needSave, setNeedSave] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imagesToEdit: { dcm_url: string[]; png_url: string }[] = [];

      acceptedFiles.forEach((file) => {
        if (file.name.endsWith(".dcm")) {
          const fileUrl = URL.createObjectURL(file);
          const previewUrl = "https://placehold.jp/128x128.png"; // Временная миниатюра
          imagesToEdit.push({ dcm_url: [fileUrl], png_url: previewUrl });
        }
        else if (file.name.endsWith(".zip")) {
          const fileUrl = URL.createObjectURL(file);
          const previewUrl = "https://placehold.jp/128x128.png"; // Временная миниатюра
          // @ts-ignore
          imagesToEdit.push({ dcm_url: fileUrl, png_url: previewUrl });
        } 
        else {
          dispatch(uploadFile(file))
            .unwrap()
            .then(() => {
              setUploadedFiles((prevFiles) => [...prevFiles, file]);
            })
            .catch((err) => console.error("Ошибка загрузки файла:", err));
        }
      });

      if (imagesToEdit.length > 0) {
        setEditorImages(imagesToEdit);
        setIsModalOpen(true); // Открываем модальное окно
      }
    },
    [dispatch, setUploadedFiles]
  );

  const closeModal = async () => {
    await handleSaveEditedFile()
    // Отправка отредактированных файлов на сервер
    const response = await axios.get(savedImageUrl!, { responseType: "blob" })
    const blob = response.data;
    const file = new File([blob], "img.png", { type: blob.type });

    dispatch(uploadFile(file))
      .unwrap()
      .then(() => {
        console.log(`Файл ${file.name} успешно загружен`);
      })
      .catch((err) => console.error("Ошибка загрузки файла:", err));

    setIsModalOpen(false);
  };

  const handleSaveEditedFile = async () => {
    setNeedSave(true);

    // Дождемся завершения операции сохранения
    await new Promise((resolve) => setTimeout(resolve, 100)); // Ожидаем обновления Redux
    console.log(savedImageUrl);

    setNeedSave(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="w-3/5 flex flex-col gap-4 p-4 bg-gray-100 rounded shadow">
      {/* Drag'n Drop интерфейс */}
      <div
        {...getRootProps({
          className: `border-dashed border-2 p-8 rounded ${isDragActive ? "bg-blue-100" : "bg-gray-50"}`,
        })}
        className="flex flex-col items-center justify-center text-gray-600 hover:bg-blue-50 transition-all"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Перетащите файлы сюда...</p>
        ) : (
          <p>Перетащите файлы сюда или нажмите, чтобы выбрать</p>
        )}
      </div>

      {/* Сообщение об ошибке */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Индикатор загрузки */}
      {loading && <p className="text-blue-500">Загрузка файлов...</p>}

      <div className="flex flex-col">
        {files.map((file, index) => (
          <FileItem key={index} file={file} index={index}/>
        ))}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="w-screen h-screen fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-full h-full bg-white relative">
            {/* Кнопка закрытия */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
            >
              Сохранить
            </button>
            {/* Контент модального окна */}
            {editorImages && (
              <MainWindow
                images={editorImages}
                needsave={needSave} // Callback для сохранения отредактированных файлов
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
