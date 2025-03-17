import { AppDispatch, RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { addDrug, getDrugs } from "@/stores/drugSlice";
import { useEffect, useState, useRef } from "react";
import { Drug } from "@/types/Drug";

export default function DrugsSearch() {
    const dispatch = useDispatch<AppDispatch>();
    const { drugsList, error, loading } = useSelector((state: RootState) => state.drug);

    const [searchTerm, setSearchTerm] = useState(""); // Текущий текст поиска
    const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]); // Отфильтрованные лекарства
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Видимость списка

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        dispatch(getDrugs());
    }, [dispatch]);

    useEffect(() => {
        // Фильтруем список лекарств на основе введенного текста
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
        // Показать список при клике
        setIsDropdownVisible(true);
    };

    const handleSelectDrug = (drugName: string) => {
        setSearchTerm(drugName); // Установить выбранное лекарство в строку поиска
        setIsDropdownVisible(false); // Скрыть список
        inputRef.current?.focus()
    };

    const handleOutsideClick = (event: MouseEvent) => {
        // Скрыть список при клике вне компонента
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
            dispatch(addDrug(searchTerm))
            setSearchTerm("")
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleAdd(); // Добавить лекарство при нажатии Enter
        }
    };

    return (
        <div className="relative w-full">
            <div className="flex flex-row">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Введите название лекарства..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={handleInputClick}
                    onKeyDown={handleKeyPress}
                    className="w-full flex-grow p-2 border border-gray-300 rounded shadow drugs-search"
                />
                <button onClick={handleAdd} disabled={loading}>Добавить</button>
            </div>
            {/* Отображаем выпадающий список */}
            {isDropdownVisible && !error && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto z-10">
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
            {/* Отображаем сообщение об ошибке */}
            {error && (
                <p className="absolute top-full left-0 w-full p-2 bg-red-100 text-red-500 border border-red-300 rounded shadow">
                    Ошибка загрузки списка лекарств
                </p>
            )}
        </div>
    );
}
