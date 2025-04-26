import React from "react";

// Словари
const tags_dict = {
  IODA: "1. Исследования опорно-двигательного аппарата",
  IGK: "2. Исследования грудной клетки",
  ISSS: "3. Исследования сердечно-сосудистой системы",
  IOP: "4. Исследования органов пищеварения",
  IMS: "5. Исследования мочевыводящей системы",
  IGRS: "6. Исследования женской репродуктивной системы",
  IMRS: "7. Исследования мужской репродуктивной системы",
  IGMC: "8. Исследования головного мозга и черепа",
  IZCLO: "9. Исследования зубов и челюстно-лицевой области",
  MMM: "10. Маммография",
  IPMTB: "11. Исследования плода и малого таза у беременных",
  OST: "12. Остеоденситометрия",
  IPD: "13. Интервенционные процедуры",
};

const car_tags_dict = {
  EKG: "1. Электрокардиография (ЭКГ)",
  HOLTM: "2. Холтеровское мониторирование",
  SMAD: "3. Суточное мониторирование АД (СМАД)",
  SPIRO: "4. Спирометрия",
  USI: "5. Ультразвуковая диагностика (УЗИ)",
  EEG: "6. Электроэнцефалография (ЭЭГ)",
  REG: "7. Реоэнцефалография (РЭГ)",
  VELO: "8. Велоэргометрия и тредмил-тест",
};

interface ChoosePurposeProps {
  type: string;
  setPurpose: (purpose: string) => void;
}

export default function ChoosePurpose({ type, setPurpose }: ChoosePurposeProps) {
  const dictionary = type === "RAD" ? tags_dict : car_tags_dict;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = event.target.value;
    setPurpose(selectedKey);
  };

  return (
    <div className="w-full px-10">
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">
        Выберите область обследования:
      </h2>

      <div className="bg-[#F4F4F4] rounded-xl p-4">
        <select
          onChange={handleChange}
          className="w-full p-3 bg-[#F4F4F4] rounded-lg border-none focus:outline-none text-gray-700"
        >
          <option value="">-- Выберите область обследования --</option>
          {Object.entries(dictionary).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
