import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "@/stores/store"
import { deleteDrug, clearDrugs } from "@/stores/drugSlice"


export default function DrugsList() {
    const dispatch = useDispatch<AppDispatch>()
    const { choosenDrugsList } = useSelector((state: RootState) => state.drug)


    return (
        <div className="p-4">
            {choosenDrugsList.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                    {choosenDrugsList.map((drug, index) => (
                        <div
                            key={index}
                            className="flex flex-row items-center p-2 border rounded shadow text-center bg-gray-100"
                        >
                            <span className="flex-grow">{drug}</span>
                            <button
                                onClick={() => dispatch(deleteDrug(index))}
                                className="text-xs text-red-500 font-bold hover:text-red-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button onClick={() => dispatch(clearDrugs())} 
                    className="p-2 border rounded shadow text-center bg-gray-100">
                        Отчистить
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">Нет выбранных лекарств</p>
            )}
        </div>
    );
}