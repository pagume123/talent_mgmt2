'use client';

import PerkCard from "@/components/tma/PerkCard";
import { Perk } from "@/lib/types";
import { useTMA } from "@/components/tma/TMAProvider";
import { useState, useEffect } from "react";

export default function TMAPerks() {
    const { company } = useTMA();
    const [perks, setPerks] = useState<Perk[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!company?.id) { setLoading(false); return; }
        fetch(`/api/perks?company_id=${company.id}`)
            .then(res => res.json())
            .then(data => {
                setPerks(data.perks ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [company?.id]);

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Perks</h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Exclusive Employee Benefits
                </p>
            </header>

            <div className="space-y-4 pb-12">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-24 bg-surface border border-border-main rounded-2xl animate-pulse" />
                    ))
                ) : perks.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-400 italic font-medium">
                        No perks available yet.
                    </div>
                ) : (
                    perks.map(perk => (
                        <PerkCard key={perk.id} perk={perk} />
                    ))
                )}
            </div>
        </div>
    );
}
