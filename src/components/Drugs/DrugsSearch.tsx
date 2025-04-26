import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { addDrug, getDrugs } from "@/stores/drugSlice";
import { useEffect, useState, useRef } from "react";
import { Drug } from "@/types/Drug";

export default function DrugsSearch() {
  const dispatch = useDispatch<AppDispatch>();
  const { drugsList, error, loading } = useSelector((state: RootState) => state.drug);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(getDrugs());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = drugsList.filter((drug) =>
        drug.drug_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDrugs(filtered);
    } else {
      setFilteredDrugs(drugsList);
    }
  }, [searchTerm, drugsList]);

  const handleInputClick = () => {
    setIsDropdownVisible(true);
  };

  const handleSelectDrug = (drugName: string) => {
    setSearchTerm(drugName);
    setIsDropdownVisible(false);
    inputRef.current?.focus();
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".drugs-search")) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleAdd = () => {
    if (searchTerm) {
      dispatch(addDrug(searchTerm));
      setSearchTerm("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="relative w-full">
       <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-6 px-10">Введите название препарата</h2>
      <div className="flex flex-row gap-3 shadow-none ring-0 outline-none border-none after:shadow-none before:shadow-none">

     
            <input
        ref={inputRef}
        type="text"
        placeholder="Введите название лекарства..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={handleInputClick}
        onKeyDown={handleKeyPress}
        className="w-full px-5 py-3 border-2 border-[#0A57FF] text-black rounded-full placeholder-gray-500 focus:outline-none focus:border-[3px] focus:border-[#0A57FF] focus:ring-0 focus:shadow-none shadow-none drugs-search transition"
        />


        <button
          onClick={handleAdd}
          disabled={loading}
          className="px-6 py-3 bg-[#0A57FF] text-white font-semibold rounded-full hover:bg-blue-700 transition focus:outline-none"
        >
          Добавить
        </button>
      </div>

      {isDropdownVisible && !error && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto z-10">
          {filteredDrugs.map((drug, index) => (
            <li
              key={index}
              onClick={() => handleSelectDrug(drug.drug_name)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {drug.drug_name}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="absolute top-full left-0 w-full mt-2 p-2 bg-red-100 text-red-500 border border-red-300 rounded shadow">
          Ошибка загрузки списка лекарств
        </p>
      )}
    </div>
  );
}
