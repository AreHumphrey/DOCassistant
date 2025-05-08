import { configureStore, createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
    name: 'images',
    initialState: {
        savedImageUrl: null,
        triggerSave: false, // Добавляем триггер
    },
    reducers: {
        setSavedImageUrl: (state, action) => {
            state.savedImageUrl = action.payload;
        },
        triggerSaveImage: (state) => {
            state.triggerSave = true;
        },
        resetSaveTrigger: (state) => {
            state.triggerSave = false;
        },
    },
});

export const { setSavedImageUrl, triggerSaveImage, resetSaveTrigger } = imageSlice.actions;

export const store = configureStore({
    reducer: {
        images: imageSlice.reducer,
    },
});