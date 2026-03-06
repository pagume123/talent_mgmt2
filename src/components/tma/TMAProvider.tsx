'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TMAUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

interface TMAProfile {
    id: string;
    role: string;
    company_id: string;
    telegram_id: string;
}

interface TMACompany {
    id: string;
    name: string;
    archetype: string;
    settings: Record<string, any>;
}

interface TMAContextType {
    user: TMAUser | null;
    profile: TMAProfile | null;
    company: TMACompany | null;
    isLoading: boolean;
    error: string | null;
    registered: boolean;
}

const TMAContext = createContext<TMAContextType>({
    user: null, profile: null, company: null,
    isLoading: true, error: null, registered: false,
});

export function TMAProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<TMAContextType>({
        user: null, profile: null, company: null,
        isLoading: true, error: null, registered: false,
    });

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;
        const telegramUser = tg?.initDataUnsafe?.user ?? null;
        const initData = tg?.initData ?? '';

        if (!telegramUser) {
            // DEV MODE: use mock user for local testing
            setState({
                user: { id: 999999, first_name: 'Demo', last_name: 'Employee' },
                profile: null,
                company: null,
                isLoading: false,
                error: null,
                registered: false,
            });
            return;
        }

        // Authenticate with backend
        fetch('/api/tma/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.registered) {
                    setState({
                        user: telegramUser,
                        profile: data.profile,
                        company: data.company,
                        isLoading: false,
                        error: null,
                        registered: true,
                    });
                } else {
                    setState({
                        user: telegramUser,
                        profile: null,
                        company: null,
                        isLoading: false,
                        error: data.error,
                        registered: false,
                    });
                }
            })
            .catch(err => {
                setState(prev => ({ ...prev, isLoading: false, error: 'Connection error' }));
            });
    }, []);

    return <TMAContext.Provider value={state}>{children}</TMAContext.Provider>;
}

export function useTMA() {
    return useContext(TMAContext);
}
