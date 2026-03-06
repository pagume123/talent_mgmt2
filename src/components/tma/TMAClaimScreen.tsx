'use client';

import { useState } from 'react';
import HRCard from '@/components/ui/HRCard';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface TMAClaimScreenProps {
    user: any;
    refresh: () => Promise<void>;
    error: string | null;
}

export default function TMAClaimScreen({ user, refresh, error }: TMAClaimScreenProps) {
    const [token, setToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    if (error === 'not_in_telegram') {
        return (
            <div className="p-6 space-y-6 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center text-center min-h-[60vh]">
                <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-500 mb-2">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Access Restricted</h1>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                    This portal is designed exclusively for employees via the Telegram Mini App.
                </p>
                <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-xl text-xs font-bold text-primary w-full max-w-xs mt-8 whitespace-pre-wrap">
                    Please open the HR Bot inside Telegram to access your workplace profile.
                </div>
            </div>
        );
    }

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsSubmitting(true);
        setLocalError(null);

        try {
            const tg = (window as any).Telegram?.WebApp;
            const initData = tg?.initData || '';

            const res = await fetch('/api/tma/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, initData }),
            });

            const data = await res.json();

            if (res.ok) {
                // Success! Refresh the main provider state
                await refresh();
            } else {
                setLocalError(data.error || 'Invalid token');
            }
        } catch (err) {
            setLocalError('Connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                    <ShieldCheck size={28} />
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome to Talent HR</h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Connect your Telegram account to your company profile to access the handbook, submit requests, and claim perks.
                </p>
            </header>

            {(error || localError) && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wide">
                        {localError || error}
                    </p>
                </div>
            )}

            <form onSubmit={handleClaim} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Invitation Token</label>
                    <input
                        type="text"
                        placeholder="ENTER 8-CHAR TOKEN"
                        className="hr-input w-full text-center tracking-[0.3em] font-black uppercase text-primary placeholder:text-gray-200"
                        value={token}
                        onChange={(e) => setToken(e.target.value.toUpperCase())}
                        maxLength={8}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-40"
                >
                    {isSubmitting ? 'VERIFYING...' : 'LINK ACCOUNT'}
                    {!isSubmitting && <ArrowRight size={18} />}
                </button>
            </form>

            {user && (
                <div className="pt-8 border-t border-dashed border-gray-100 italic">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Authenticating As</div>
                    <div className="text-[10px] text-gray-400 font-bold">
                        {user.first_name} {user.last_name ?? ''} (ID: {user.id})
                    </div>
                </div>
            )}
        </div>
    );
}
