import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux';
import { store } from '@/stores/store.ts';
// @ts-ignore
import { store as EditorStore } from "@/components/ImageEditorPlugin/store"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </StrictMode>,
)
