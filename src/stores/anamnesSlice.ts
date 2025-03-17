import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Ananmnes } from "@/types/Anamnes";

// Асинхронное действие для получения списка анамнезов
export const getAnamnesFromFile = createAsyncThunk("anamnes/getAnamnesFromFile", async (
  { file, onProgress }: { file: File; onProgress: (progress: number) => void },
  thunkAPI
) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("/api/anamnes/from-file", formData, {
      headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
          );
          onProgress(percentCompleted); // Обновление прогресса
      },
    })

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data || "Ошибка загрузки мед карты");
  }
});

export const updateAnamnes = createAsyncThunk("anamnes/updateAnamnes", async (anamnes: Ananmnes, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(`/api/anamnes/${anamnes.uid}`,
      {
        fio: anamnes.fio,
        birthday: anamnes.birthday,
        scan_date: anamnes.scan_date,
        anamnes: anamnes.anamnes,
      },
      {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue("Ошибка обновления анамнеза");
  }
})

interface AnamnesState {
  anamnes: Ananmnes | null
  loading: boolean;
  error: string | null;
}

const initialState: AnamnesState = {
  anamnes: null,
  loading: false,
  error: null,
};

const anamnesSlice = createSlice({
  name: "anamnes",
  initialState,
  reducers: {
    addAnamnes(state, action: PayloadAction<Ananmnes>) {
      state.anamnes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAnamnesFromFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnamnesFromFile.fulfilled, (state, action) => {
        state.loading = false;
        state.anamnes = action.payload;
      })
      .addCase(getAnamnesFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAnamnes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAnamnes.fulfilled, (state, action) => {
        state.loading = false;
        state.anamnes = action.payload;
      })
      .addCase(updateAnamnes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { addAnamnes } = anamnesSlice.actions;
export default anamnesSlice.reducer;
