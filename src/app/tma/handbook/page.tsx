'use client';

import { useState, useEffect } from "react";
import { useTMA } from "@/components/tma/TMAProvider";
import PolicyCardTMA from "@/components/tma/PolicyCardTMA";
import { Search } from "lucide-react";

interface Policy {
    id: string;
    title_en: string;
    title_am: string;
    content_en: string;
    content_am: string;
    status: string;
}

export default function TMAHandbook() {
    const { company, registered } = useTMA();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!company?.id) { setLoading(false); return; }
        fetch(`/api/policies?company_id=${company.id}`)
            .then(r => r.json())
            .then(data => { setPolicies(data.policies ?? []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [company?.id]);

    const filtered = policies.filter(p =>
        p.title_en.toLowerCase().includes(query.toLowerCase()) ||
        p.title_am.includes(query)
    );

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-xl font-bold tracking-tight">Handbook</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Policies & Guidelines
                </p>
            </header>

            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search policies..."
                    className="hr-input w-full pl-10 pr-4 h-11"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            <div className="space-y-4 pb-12">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 bg-surface border border-border-main rounded-[6px] animate-pulse" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-sm text-gray-400">
                        {registered
                            ? 'No policies published yet.'
                            : 'Sign in to view company policies.'}
                    </div>
                ) : (
                    filtered.map(policy => (
                        <PolicyCardTMA key={policy.id} policy={policy} />
                    ))
                )}
            </div>
        </div>
    );
}
