import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { deleteDrug, clearDrugs } from "@/stores/drugSlice";

export default function DrugsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { choosenDrugsList } = useSelector((state: RootState) => state.drug);

  return (
    <div className="p-4 w-full flex justify-center">
      {choosenDrugsList.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl">
          {choosenDrugsList.map((drug, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2 min-w-[160px] bg-[#A5C1FF] text-white rounded-xl"
            >
              <span className="text-sm font-medium truncate">{drug}</span>
              <button
                onClick={() => dispatch(deleteDrug(index))}
                className="ml-3 w-6 h-6 rounded-full text-white font-bold flex items-center justify-center hover:bg-white hover:text-red-500 focus:outline-none transition"
              >
                ×
              </button>
            </div>
          ))}

        <button
            onClick={() => dispatch(clearDrugs())}
            className="px-5 py-2 min-w-[160px] bg-[#A5C1FF] text-white rounded-xl font-semibold hover:bg-[#0A57FF] focus:outline-none"
          >
            Очистить
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Нет выбранных лекарств</p>
      )}
    </div>
  );
}
