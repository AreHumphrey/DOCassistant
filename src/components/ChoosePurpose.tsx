import React from "react";

// Словари с тегами
const tags_dict = {
    "IODA": "1. Исследования опорно-двигательного аппарата",
    "IGK": "2. Исследования грудной клетки",
    "ISSS": "3. Исследования сердечно-сосудистой системы",
    "IOP": "4. Исследования органов пищеварения",
    "IMS": "5. Исследования мочевыводящей системы",
    "IGRS": "6. Исследования женской репродуктивной системы",
    "IMRS": "7. Исследования мужской репродуктивной системы",
    "IGMC": "8. Исследования головного мозга и черепа",
    "IZCLO": "9. Исследования зубов и челюстно-лицевой области",
    "MMM": "10. Маммография",
    "IPMTB": "11. Исследования плода и малого таза у беременных",
    "OST": "12. Остеоденситометрия",
    "IPD": "13. Интервенционные процедуры"
};

const car_tags_dict = {
    "EKG": "1. Электрокардиография (ЭКГ)",
    "HOLTM": "2. Холтеровское мониторирование",
    "SMAD": "3. Суточное мониторирование АД (СМАД)",
    "SPIRO": "4. Спирометрия",
    "USI": "5. Ультразвуковая диагностика (УЗИ)",
    "EEG": "6. Электроэнцефалография (ЭЭГ)",
    "REG": "7. Реоэнцефалография (РЭГ)",
    "VELO": "8. Велоэргометрия и тредмил-тест"
};

// Интерфейс для пропсов
interface ChoosePurposeProps {
    type: string; // Тип словаря ('RAD' или 'CAR')
    setPurpose: (purpose: string) => void; // Функция для установки выбранного значения
}

// Компонент для выбора цели
export default function ChoosePurpose({ type, setPurpose }: ChoosePurposeProps) {
    // Выбор словаря в зависимости от типа
    const dictionary = type === "RAD" ? tags_dict : car_tags_dict;

    // Обработчик изменения значения в выпадающем списке
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedKey = event.target.value;
        setPurpose(selectedKey); // Передаем выбранный ключ через setPurpose
    };

    return (
        <div>
            <h3>Выберите обалсть обследования:</h3>
            <select onChange={handleChange}>
                <option value="">-- Выберите обалсть обследования --</option>
                {Object.entries(dictionary).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
}