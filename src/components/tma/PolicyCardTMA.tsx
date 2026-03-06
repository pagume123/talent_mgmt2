'use client';

// src/components/tma/PolicyCardTMA.tsx
import { useState } from 'react';
import BilingualText from "@/components/common/BilingualText";
import HRCard from "@/components/ui/HRCard";
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface Policy {
    id: string;
    title_en: string;
    title_am: string;
    content_en: string;
    content_am: string;
}

export default function PolicyCardTMA({ policy }: { policy: Policy }) {
    const [expanded, setExpanded] = useState(false);
    const { toggleLanguage } = useLanguage();

    return (
        <HRCard className="animate-in fade-in duration-150 overflow-hidden" padding={false}>
            <div
                className="p-5 flex flex-col gap-1 cursor-pointer active:bg-secondary transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 tracking-tight text-sm">
                        <BilingualText en={policy.title_en} am={policy.title_am} />
                    </h3>
                    <span className={`text-[10px] transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
                <p className={`text-xs text-gray-500 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                    <BilingualText en={policy.content_en} am={policy.content_am} />
                </p>
            </div>

            {expanded && (
                <div className="px-5 pb-5 pt-2 border-t border-border-main bg-secondary/30 flex justify-end">
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleLanguage(); }}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-700"
                    >
                        Switch Language
                    </button>
                </div>
            )}
        </HRCard>
    );
}
