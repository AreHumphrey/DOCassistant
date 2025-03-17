import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SavedPrompt } from "@/types/SavedPrompt";
import { Ananmnes } from "@/types/Anamnes";

// Асинхронное действие для получения анамнеза по uid
export const fetchAnamneseByUid = createAsyncThunk(
  "anamnes/fetchAnamnese",
  async (uid: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/anamnes/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // возвращаем анамнез
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка загрузки анамнеза"
      );
    }
  }
);

export const fetchSavedPromptById = createAsyncThunk(
  "savedPrompts/fetchSavedPromptId",
  async (pid: number, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/saved_prompts/pid/${pid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.saved_prompts)
      return response.data; // возвращаем список сохранённых промптов
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка загрузки сохранённых промптов"
      );
    }
  }
);

// Асинхронное действие для получения сохранённых промптов по uid
export const fetchSavedPromptsByUid = createAsyncThunk(
  "savedPrompts/fetchSavedPromptsUid",
  async (uid: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/saved_prompts/query?uid=${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.saved_prompts; // возвращаем список сохранённых промптов
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка загрузки сохранённых промптов"
      );
    }
  }
);

export const fetchSavedPromptsByUidPurpose = createAsyncThunk(
  "savedPrompts/fetchSavedPromptsPurpose",
  async (data: {uid: string, purpose: string}, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/saved_prompts/query?uid=${data.uid}&purpose=${data.purpose}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.saved_prompts; // возвращаем список сохранённых промптов
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Ошибка загрузки сохранённых промптов"
      );
    }
  }
);

interface SavedPromptState {
  anamnes: Ananmnes | null;
  savedPromptsList: SavedPrompt[];
  loading: boolean;
  error: string | null;
}

const initialState: SavedPromptState = {
  anamnes: null,
  savedPromptsList: [],
  loading: false,
  error: null,
};

const savedPromptsSlice = createSlice({
  name: "saved_prompts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка загрузки анамнеза
      .addCase(fetchAnamneseByUid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnamneseByUid.fulfilled, (state, action: PayloadAction<Ananmnes>) => {
        state.loading = false;
        state.anamnes = action.payload;
      })
      .addCase(fetchAnamneseByUid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка загрузки сохранённых промптов
      .addCase(fetchSavedPromptsByUid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPromptsByUid.fulfilled, (state, action: PayloadAction<SavedPrompt[]>) => {
        state.loading = false;
        state.savedPromptsList = action.payload;
      })
      .addCase(fetchSavedPromptsByUid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка загрузки сохранённых промптов с purpose
      .addCase(fetchSavedPromptsByUidPurpose.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPromptsByUidPurpose.fulfilled, (state, action: PayloadAction<SavedPrompt[]>) => {
        state.loading = false;
        state.savedPromptsList = action.payload;
      })
      .addCase(fetchSavedPromptsByUidPurpose.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработка загрузки сохранённых промптов с pid
      .addCase(fetchSavedPromptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPromptById.fulfilled, (state, action: PayloadAction<SavedPrompt>) => {
        state.loading = false;
        state.savedPromptsList.push(action.payload);
      })
      .addCase(fetchSavedPromptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { } = savedPromptsSlice.actions;
export default savedPromptsSlice.reducer;
