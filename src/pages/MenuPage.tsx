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

    // Переход на "/med" и сохранение в localStorage
    const handleButtonClick = (e: React.MouseEvent<HTMLDivElement>, sectorName: number) => {
        e.preventDefault();
        if (sectorName === 1) localStorage.setItem('ai', "lab");
        if (sectorName === 2) localStorage.setItem('ai', "rad");
        if (sectorName === 3) localStorage.setItem('ai', "far");
        if (sectorName === 4) localStorage.setItem('ai', "car");

        navigate("/med"); // Переход на страницу "/med"
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-white">
            <Header />

            {/* Блок с карточками */}
            <div className={`mt-5 flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-32 
                ${isMobile ? 'py-10 gap-y-28 mt-8 mb-42' : ''}`}  
            >
                {/* Карточка: Лабораторные анализы */}
                <div
                    className={`relative p-2 cursor-pointer transition duration-200 group 
                    ${isMobile ? 'w-full max-w-[280px] mx-auto h-[300px] flex flex-col justify-center items-center' : ''}`} 
                    onClick={(e) => handleButtonClick(e, 1)}
                >
                    <img
                        src={BorderFrame}
                        alt="Рамка"
                        className={`absolute inset-0 block group-hover:hidden
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <img
                        src={BorderFrameHover}
                        alt="Рамка (розовая)"
                        className={`absolute inset-0 hidden group-hover:block
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <div 
                        className={`relative z-10 flex flex-col items-center justify-center h-full p-4 text-center
                        ${isMobile ? 'p-6' : ''}`}  
                    >
                        <img 
                            src={LabIcon} 
                            alt="Иконка" 
                            className={`w-32 h-32 sm:w-40 sm:h-40 mb-6`}  
                        />
                        <span className="text-black text-lg sm:text-xl font-bold text-center leading-tight">
                            РАСШИФРОВКА<br />ЛАБ АНАЛИЗОВ
                        </span>
                    </div>
                </div>

                {/* Карточка: Лучевая диагностика */}
                <div
                    className={`relative p-2 cursor-pointer transition duration-200 group 
                    ${isMobile ? 'w-full max-w-[280px] mx-auto h-[300px] flex flex-col justify-center items-center' : ''}`} 
                    onClick={(e) => handleButtonClick(e, 2)}
                >
                    <img
                        src={BorderFrame}
                        alt="Рамка"
                        className={`absolute inset-0 block group-hover:hidden
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <img
                        src={BorderFrameHover}
                        alt="Рамка (розовая)"
                        className={`absolute inset-0 hidden group-hover:block
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <div 
                        className={`relative z-10 flex flex-col items-center justify-center h-full p-4 text-center
                        ${isMobile ? 'p-6' : ''}`}  
                    >
                        <img 
                            src={RadIcon} 
                            alt="Иконка" 
                            className={`w-32 h-32 sm:w-40 sm:h-40 mb-6`}  
                        />
                        <span className="text-black text-lg sm:text-xl font-bold text-center leading-tight">
                            ЛУЧЕВАЯ<br />ДИАГНОСТИКА
                        </span>
                    </div>
                </div>

                {/* Карточка: Совместимость лекарств */}
                <div
                    className={`relative p-2 cursor-pointer transition duration-200 group 
                    ${isMobile ? 'w-full max-w-[280px] mx-auto h-[300px] flex flex-col justify-center items-center' : ''}`} 
                    onClick={(e) => handleButtonClick(e, 3)}
                >
                    <img
                        src={BorderFrame}
                        alt="Рамка"
                        className={`absolute inset-0 block group-hover:hidden
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <img
                        src={BorderFrameHover}
                        alt="Рамка (розовая)"
                        className={`absolute inset-0 hidden group-hover:block
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <div 
                        className={`relative z-10 flex flex-col items-center justify-center h-full p-4 text-center
                        ${isMobile ? 'p-6' : ''}`}  
                    >
                        <img 
                            src={FarIcon} 
                            alt="Иконка" 
                            className={`w-32 h-32 sm:w-40 sm:h-40 mb-6`}  
                        />
                        <span className="text-black text-lg sm:text-xl font-bold text-center leading-tight">
                            СОВМЕСТИМОСТЬ<br />ЛЕКАРСТВ
                        </span>
                    </div>
                </div>

                <div
                    className={`relative p-2 cursor-pointer transition duration-200 group 
                    ${isMobile ? 'w-full max-w-[280px] mx-auto h-[300px] flex flex-col justify-center items-center mb-[150px]' : ''}`} 
                    onClick={(e) => handleButtonClick(e, 4)}
                >
                    <img
                        src={BorderFrame}
                        alt="Рамка"
                        className={`absolute inset-0 block group-hover:hidden
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <img
                        src={BorderFrameHover}
                        alt="Рамка (розовая)"
                        className={`absolute inset-0 hidden group-hover:block
                        ${isMobile ? 'w-[400px] h-[400px]' : 'w-[500px] h-[500px]'}`}
                    />
                    <div 
                        className={`relative z-10 flex flex-col items-center justify-center h-full p-4 text-center
                        ${isMobile ? 'p-6' : ''}`}  
                    >
                        <img 
                            src={EkgIcon} 
                            alt="Иконка" 
                            className={`w-32 h-32 sm:w-40 sm:h-40 mb-6`}  
                        />
                        <span className="text-black text-lg sm:text-xl font-bold text-center leading-tight">
                            ЭКГ
                        </span>
                    </div>
                </div>

            
            </div>

            <Footer />
        </div>
    );
}
