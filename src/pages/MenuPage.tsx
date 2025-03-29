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
    localStorage.removeItem("uid");
    localStorage.removeItem("pid");
    localStorage.removeItem("anamnes");
    localStorage.removeItem("selectedFiles");
    localStorage.removeItem("ai");
    localStorage.removeItem("answer");

    requireAuth();
  }, [requireAuth]);

  const handleButtonClick = (e: React.MouseEvent<HTMLDivElement>, sectorName: number) => {
    e.preventDefault();
    if (sectorName === 1) localStorage.setItem('ai', "lab");
    if (sectorName === 2) localStorage.setItem('ai', "rad");
    if (sectorName === 3) localStorage.setItem('ai', "far");
    if (sectorName === 4) localStorage.setItem('ai', "car");
    if (sectorName === 5) localStorage.setItem('ai', "ans");

    navigate("/med");
  };

  const frameSizeClass = isMobile ? 'w-[520px] h-[520px]' : 'w-[500px] h-[500px]';

  const cardClasses = `relative p-2 cursor-pointer transition duration-200 group 
    ${isMobile ? 'w-full max-w-[320px] mx-auto' : ''}`;

  const contentClass = `absolute top-0 left-0 w-full h-full z-10 flex flex-col items-center justify-center text-center`;

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-x-hidden">
      <Header />

      {/* Карточки */}
      <div
        className={`mt-5 flex-grow grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 gap-2 px-4 md:px-26 pb-24 
          ${isMobile ? 'py-10 gap-y-6 mt-8' : ''}`}
      >
        {/* Карточка шаблон */}
        {[{
          icon: LabIcon,
          label: 'РАСШИФРОВКА\nЛАБ АНАЛИЗОВ',
          sector: 1
        }, {
          icon: RadIcon,
          label: 'ЛУЧЕВАЯ\nДИАГНОСТИКА',
          sector: 2
        }, {
          icon: FarIcon,
          label: 'СОВМЕСТИМОСТЬ\nЛЕКАРСТВ',
          sector: 3
        }, {
          icon: EkgIcon,
          label: 'ЭКГ',
          sector: 4
        },
        {
            icon: NowIcon,
            label: 'СПРОСИ СЕЙЧАС',
            sector: 5
          }].map(({ icon, label, sector }, index) => (
          <div
            key={index}
            className={cardClasses}
            onClick={(e) => handleButtonClick(e, sector)}
            style={{ height: isMobile ? '520px' : '500px' }}
          >
            <img
              src={BorderFrame}
              alt="Рамка"
              className={`absolute inset-0 block group-hover:hidden ${frameSizeClass}`}
            />
            <img
              src={BorderFrameHover}
              alt="Рамка (розовая)"
              className={`absolute inset-0 hidden group-hover:block ${frameSizeClass}`}
            />
            <div className={contentClass}>
              <img src={icon} alt="Иконка" className="w-32 h-32 sm:w-40 sm:h-40 mb-6" />
              <span className="text-black text-lg sm:text-xl font-bold leading-tight whitespace-pre-line">
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
