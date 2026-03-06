'use client';

import { useLanguage } from "@/lib/contexts/LanguageContext";

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="inline-flex bg-white border border-border-main rounded-full p-1 h-9 items-center">
            <button
                onClick={() => setLanguage('en')}
                className={`px-3 h-full rounded-full text-[10px] font-black tracking-widest transition-all ${language === 'en'
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('am')}
                className={`px-3 h-full rounded-full text-[10px] font-black tracking-widest transition-all ${language === 'am'
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
            >
                አማ
            </button>
        </div>
    );
}
