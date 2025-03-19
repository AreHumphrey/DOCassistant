import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header'; // Импорт шапки

export default function MenuPage() {
    const { requireAuth } = useAuth();
    const navigate = useNavigate();

    // Очистка локального хранилища
    useEffect(() => {
        localStorage.removeItem("uid");
        localStorage.removeItem("pid");
        localStorage.removeItem("anamnes");
        localStorage.removeItem("selectedFiles");
        localStorage.removeItem("ai");
        localStorage.removeItem("answer");
        
        requireAuth();
    }, [requireAuth]);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, sectorName: number) => {
        e.preventDefault();
        const aiMapping: Record<number, string> = {
            1: "lab",
            2: "rad",
            3: "far",
            4: "car",
        };
        localStorage.setItem('ai', aiMapping[sectorName]);
        navigate("/med");
    };

    return (
        <div className="h-screen w-screen flex flex-col">
            {/* Шапка */}
            <Header />

            {/* Основное меню */}
            <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-0">
                <button
                    className="flex items-center justify-center bg-blue-500 text-white text-2xl font-bold hover:bg-blue-600"
                    onClick={(e) => handleButtonClick(e, 1)}
                >
                    Лаб
                </button>
                <button
                    className="flex items-center justify-center bg-green-500 text-white text-2xl font-bold hover:bg-green-600"
                    onClick={(e) => handleButtonClick(e, 2)}
                >
                    Рад
                </button>
                <button
                    className="flex items-center justify-center bg-red-500 text-white text-2xl font-bold hover:bg-red-600"
                    onClick={(e) => handleButtonClick(e, 3)}
                >
                    Лек
                </button>
                <button
                    className="flex items-center justify-center bg-yellow-500 text-white text-2xl font-bold hover:bg-yellow-600"
                    onClick={(e) => handleButtonClick(e, 4)}
                >
                    Экг
                </button>
            </div>
        </div>
    );
}
