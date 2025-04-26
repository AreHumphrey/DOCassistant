import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { deleteDrug, clearDrugs } from "@/stores/drugSlice";

export default function DrugsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { choosenDrugsList } = useSelector((state: RootState) => state.drug);

  return (
    <div className="w-full flex justify-center">
      {choosenDrugsList.length > 0 ? (
        <div className="bg-gray-100 rounded-2xl p-6 flex flex-col gap-4 max-w-2xl w-full">
          {choosenDrugsList.map((drug, index) => (
            <div
            key={index}
            className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm"
          >
            <span className="text-gray-800 text-sm font-medium truncate">{drug}</span>
            <button
  onClick={() => dispatch(deleteDrug(index))}
  className="ml-4 w-7 h-7 rounded-full text-gray-400 bg-white font-bold flex items-center justify-center 
             hover:text-gray-600 transition-colors duration-200"
  style={{
    outline: "none",
    boxShadow: "none",
    border: "none",
  }}
  onFocus={(e) => {
    e.currentTarget.style.outline = "none";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.border = "none";
  }}
  onMouseDown={(e) => {
    e.preventDefault(); 
  }}
>
  ×
</button>




          </div>
          ))}

        <button
          onClick={() => dispatch(clearDrugs())}
          className="mt-2 px-6 py-2 rounded-full border-2 border-blue-500 text-gray-700 bg-gray-100 hover:bg-gray-200 transition w-fit"
        >
          Очистить список
        </button>

        </div>
      ) : (
        <p className="text-gray-500">Нет выбранных лекарств</p>
      )}
    </div>
  );
}
