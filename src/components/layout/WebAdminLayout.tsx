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
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Policies', icon: FileText, path: '/policies/new' }, // Simplified for demo
    { label: 'Requests', icon: ClipboardList, path: '/manager/requests' },
    { label: 'Employees', icon: Users, path: '#' },
    { label: 'Perks', icon: Gift, path: '#' },
    { label: 'Settings', icon: Settings, path: '#' },
];

export default function WebAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-border-main fixed h-full z-20">
                <div className="p-6 border-b border-border-main flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-[6px]" />
                    <span className="font-bold text-lg tracking-tight">Talent HR</span>
                </div>

                <nav className="p-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-[6px] text-sm font-medium transition-all ${isActive
                                        ? 'bg-tint-blue text-primary border border-primary/20'
                                        : 'text-gray-500 hover:bg-secondary hover:text-gray-900 border border-transparent'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-surface border-b border-border-main flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center flex-1 h-full">
                        <div className="flex items-center gap-3 text-gray-400 max-w-md w-full">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="bg-transparent border-none focus:ring-0 text-sm w-full"
                            />
                        </div>
                        <div className="w-px h-8 bg-border-main mx-4" />
                    </div>

                    <div className="flex items-center gap-6 h-full">
                        <LanguageToggle />
                        <div className="w-px h-8 bg-border-main" />
                        <button className="text-gray-400 hover:text-gray-600">
                            <Bell size={20} />
                        </button>
                        <div className="w-px h-8 bg-border-main" />
                        <button className="flex items-center gap-3 text-gray-700 hover:text-gray-900 group">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border-main">
                                <User size={18} className="text-gray-500" />
                            </div>
                            <span className="text-sm font-semibold">Admin User</span>
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
