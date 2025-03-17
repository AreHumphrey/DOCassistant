import { Drug } from "@/types/Drug";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface DrugState {
    drugsList: Drug[];
    choosenDrugsList: string[];
    loading: boolean;
    error: string | null;
}

const initialState: DrugState = {
    drugsList: [],
    choosenDrugsList: [],
    loading: false,
    error: null
}

export const getDrugs = createAsyncThunk(
    "drug/getDrugs",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api/drugs", {
                headers: {Authorization: `Bearer ${token}`}
            })

            console.log(response.data)
            return response.data
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue(
                        error.response?.data?.detail || "Ошибка выполнения запроса"
                    )
        }
    }
)

const drugSlice = createSlice({
    name: "drug",
    initialState,
    reducers: {
        addDrug(state, action: PayloadAction<string>) {
            state.choosenDrugsList.push(action.payload)
        },
        deleteDrug(state, action: PayloadAction<number>) {
            state.choosenDrugsList = state.choosenDrugsList.filter((_, index) => {index !== action.payload})
        },
        clearDrugs(state) {
            state.choosenDrugsList = []
        }
    },
    extraReducers: (builder) => {
        builder
        
        .addCase(getDrugs.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(getDrugs.fulfilled, (state, action) => {
            state.loading = false
            state.drugsList = action.payload as Drug[]
        })
        .addCase(getDrugs.rejected, (state, action) => {
            state.loading = false
            state.error = action.error as string
        })
    },
})

export const { addDrug, deleteDrug, clearDrugs } = drugSlice.actions;
export default drugSlice.reducer;