import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Breadcrumbs from "@/components/Breadcrumbs";


import { RootState, AppDispatch } from "@/stores/store";
import { addAnamnes, getAnamnesFromFile } from "@/stores/anamnesSlice";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import BlueBackgroundSVG from '@/images/bg_ramka.svg';
import PdfIcon from '@/images/icon__pdf.svg';
import DocIcon from '@/images/icon__doc.svg';
import TxtIcon from '@/images/icon__txt.svg';
import XlsIcon from '@/images/icon__xls.svg';

export default function AnamnesesPage() {
  const [fio, setFio] = useState("");
  const [lastname, setLastname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [birthday, setBirthday] = useState("");
  const [scanDate, setScanDate] = useState("");
  const [anamnes, setAnamnes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { anamnes: anamnesState } = useSelector((state: RootState) => state.anamnes);

  const fileInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    const ai = localStorage.getItem("ai");
    const uid = localStorage.getItem("uid");

    if (ai === "ans" && uid) {
      navigate(`/ai/ans?uid=${uid}`);
    }
  }, [navigate]);
  
  useEffect(() => {
    if (anamnesState) {
      const fioParts = (anamnesState.fio || '').split(" ");
      setLastname(fioParts[0] || "");
      setFio(fioParts[1] || "");
      setPatronymic(fioParts[2] || "");
      setBirthday(anamnesState.birthday || "");
      setScanDate(anamnesState.scan_date || "");
      setAnamnes(anamnesState.anamnes || "");
  
      // Перенаправление если карточка пустая
      if (
        !anamnesState.fio &&
        !anamnesState.birthday &&
        !anamnesState.scan_date &&
        !anamnesState.anamnes
      ) {
        const uid = anamnesState.uid;
        if (uid) {
          navigate(`/ai/ans?uid=${uid}`);
        }
      }
    }
  }, [anamnesState, navigate]);
  
  

  const isValidDate = (dateStr: string, allowToday = false) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yearStr = dateStr.split("-")[0];
    const year = parseInt(yearStr);

    if (isNaN(date.getTime()) || !/^\d{4}$/.test(yearStr) || year < 1900 || year > now.getFullYear() + 1) {
      return false;
    }

    if (allowToday) {
      return date <= now;
    }

    return date < now;
  };

  const handleSubmit = async () => {
    if (!fio && !lastname && !patronymic && !birthday && !scanDate && !anamnes && anamnesState) {
      navigate("/files");
      return;
    }

    if (!isValidDate(birthday)) {
      setError("Введите корректную дату рождения. Она не может быть в будущем.");
      return;
    }
    if (!isValidDate(scanDate, true)) {
      setError("Введите корректную дату снимка. Она не может быть в будущем.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post('/api/anamnes', {
        fio: `${lastname} ${fio} ${patronymic}`.trim(),
        birthday,
        scan_date: scanDate,
        anamnes
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedAnamnes = {
        ...response.data,
        birthday: response.data.birthday,
        scan_date: response.data.scan_date,
      };

      dispatch(addAnamnes(updatedAnamnes));
      localStorage.setItem("uid", updatedAnamnes.uid);
      setError("");
      setShowCard(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при отправке анамнеза. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    setUploadStatus("idle");

    dispatch(
      getAnamnesFromFile({
        file,
        onProgress: (progress: number) => setUploadProgress(progress),
      })
    )
      .unwrap()
      .then((parsed) => {
        setUploadStatus("success");
        setShowCard(true);

        if (parsed.fio) {
          const fioParts = parsed.fio.split(" ");
          setLastname(fioParts[0] || "");
          setFio(fioParts[1] || "");
          setPatronymic(fioParts[2] || "");
        }
        setBirthday(parsed.birthday || "");
        setScanDate(parsed.scan_date || "");
        setAnamnes(parsed.anamnes || "");
      })
      .catch(() => {
        setUploadStatus("error");
        setShowCard(false);
      });
  };

  const handleDelete = () => {
    localStorage.removeItem("uid");
    setShowCard(false);
  };

  const getBreadcrumbs = () => {
    const ai = localStorage.getItem("ai");
  
    const directions: Record<string, { label: string; path: string }> = {
      lab: { label: "Расшифровка лаб. анализов", path: "/ai/lab" },
      rad: { label: "Лучевая диагностика", path: "/ai/rad" },
      far: { label: "Совместимость лекарств", path: "/ai/far" },
      car: { label: "ЭКГ", path: "/ai/car" },
      ans: { label: "Спроси сейчас", path: "/ai/ans" },
    };
  
    const currentDirection = directions[ai || ""];
  
    if (!currentDirection) {
      return [{ label: "Создание карты пациента" }];
    }
  
    return [
      { label: currentDirection.label, path: currentDirection.path },
      { label: "Создание карты пациента" },
    ];
  };
  

  const handleNext = () => {
    navigate("/files");
  };


  return (
    <div className="min-h-screen w-screen overflow-x-hidden flex flex-col bg-white">
      <Header />

      <Breadcrumbs items={getBreadcrumbs()} />

      <main className="flex flex-col items-center justify-center flex-grow px-4 py-10">
        {/* Синий SVG блок */}
        <div className="relative w-full max-w-5xl mb-16 sm:rounded-[24px]">
          <img src={BlueBackgroundSVG} alt="Background" className="w-full h-full object-cover rounded-xl sm:min-h-[320px] min-h-[450px] rounded-2xl" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-black px-4 text-center py-20 sm:py-24">
            <p className="text-xl md:text-2xl font-semibold max-w-2xl">
              Для автоматического создания карточки пациента<br />
              перетащите сюда файл с историей болезни<br />
              в формате: <strong>PDF, DOC, TXT, XLS</strong>.
            </p>
            <a
              href="#"
              className="text-blue-500 underline text-xl mt-4 hover:font-semibold active:font-semibold"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              или загрузите файл
            </a>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 flex-wrap max-w-full sm:scale-110">
              <img src={PdfIcon} alt="PDF" className="w-10 h-10 sm:w-14 sm:h-14" />
              <img src={DocIcon} alt="DOC" className="w-10 h-10 sm:w-14 sm:h-14" />
              <img src={TxtIcon} alt="TXT" className="w-10 h-10 sm:w-14 sm:h-14" />
              <img src={XlsIcon} alt="XLS" className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>
            {uploadProgress !== null && (
              <p className="text-blue-600 mt-4">Загружено {uploadProgress}%</p>
            )}
            {uploadStatus === "success" && (
              <p className="text-green-600 mt-2">Файл успешно загружен</p>
            )}
            {uploadStatus === "error" && (
              <p className="text-red-600 mt-2">Ошибка загрузки файла</p>
            )}
          </div>
        </div>

        {/* Поля формы */}
        {/* Поля формы */}
<section className="w-full max-w-5xl bg-white px-2">
  <p className="text-lg font-semibold text-black mb-2">Создание карточки пациента</p>
  <h2 className="text-4xl font-extrabold mb-10 text-black">Данные пациента</h2>

  <div className="flex flex-wrap gap-6 mb-6 w-full">
    <input
      placeholder="Имя"
      className="flex-1 min-w-[250px] rounded-full border-[2.5px] border-blue-500 px-6 py-3 text-black font-bold placeholder-black"
      value={fio}
      onChange={(e) => setFio(e.target.value)}
    />
    <input
      placeholder="Фамилия"
      className="flex-1 min-w-[250px] rounded-full border-[2.5px] border-blue-500 px-6 py-3 text-black font-bold placeholder-black"
      value={lastname}
      onChange={(e) => setLastname(e.target.value)}
    />
    <input
      placeholder="Отчество"
      className="flex-1 min-w-[250px] rounded-full border-[2.5px] border-blue-500 px-6 py-3 text-black font-bold placeholder-black"
      value={patronymic}
      onChange={(e) => setPatronymic(e.target.value)}
    />
    <input
      type="text"
      placeholder="Дата рождения"
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => e.target.value === "" && (e.target.type = "text")}
      className="flex-1 min-w-[250px] rounded-full border-[2.5px] border-blue-500 px-6 py-3 text-black font-bold placeholder-black"
      value={birthday}
      onChange={(e) => setBirthday(e.target.value)}
    />
    <input
      type="text"
      placeholder="Дата снимка"
      onFocus={(e) => (e.target.type = "date")}
      onBlur={(e) => e.target.value === "" && (e.target.type = "text")}
      className="flex-1 min-w-[250px] rounded-full border-[2.5px] border-blue-500 px-6 py-3 text-black font-bold placeholder-black"
      value={scanDate}
      onChange={(e) => setScanDate(e.target.value)}
    />
    <input
      placeholder="Заметки"
      className="flex-1 min-w-[250px] rounded-full border-[2.5px] border-blue-500 px-6 py-3 text-black font-bold placeholder-black"
      value={anamnes}
      onChange={(e) => setAnamnes(e.target.value)}
    />
  </div>

  {error && <p className="text-red-500 text-xl mb-4">{error}</p>}

  <div className="flex justify-start">
    <button
      className="bg-blue-600 text-white py-3 px-10 w-full md:w-[300px] rounded-full text-lg font-medium hover:bg-blue-700 text-left"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? "Сохранение..." : "Создать"}
    </button>
  </div>

  {showCard && anamnesState && (
    <div className="mt-10 w-full flex flex-col items-center">
      <div className="border-[2.5px] border-blue-500 bg-white rounded-[24px] px-10 py-8 text-left text-black w-full max-w-3xl bg-blue-100">
        <p className="text-xl font-bold mb-2">{anamnesState.fio}</p>
        <p className="text-md mb-1">Дата рождения: {anamnesState.birthday}</p>
        <p className="text-md mb-1">Дата снимка: {anamnesState.scan_date}</p>
        <p className="text-md mb-2">Заметки: {anamnesState.anamnes}</p>
        <button
          onClick={handleDelete}
          className="mt-4 bg-[#FE7678] text-white px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90"
        >
          Удалить
        </button>
      </div>

      <button
        onClick={handleNext}
        className="mt-6 bg-[#0A57FF] text-white py-3 px-12 rounded-full text-lg font-semibold hover:bg-blue-700"
      >
        Далее
      </button>
    </div>
  )}

  <div className="mt-24"></div>
</section>

      </main>

      <Footer />
    </div>
  );
}