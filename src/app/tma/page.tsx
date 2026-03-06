'use client';

import { useTMA } from "@/components/tma/TMAProvider";
import TMAClaimScreen from "@/components/tma/TMAClaimScreen"; // Added this import
import HRCard from "@/components/ui/HRCard";
import HRBadge from "@/components/ui/HRBadge";
import BilingualText from "@/components/common/BilingualText";
import { Building2, ClipboardList, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ARCHETYPE_PROFILES } from "@/lib/utils/archetypes";

export default function TMAHome() {
    const { user, profile, company, isLoading, error, registered, refresh } = useTMA(); // Added 'refresh' to destructuring

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-400">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    // Employee not yet linked
    if (!registered) {
        return <TMAClaimScreen user={user} refresh={refresh} error={error} />;
    }

    const archetype = company?.archetype;
    const archetypeProfile = archetype ? ARCHETYPE_PROFILES[archetype as keyof typeof ARCHETYPE_PROFILES] : null;

    return (
        <div className="p-6 space-y-6 pb-4">
            {/* Greeting */}
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-ET', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <h1 className="text-xl font-bold text-gray-900 mt-1">
                    <BilingualText
                        en={`Hello, ${user?.first_name ?? 'there'}`}
                        am={`ሰላም, ${user?.first_name ?? ''}`}
                    />
                </h1>
            </div>

            {/* Company Card */}
            <HRCard>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[6px] flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm">{company?.name}</div>
                        {archetypeProfile && (
                            <>
                                <div className="mt-1"><HRBadge variant="info">{archetypeProfile.name}</HRBadge></div>
                                <div className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                                    <BilingualText
                                        en={archetypeProfile.who_this_is_for.split('.')[0] + '.'}
                                        am="የድርጅቱን ዓላማ ያሳያል።"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </HRCard>

            {/* Values */}
            {archetypeProfile && (
                <HRCard>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                        <BilingualText en="Core Values" am="ዋና እሴቶች" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {archetypeProfile.values.map(v => (
                            <span key={v} className="text-[11px] font-bold text-gray-700 bg-secondary border border-border-main px-2 py-1 rounded-[4px]">
                                {v}
                            </span>
                        ))}
                    </div>
                </HRCard>
            )}

            {/* Quick Links */}
            <HRCard padding={false}>
                <div className="divide-y divide-border-main">
                    <Link href="/tma/handbook" className="flex items-center gap-3 p-4 hover:bg-secondary transition-colors group">
                        <div className="w-8 h-8 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main">
                            <BookOpen size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">
                                <BilingualText en="Company Handbook" am="የኩባንያ ማኑዋል" />
                            </div>
                            <div className="text-[10px] text-gray-400">Policies & guidelines</div>
                        </div>
                        <span className="text-gray-400 group-hover:text-gray-600">→</span>
                    </Link>
                    <Link href="/tma/requests" className="flex items-center gap-3 p-4 hover:bg-secondary transition-colors group">
                        <div className="w-8 h-8 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main">
                            <ClipboardList size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">
                                <BilingualText en="Submit a Request" am="ጥያቄ አቅርብ" />
                            </div>
                            <div className="text-[10px] text-gray-400">Leave, expense, other</div>
                        </div>
                        <span className="text-gray-400 group-hover:text-gray-600">→</span>
                    </Link>
                    <Link href="/tma/perks" className="flex items-center gap-3 p-4 hover:bg-secondary transition-colors group">
                        <div className="w-8 h-8 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main">
                            <Building2 size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-gray-900">
                                <BilingualText en="Perks & Benefits" am="ጥቅማ ጥቅሞች" />
                            </div>
                            <div className="text-[10px] text-gray-400">View what's available to you</div>
                        </div>
                        <span className="text-gray-400 group-hover:text-gray-600">→</span>
                    </Link>
                </div>
            </HRCard>
        </div>
    );
}
