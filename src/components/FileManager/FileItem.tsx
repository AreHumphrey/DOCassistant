import { AppDispatch } from "@/stores/store";
import { FileData } from "@/types/File";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { changeSelection } from "@/stores/filesSlice"

interface FileItemProps {
  file: FileData
  exactFile?: File
  index?: number
}

export default function FileItem({ file, exactFile, index }: FileItemProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // Функция для скачивания файла
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = file.fileUrl!;
    link.download = file.filename;
    link.click();
  };

  // Открытие PDF в новой вкладке
  const openPDFInNewTab = () => {
    if (file.fileType === "application/pdf") {
      if (exactFile) {
        const pdfUrl = URL.createObjectURL(exactFile);
        window.open(pdfUrl, "_blank");
        URL.revokeObjectURL(pdfUrl); // Освобождаем память
      }
      else {
        fetch(file.fileUrl!)
          .then((res) => res.blob())
          .then((blob) => {
            const pdfUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            window.open(pdfUrl, "_blank");
            URL.revokeObjectURL(pdfUrl);
          });
      }
    }
  };

  // Открытие изображения в модальном окне

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Предпросмотр файла
  const previewFile = () => {
    if (file.fileType.startsWith("image/")) {
    } else if (file.fileType === "application/pdf") {
      openPDFInNewTab();
    } else {
      downloadFile();
    }
  };

  return (
    <div
      className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100" 
    >
      <div
      className="flex flex-row flex-grow items-center gap-2 p-2 border rounded-lg cursor-pointer" 
      onClick={previewFile}>
        {/* Отображение иконок для разных типов файлов */}
        {file.fileType.startsWith("image/") ? (
          <img
          src={exactFile ? URL.createObjectURL(exactFile) : file.fileUrl}
          alt={file.filename}
          className="w-12 h-12 object-cover rounded"
          onClick={() => setIsImageModalOpen(true)}
          />
        ) : file.fileType === "application/pdf" ? (
          <span className="text-2xl">📄</span>
        ) : (
          <span className="text-2xl">📁</span>
        )}

        {/* Имя файла */}
        <span className="text-sm font-medium">{file.filename}</span>
      </div>
      {index !== undefined && <input type="checkbox" className="size-6" checked={file.isSelected} 
      onChange={() => dispatch(changeSelection(index))}/>}

      {/* Модальное окно для изображений */}
      {isImageModalOpen && file.fileType.startsWith("image/") && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={exactFile ? URL.createObjectURL(exactFile) : file.fileUrl}
              alt={file.filename}
              className="max-w-full max-h-screen rounded-lg"
            />
            {/* Кнопка закрытия */}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-lg font-bold hover:bg-red-400"
              onClick={closeImageModal}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
