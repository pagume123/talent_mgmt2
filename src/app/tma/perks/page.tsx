'use client';

import PerkCard from "@/components/tma/PerkCard";
import { Perk } from "@/lib/types";

const MOCK_PERKS: Perk[] = [
    {
        id: '1',
        company_id: 'any',
        title: 'Transport Allowance',
        description: 'Monthly stipend covering commute costs to and from the HR main office.',
        value: '5,000 ETB',
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        company_id: 'any',
        title: 'Health Insurance',
        description: 'Comprehensive medical coverage for you and up to 2 dependents.',
        value: 'Premium',
        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        company_id: 'any',
        title: 'Skill Development',
        description: 'Annual budget for online courses, certifications, and technical books.',
        value: 'Education',
        created_at: new Date().toISOString(),
    }
];

export default function TMAPerks() {
    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Perks</h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Exclusive Employee Benefits
                </p>
            </header>

            <div className="space-y-4 pb-12">
                {MOCK_PERKS.map(perk => (
                    <PerkCard key={perk.id} perk={perk} />
                ))}
            </div>
        </div>
    );
}
