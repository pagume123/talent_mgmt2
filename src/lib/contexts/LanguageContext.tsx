'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'am';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Load language from local storage if available
    useEffect(() => {
        const savedLang = localStorage.getItem('app-language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'am')) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('app-language', lang);
        document.documentElement.lang = lang;
        if (lang === 'am') {
            document.documentElement.dir = 'rtl'; // Amharic isn't RTL usually, but system uses it? Actually Ethiopic is LTR.
            // Correction: Ethiopic is LTR. I'll stick to LTR for now unless user specifies otherwise.
            document.documentElement.dir = 'ltr';
        } else {
            document.documentElement.dir = 'ltr';
        }
    };

    const toggleLanguage = () => {
        handleSetLanguage(language === 'en' ? 'am' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
