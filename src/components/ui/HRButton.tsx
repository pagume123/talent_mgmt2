'use client';

import React from 'react';

interface HRButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export default function HRButton({ variant = 'primary', children, className = '', ...props }: HRButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-bold text-[11px] uppercase tracking-widest transition-premium active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none rounded-hr shadow-hr-sm";
    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover hover:shadow-primary/20 hover:shadow-lg h-[44px] px-6",
        secondary: "bg-white text-gray-700 border border-border-main hover:bg-secondary h-[44px] px-6"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
