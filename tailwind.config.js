/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",       // Основной HTML файл
    "./src/**/*.{js,ts,jsx,tsx}", // Все файлы в папке src
  ],
  theme: {
    extend: {
      scale: {
        '250': '2.5',     // Увеличение рамки в 2.5 раза
        '300': '3',       // Увеличение рамки в 3 раза (если нужно ещё больше)
      },
      spacing: {
        'frame-padding': '2rem', // Дополнительный отступ между рамками на мобильной версии
        'mobile-gap': '1.5rem',  // Пространство между карточками
      },
      screens: {
        'mobile': {'max': '640px'}, // Медиа-запрос для мобильной версии
      }
    }
  },
  plugins: [],
};
