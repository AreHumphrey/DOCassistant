import { FileData } from "@/types/File";
import { useState } from "react";

interface FileViewProps {
    file: FileData
}

export default function FileView({file}: FileViewProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
        fetch(file.fileUrl!)
          .then((res) => res.blob())
          .then((blob) => {
            const pdfUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
            window.open(pdfUrl, "_blank");
            URL.revokeObjectURL(pdfUrl);
        });
      }
    }

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
        <div>
            {file.fileType.startsWith("image/") ? (
                <img
                src={file.fileUrl}
                alt={file.filename}
                className="w-12 h-12 object-cover rounded"
                onClick={() => setIsImageModalOpen(true)}
                />
              ) : file.fileType === "application/pdf" ? (
                <span className="text-2xl" onClick={() => previewFile()}>📄</span>
              ) : (
                <span className="text-2xl">📁</span>
            )}

            {/* Модальное окно для изображений */}
            {isImageModalOpen && file.fileType.startsWith("image/") && (
            <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
            onClick={closeImageModal}
            >
                <div className="relative max-w-full max-h-full">
                    <img
                    src={file.fileUrl}
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