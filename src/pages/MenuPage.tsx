import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import BorderFrame from '@/images/ramka.svg';
import BorderFrameHover from '@/images/ramka_hover.svg';

import LabIcon from '@/images/icon_analiz.svg';
import RadIcon from '@/images/icon_MRT.svg';
import FarIcon from '@/images/icon_TABL.svg';
import EkgIcon from '@/images/icon_ekg.svg';
import NowIcon from '@/images/icon_now.svg';

export default function MenuPage() {
  const { requireAuth } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Очищаем старые данные
    localStorage.removeItem("uid");
    localStorage.removeItem("pid");
    localStorage.removeItem("anamnes");
    localStorage.removeItem("selectedFiles");
    localStorage.removeItem("ai");
    localStorage.removeItem("answer");

    requireAuth(); // Проверка авторизации
  }, [requireAuth]);

  const handleButtonClick = (e: React.MouseEvent<HTMLDivElement>, sectorName: number) => {
    e.preventDefault();

    if (sectorName === 5) { // "СПРОСИ СЕЙЧАС"
      localStorage.setItem('ai', "ans");
      navigate("/ai/ans");
      return;
    }

    // Остальные направления
    const directions: Record<number, string> = {
      1: "lab",
      2: "rad",
      3: "far",
      4: "car",
    };

    const ai = directions[sectorName];
    if (ai) {
      localStorage.setItem('ai', ai);
      navigate("/med");
    }
  };

  const cards = [
    { icon: LabIcon, label: 'РАСШИФРОВКА\nЛАБ АНАЛИЗОВ', sector: 1 },
    { icon: RadIcon, label: 'ЛУЧЕВАЯ\nДИАГНОСТИКА', sector: 2 },
    { icon: FarIcon, label: 'СОВМЕСТИМОСТЬ\nЛЕКАРСТВ', sector: 3 },
    { icon: EkgIcon, label: 'ЭКГ', sector: 4 },
    { icon: NowIcon, label: 'СПРОСИ СЕЙЧАС', sector: 5 },
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col bg-white overflow-x-hidden">
      <Header />

      <div className="mt-10 mb-5 flex flex-wrap justify-center gap-6 px-4 pb-24">
        {cards.map(({ icon, label, sector }, index) => (
          <div
            key={index}
            onClick={(e) => handleButtonClick(e, sector)}
            className="relative cursor-pointer transition duration-200 group"
            style={{ width: 280, height: 400 }}
          >
            <img src={BorderFrame} alt="Рамка" className="absolute inset-0 w-full h-full group-hover:hidden" />
            <img src={BorderFrameHover} alt="Рамка (hover)" className="absolute inset-0 w-full h-full hidden group-hover:block" />
            <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center text-center px-4">
            <img src={icon} alt="Иконка" className="max-w-[150px] h-auto mb-6 object-contain" />
              <span className="text-black text-base font-bold leading-tight whitespace-pre-line">{label}</span>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
