import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      // Проксируем запросы с /api на бэкенд
      '/api': {
        target: 'http://localhost:8000', // Адрес вашего бэкенда
        changeOrigin: true, // Подменяет Origin заголовка запроса на адрес бэкенда
        secure: false, // Если используете HTTPS, но сертификат невалидный
      },
    },
  }
})
