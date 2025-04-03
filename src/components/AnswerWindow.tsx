import ReactMarkdown from "react-markdown";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

interface AnswerWindowProps {
  uid: string;
  pid: number | null;
}

export default function AnswerWindow({ uid, pid }: AnswerWindowProps) {
  const { answer, loading } = useSelector((state: RootState) => state.ai);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer).then(
      () => alert("Текст скопирован!"),
      () => alert("Ошибка копирования!")
    );
  };

  const downloadPDF = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "/api/generate-pdf",
      { uid: uid, pid: pid },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const generatePDF = async () => {
    try {
      const url = await downloadPDF();
      const link = document.createElement("a");
      link.href = url;
      link.download = `${uid}.pdf`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.removeChild(link);
    } catch (err: any) {
      console.log(err);
    }
  };

  const printPDF = async () => {
    const url = await downloadPDF();
    const pdfWindow = window.open(url, "_blank");

    if (!pdfWindow) {
      alert("Не удалось открыть окно для печати.");
      return;
    }

    setTimeout(() => {
      pdfWindow.print();
    }, 1000);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full px-2 sm:px-6 flex flex-col p-4 border-[3px] border-[#367DFF] rounded-lg">
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={copyToClipboard}
          disabled={loading}
          className="px-5 py-2 bg-[#A4C1FF] text-white rounded-full font-semibold 
            transition hover:ring-2 hover:ring-[#0A57FF]  hover:bg-[#0A57FF]  focus:bg-[#0A57FF]
            focus:ring-2 focus:ring-[#0A57FF] focus:outline-none"
        >
          Копировать
        </button>
        <button
          onClick={printPDF}
          disabled={loading}
          className="px-5 py-2 bg-[#A4C1FF] text-white rounded-full font-semibold 
            transition hover:ring-2 hover:ring-[#0A57FF] hover:bg-[#0A57FF]  focus:bg-[#0A57FF]
            focus:ring-2 focus:ring-[#0A57FF] focus:outline-none"
        >
          Печать
        </button>
        <button
          onClick={generatePDF}
          disabled={loading}
          className="px-5 py-2 bg-[#A4C1FF] text-white rounded-full font-semibold 
            transition hover:ring-2 hover:ring-[#0A57FF] hover:bg-[#0A57FF]  focus:bg-[#0A57FF]
            focus:ring-2 focus:ring-[#0A57FF] focus:outline-none"
        >
          PDF
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-44">
          <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
        </div>
      ) : (
        <div className="w-full p-4 bg-white border rounded-lg h-44 overflow-y-auto text-left text-black">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
