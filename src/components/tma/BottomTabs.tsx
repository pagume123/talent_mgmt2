'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardList, Gift } from 'lucide-react';

const TABS = [
    { label: 'Home', icon: Home, path: '/tma' },
    { label: 'Handbook', icon: BookOpen, path: '/tma/handbook' },
    { label: 'Requests', icon: ClipboardList, path: '/tma/requests' },
    { label: 'Perks', icon: Gift, path: '/tma/perks' },
];

export default function BottomTabs() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 w-full h-[64px] bg-surface border-t border-border-main flex items-center justify-around px-2 z-50">
            {TABS.map((tab) => {
                const isActive = pathname === tab.path;
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.path}
                        href={tab.path}
                        className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all relative ${isActive ? 'text-primary' : 'text-gray-400'
                            }`}
                    >
                        <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                        <span className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${isActive ? 'opacity-100' : 'opacity-60'
                            }`}>
                            {tab.label}
                        </span>
                        {isActive && <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full" />}
                    </Link>
                );
            })}
        </nav>
    );
}
