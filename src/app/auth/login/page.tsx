'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Shield } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-9 h-9 bg-primary rounded-[6px] flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Talent HR</span>
                </div>

                {sent ? (
                    <div className="bg-surface border border-border-main rounded-[6px] p-8 text-center">
                        <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#BBF7D0]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5L16 7" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <h2 className="font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-sm text-gray-500">We sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
                    </div>
                ) : (
                    <div className="bg-surface border border-border-main rounded-[6px] p-8 space-y-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Sign in to your account</h1>
                            <p className="text-sm text-gray-500 mt-1">Admin access for company managers.</p>
                        </div>

                        {/* Google OAuth */}
                        <button
                            onClick={handleGoogle}
                            className="w-full flex items-center justify-center gap-3 bg-surface border border-border-main hover:bg-secondary text-gray-700 font-semibold h-11 rounded-[6px] transition-colors text-sm"
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" /><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" /></svg>
                            Continue with Google
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-border-main" />
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-border-main" />
                        </div>

                        {/* Magic Link */}
                        <form onSubmit={handleMagicLink} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Work Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@yourcompany.com"
                                    className="hr-input w-full h-11"
                                    autoComplete="email"
                                />
                            </div>
                            {error && (
                                <p className="text-[11px] text-red-600 bg-[#FEE2E2] border border-[#FECACA] px-3 py-2 rounded-[6px]">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-semibold h-11 rounded-[6px] hover:bg-[#006ee6] transition-colors disabled:opacity-50 text-sm"
                            >
                                {loading ? 'Sending...' : 'Send Magic Link'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
