'use client';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import React from 'react';

interface BilingualTextProps {
    en: string | React.ReactNode;
    am: string | React.ReactNode;
    className?: string;
}

export default function BilingualText({ en, am, className = '' }: BilingualTextProps) {
    const { language } = useLanguage();

    return (
        <span className={`${className} ${language === 'am' ? 'font-amharic' : 'font-sans'}`}>
            {language === 'en' ? en : am}
        </span>
    );
}
