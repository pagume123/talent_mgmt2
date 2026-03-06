'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    ClipboardList,
    Gift,
    Settings,
    Users,
    Search,
    Bell,
    User
} from 'lucide-react';
import LanguageToggle from '@/components/common/LanguageToggle';

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Policies', icon: FileText, path: '/policies/new' },
    { label: 'Requests', icon: ClipboardList, path: '/manager/requests' },
    { label: 'Employees', icon: Users, path: '/dashboard/employees' },
    { label: 'Perks', icon: Gift, path: '/dashboard/perks' },
    { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function WebAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-68 bg-surface border-r border-border-main fixed h-full z-20 flex flex-col">
                <div className="p-8 pb-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary rounded-hr shadow-hr-md flex items-center justify-center transform -rotate-3">
                        <div className="w-3 h-3 bg-white rounded-full opacity-30" />
                    </div>
                    <div>
                        <span className="font-black text-lg tracking-tight block leading-none">Talent</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Management</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-hr text-[12px] font-black uppercase tracking-widest transition-premium group ${isActive
                                    ? 'bg-tint-blue text-primary border border-primary/10 shadow-hr-sm'
                                    : 'text-gray-400 hover:bg-secondary hover:text-gray-900 border border-transparent'
                                    }`}
                            >
                                <Icon size={18} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border-main m-4 bg-secondary rounded-hr">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Workspace context</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[11px] font-bold text-gray-600 tracking-tight">System Live</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-68 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-20 glass-effect flex items-center justify-between px-10 sticky top-0 z-30">
                    <div className="flex items-center flex-1 h-full">
                        <div className="flex items-center gap-3 text-gray-400 max-w-sm w-full bg-secondary px-4 py-2.5 rounded-hr border border-border-main/50 transition-premium focus-within:border-primary/30 focus-within:bg-white text-xs">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-transparent border-none focus:ring-0 w-full font-bold placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 h-full">
                        <LanguageToggle />
                        <div className="w-px h-6 bg-border-main" />
                        <button className="text-gray-400 hover:text-primary transition-premium relative">
                            <Bell size={20} />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-surface" />
                        </button>
                        <div className="w-px h-6 bg-border-main" />
                        <button className="flex items-center gap-4 text-gray-700 hover:text-gray-900 group transition-premium">
                            <div className="text-right">
                                <span className="text-[11px] font-black text-gray-900 block leading-none uppercase tracking-widest">Admin</span>
                                <span className="text-[10px] text-gray-400 font-bold block mt-1">Super User</span>
                            </div>
                            <div className="w-10 h-10 bg-primary/5 rounded-hr flex items-center justify-center border border-primary/20 overflow-hidden transition-premium group-hover:scale-105 group-hover:shadow-hr-md">
                                <User size={20} className="text-primary" />
                            </div>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="p-8 flex-1 animate-in fade-in duration-150">
                    {children}
                </main>
            </div>
        </div>
    );
}
