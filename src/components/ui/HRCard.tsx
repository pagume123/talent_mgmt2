'use client';

import React from 'react';

interface HRCardProps {
    children: React.ReactNode;
    className?: string;
    padding?: boolean;
}

export default function HRCard({ children, className = '', padding = true }: HRCardProps) {
    return (
        <div className={`bg-surface border border-border-main rounded-[6px] ${padding ? 'p-6' : ''} ${className}`}>
            {children}
        </div>
    );
}
