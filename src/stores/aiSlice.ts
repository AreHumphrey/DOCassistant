import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AiState {
    prompt: string | null;
    answer: string;
    thread_id: string;
    saved_prompt_id: number | null;
    loading: boolean;
    error: string | null;
}

const initialState: AiState = {
    prompt: null,
    answer: "",
    thread_id: "",
    saved_prompt_id: null,
    loading: false,
    error: null,
};

// Асинхронный thunk для запроса к API
export const generateAssistant = createAsyncThunk(
    "ai/generateAssistant",
    async (data: { uid: string; filenames?: string[]; prompt: string; purpose: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            console.log(data.filenames)
            console.log(data.prompt)
            console.log(data.purpose)
            const response = await axios.post(
                `/api/generate-assistant?uid=${data.uid}`,
                {
                    filenames: data.filenames,
                    prompt: data.prompt,
                    purpose: data.purpose,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log(response.data)
            return {
                answer: response.data.answer,
                thread_id: response.data.thread_id,
                saved_prompt_id: response.data.saved_prompt_id
            }; // Ответ API
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.detail || "Ошибка выполнения запроса"
            );
        }
    }
);

export const continueAssistant = createAsyncThunk(
    "ai/continueAssistant",
    async (data: { uid: string; filenames?: string[]; prompt: string; purpose: string, thread_id: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `/api/additional-question?uid=${data.uid}`,
                {
                    filenames: data.filenames,
                    prompt: data.prompt,
                    purpose: data.purpose,
                    thread_id: data.thread_id
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return {
                answer: response.data.answer,
                thread_id: response.data.thread_id,
                saved_prompt_id: response.data.saved_prompt_id
            }; // Ответ API
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.detail || "Ошибка выполнения запроса"
            );
        }
    }
);

export const drugsAssistant = createAsyncThunk(
    "ai/drugsAssistant",
    async (data: {uid: string, drugs: string[]}, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `/api/generate-drug?uid=${data.uid}`,
                {
                    drugs: data.drugs 
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return {
                answer: response.data.answer,
            }; // Ответ API
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.detail || "Ошибка выполнения запроса"
            );
        }
    }
);

const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        setPrompt(state, action: PayloadAction<string | null>) {
            state.prompt = action.payload;
        },
        setAnswer(state, action: PayloadAction<string>) {
            state.answer = action.payload;
        },
        setThreadId(state, action: PayloadAction<string>) {
            state.thread_id = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateAssistant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateAssistant.fulfilled, (state, action) => {
                state.loading = false;
                state.answer = action.payload.answer; // Устанавливаем ответ
                state.thread_id = action.payload.thread_id; // Устанавливаем thread_id
                state.saved_prompt_id = action.payload.saved_prompt_id
            })
            .addCase(generateAssistant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(continueAssistant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(continueAssistant.fulfilled, (state, action) => {
                state.loading = false;
                state.answer = action.payload.answer; // Устанавливаем ответ
                state.thread_id = action.payload.thread_id; // Устанавливаем thread_id
                state.saved_prompt_id = action.payload.saved_prompt_id
            })
            .addCase(continueAssistant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(drugsAssistant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(drugsAssistant.fulfilled, (state, action) => {
                state.loading = false;
                state.answer = action.payload.answer; // Устанавливаем ответ
            })
            .addCase(drugsAssistant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setPrompt, setAnswer, setThreadId } = aiSlice.actions;
export default aiSlice.reducer;
