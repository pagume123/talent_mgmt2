'use client';

import React from 'react';

interface HRButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

export default function HRButton({ variant = 'primary', children, className = '', ...props }: HRButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-primary text-white hover:bg-[#006ee6] h-[44px] px-5 rounded-[6px]",
        secondary: "bg-white text-black border border-border-main hover:bg-secondary h-[44px] px-5 rounded-[6px]"
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
