import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { RootState, AppDispatch } from "@/stores/store";
import { uploadFile } from "@/stores/filesSlice";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileItem from "@/components/FileManager/FileItem";
// @ts-ignore
import MainWindow from "@/components/ImageEditorPlugin/MainWindow.jsx";

import BlueBackgroundSVG from '@/images/bg_ramka.svg';
import PdfIcon from '@/images/icon__pdf.svg';
import DocIcon from '@/images/icon__doc.svg';
import TxtIcon from '@/images/icon__txt.svg';
import XlsIcon from '@/images/icon__xls.svg';

export default function FilesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { files, error, loading } = useSelector((state: RootState) => state.files);
  const { anamnes } = useSelector((state: RootState) => state.anamnes);
  const { savedImageUrl } = useSelector((state: RootState) => state.editor);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editorImages, setEditorImages] = useState<{ dcm_url: string[]; png_url: string }[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [needSave, setNeedSave] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const uidFromRedux = anamnes?.uid;
    const uidFromUrl = searchParams.get("uid");

    if (!localStorage.getItem("uid") && uidFromRedux) {
      localStorage.setItem("uid", uidFromRedux);
    }

    if (!localStorage.getItem("uid") && uidFromUrl) {
      localStorage.setItem("uid", uidFromUrl);
    }

    if (!localStorage.getItem("ai")) {
      localStorage.setItem("ai", "far");
    }
  }, [anamnes]);

  // ✅ Редирект если ai === 'far' или 'ans'
  useEffect(() => {
    const ai = localStorage.getItem("ai");
    const uid = localStorage.getItem("uid");
    if ((ai === "far" || ai === "ans") && uid) {
      navigate(`/ai/${ai}?uid=${uid}`);
    }
  }, []);

  const handleContinue = () => {
    const selectedFiles = files.filter((file) => file.isSelected);
    localStorage.setItem("selectedFiles", JSON.stringify(selectedFiles));

    const uid = localStorage.getItem("uid");
    const ai = localStorage.getItem("ai");

    if (!uid || !ai) {
      console.error("UID или AI не указаны. Перенаправление невозможно.");
      alert("Ошибка: не удалось определить пользователя или раздел назначения.");
      return;
    }

    navigate(`/ai/${ai}?uid=${uid}`);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imagesToEdit: { dcm_url: string[]; png_url: string }[] = [];

      acceptedFiles.forEach((file) => {
        if (file.name.endsWith(".dcm") || file.name.endsWith(".zip")) {
          const fileUrl = URL.createObjectURL(file);
          const previewUrl = "https://placehold.jp/128x128.png";
          imagesToEdit.push({ dcm_url: [fileUrl], png_url: previewUrl });
        } else {
          dispatch(uploadFile(file))
            .unwrap()
            .then(() => {
              setUploadedFiles((prev) => [...prev, file]);
            })
            .catch((err) => console.error("Ошибка загрузки файла:", err));
        }
      });

      if (imagesToEdit.length > 0) {
        setEditorImages(imagesToEdit);
        setIsModalOpen(true);
      }
    },
    [dispatch]
  );

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onDrop(files);
  };

  const closeModal = async () => {
    await handleSaveEditedFile();
    const response = await axios.get(savedImageUrl!, { responseType: "blob" });
    const blob = response.data;
    const file = new File([blob], "img.png", { type: blob.type });

    dispatch(uploadFile(file))
      .unwrap()
      .then(() => console.log(`Файл ${file.name} успешно загружен`))
      .catch((err) => console.error("Ошибка загрузки файла:", err));

    setIsModalOpen(false);
  };

  const handleSaveEditedFile = async () => {
    setNeedSave(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setNeedSave(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-white">
      <Header />

      <main className="flex flex-col items-center justify-center flex-grow px-2 sm:px-4 py-10">
        {anamnes && (
          <div className="w-full max-w-5xl mb-10">
            <p className="text-4xl sm:text-6xl font-extrabold text-left text-black mb-4">{anamnes.uid}</p>
            <p className="text-lg text-left text-black">
              {anamnes.fio} / {anamnes.birthday.split("-")[0]} / {new Date().getFullYear() - parseInt(anamnes.birthday.split("-")[0])} лет / {anamnes.anamnes}
            </p>
          </div>
        )}

        <div className="relative w-full max-w-6xl mb-16 sm:rounded-[24px] mx-auto">
          <img src={BlueBackgroundSVG} alt="Background" className="w-full h-full object-cover rounded-2xl sm:min-h-[320px] min-h-[450px]" />
          <div {...getRootProps()} className="absolute inset-0 flex flex-col justify-center items-center text-black px-4 text-center py-20 sm:py-24">
            <input {...getInputProps()} multiple />
            <p className="text-xl md:text-2xl font-semibold max-w-2xl">
              Перетащите файлы со снимками в формате:<br />DICOM, JPG, PNG. Не более 60 файлов
            </p>
            <span className="text-blue-500 text-xl mt-4 font-semibold">
              или загрузите файлы/папки
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onDrop(files);
              }}
            />
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 flex-wrap max-w-full sm:scale-110">
              <img src={PdfIcon} alt="PDF" className="w-10 h-10 sm:w-14 sm:h-14" />
              <img src={DocIcon} alt="DOC" className="w-10 h-10 sm:w-14 sm:h-14" />
              <img src={TxtIcon} alt="TXT" className="w-10 h-10 sm:w-14 sm:h-14" />
              <img src={XlsIcon} alt="XLS" className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl flex flex-col items-start px-2 sm:px-4">
          {error && <p className="text-red-500 text-left w-full">{error}</p>}
          {loading && <p className="text-blue-500 text-left w-full">Загрузка файлов...</p>}

          <div className="flex flex-col w-full">
            {files.map((file, index) => (
              <FileItem key={index} file={file} index={index} />
            ))}
          </div>

          <div className="w-full flex justify-center sm:justify-start">
            <button
              onClick={handleContinue}
              className="mt-10 bg-[#0A57FF] text-white py-3 px-12 rounded-full text-lg font-semibold hover:bg-blue-700"
            >
              Далее
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-4 text-left w-full">
            Если в карточке уже были какие-то данные, то они будут располагаться ниже.
          </p>
        </div>
      </main>

      {isModalOpen && (
        <div className="w-screen h-screen fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-full h-full bg-white relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500 font-bold text-xl hover:text-red-700"
            >
              Сохранить
            </button>
            {editorImages && (
              <MainWindow images={editorImages} needsave={needSave} />
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
