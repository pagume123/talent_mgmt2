'use client';

// src/components/tma/PerkCard.tsx
import HRCard from "@/components/ui/HRCard";
import HRBadge from "@/components/ui/HRBadge";
import { Perk } from '@/lib/types';
import { Gift } from "lucide-react";

export default function PerkCard({ perk }: { perk: Perk }) {
    return (
        <HRCard className="flex items-start gap-4 active:bg-secondary transition-all" padding={true}>
            <div className="w-10 h-10 bg-tint-blue rounded-[6px] flex items-center justify-center text-primary shrink-0 border border-primary/10">
                <Gift size={20} />
            </div>
            <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-gray-900 tracking-tight text-sm">{perk.title}</h3>
                    <HRBadge variant="success">{perk.value}</HRBadge>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    {perk.description}
                </p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-primary pt-1 flex items-center gap-1 group">
                    Claim Perk <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </HRCard>
    );
}
