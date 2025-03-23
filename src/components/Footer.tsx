import React from "react";
import { useSearchParams } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="w-screen bg-white shadow-md h-[15%] flex flex-col items-start sm:items-center justify-center">
            {/* Синяя линия (толще и на всю ширину) */}
            <div className="w-full h-[6px] bg-[#0A57FF] mb-2"></div>

            <div className="container mx-auto flex flex-col items-center justify-center py-[25px] px-10 w-full sm:flex-row sm:items-start sm:justify-start">
                {/* Текст с копирайтом */}
                <p className="text-[#0A57FF] text-lg font-bold text-center w-full sm:text-left sm:text-sm">
                    © 2025 DOCASSISTANT
                </p>
            </div>
        </footer>
    );
};

export default Footer;
