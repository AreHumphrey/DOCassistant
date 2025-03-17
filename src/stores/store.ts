import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import anamnesReduser from './anamnesSlice'
import savedPromptsReduser from './savedPromptSlice'
import fileReduser from './filesSlice'
import aiReduser from './aiSlice'
import drugReduser from './drugSlice'
import editorReduser from './editorSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    anamnes: anamnesReduser,
    savedPrompts: savedPromptsReduser,
    files: fileReduser,
    ai: aiReduser,
    drug: drugReduser,
    editor: editorReduser,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
