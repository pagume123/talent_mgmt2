'use client';

import React from 'react';

interface HRBadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

const styles = {
    success: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    error: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    info: 'bg-[#EFF6FF] text-[#007AFF] border-[#BFDBFE]',
};

export default function HRBadge({ children, variant = 'info', className = '' }: HRBadgeProps) {
    return (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${styles[variant]} ${className}`}>
            {children}
        </span>
    );
}
