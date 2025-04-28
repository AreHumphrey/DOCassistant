import { useState, useRef } from "react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackText, setFeedbackText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    console.log("Текст:", feedbackText);
    console.log("Файлы:", files);
    onClose();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-2xl shadow-2xl p-10 w-[95%] max-w-[900px] max-h-[90vh] overflow-auto">
        
        {/* Крестик закрытия */}
        <button
        onClick={onClose}
        className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center rounded-full bg-white text-blue-600 text-4xl font-bold border-none outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-white active:outline-none active:ring-0"
        >
        ×
        </button>



        <h2 className="text-3xl font-bold text-center mb-8">Обратная связь</h2>

        <div className="flex flex-col gap-6">
          
          {/* Поле ввода текста */}
          <div>
            <label className="block text-lg font-semibold mb-2">Опишите проблему</label>
            <textarea
              className="border-2 border-blue-500 rounded-2xl p-5 h-40 resize-none w-full text-lg"
              placeholder="Введите текст..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>

          {/* Загрузка файлов */}
          <div>
            <label className="block text-lg font-semibold mb-2">Загрузите снимки (необязательно)</label>
            
            {/* Скрытый input file */}
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />

            {/* Красивая кнопка для выбора файлов */}
            <button
              type="button"
              onClick={openFileDialog}
              className="px-20 py-2 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none"
            >
              Выбрать файлы
            </button>

            {/* Показ выбранных файлов */}
            {files.length > 0 && (
              <div className="mt-3 text-gray-600 text-sm">
                {files.map((file, index) => (
                  <div key={index}>{file.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопка отправки */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="px-10 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 text-lg focus:outline-none"
            >
              Отправить
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
