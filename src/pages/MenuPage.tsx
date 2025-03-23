import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import BorderFrame from '@/images/ramka.svg';
import BorderFrameHover from '@/images/ramka_hover.svg';

import LabIcon from '@/images/icon__doc.svg';
import RadIcon from '@/images/icon__doc.svg';
import FarIcon from '@/images/icon__doc.svg';
import EkgIcon from '@/images/icon__doc.svg';

// Добавляем объявление объекта с типами
const aiMapping: Record<number, string> = {
    1: "lab",
    2: "rad",
    3: "far",
    4: "car",
};

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

    const handleButtonClick = (e: React.MouseEvent<HTMLDivElement>, sectorName: keyof typeof aiMapping) => {
        e.preventDefault();
        localStorage.setItem('ai', aiMapping[sectorName]);
        navigate("/med");
    };

    const cards = [
        { id: 1, text: "РАСШИФРОВКА\nЛАБ АНАЛИЗОВ", icon: LabIcon },
        { id: 2, text: "ЛУЧЕВАЯ\nДИАГНОСТИКА", icon: RadIcon },
        { id: 3, text: "СОВМЕСТИМОСТЬ\nЛЕКАРСТВ", icon: FarIcon },
        { id: 4, text: "ЭКГ", icon: EkgIcon }
    ];

    return (
        <div className="h-screen w-screen flex flex-col bg-white">
            <Header />

            {/* Блок с карточками с корректными отступами и границами */}
            <div className={`mt-5 flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-16 
                ${isMobile ? 'py-10 gap-y-28 mt-8 mb-10' : ''}`}  
            >
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`relative p-2 cursor-pointer transition duration-200 group mb-20 
                        ${isMobile ? 'w-full max-w-[280px] mx-auto h-[320px] flex flex-col justify-center items-center' : ''}`} 
                        onClick={(e) => handleButtonClick(e, card.id as keyof typeof aiMapping)}
                    >
                        <img
                            src={BorderFrame}
                            alt="Рамка"
                            className={`absolute inset-0 w-full h-full block group-hover:hidden 
                            ${isMobile ? 'scale-[1.5]' : ''}`} 
                        />
                        <img
                            src={BorderFrameHover}
                            alt="Рамка (розовая)"
                            className={`absolute inset-0 w-full h-full hidden group-hover:block 
                            ${isMobile ? 'scale-[1.5]' : ''}`} 
                        />

                        <div 
                            className={`relative z-10 flex flex-col items-center justify-center h-full p-4 
                            ${isMobile ? 'p-6' : ''}`}  
                        >
                            <img 
                                src={card.icon} 
                                alt="Иконка" 
                                className={`w-20 h-20 sm:w-28 sm:h-28 mb-8`}  // Увеличенные иконки
                            />
                            <span 
                                className={`text-black text-base sm:text-lg font-bold text-center leading-tight 
                                ${isMobile ? 'text-lg max-h-[60px] overflow-hidden' : ''}`}
                            >
                                {card.text.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}<br/>
                                    </React.Fragment>
                                ))}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            

            <Footer />
        </div>
    );
}
