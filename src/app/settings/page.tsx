'use client';

import { useState, useEffect } from 'react';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRCard from '@/components/ui/HRCard';
import HRButton from '@/components/ui/HRButton';
import HRBadge from '@/components/ui/HRBadge';
import { Settings, Building2, Save, Globe, Shield } from 'lucide-react';
import { ARCHETYPE_PROFILES } from '@/lib/utils/archetypes';

export default function SettingsPage() {
    const [company, setCompany] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/dashboard/context'); // Using existing dashboard context endpoint
            const data = await res.json();
            if (data.company) {
                setCompany(data.company);
                setName(data.company.name);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/companies', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings updated successfully' });
                fetchSettings();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Failed to update settings' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <WebAdminLayout>
                <div className="max-w-4xl mx-auto py-10 text-center text-gray-400">Loading settings...</div>
            </WebAdminLayout>
        );
    }

    const archetype = company?.archetype;
    const archetypeProfile = archetype ? ARCHETYPE_PROFILES[archetype as keyof typeof ARCHETYPE_PROFILES] : null;

    return (
        <WebAdminLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-premium-in">

                <header className="flex items-end justify-between border-b border-border-main pb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(0,122,255,0.5)]" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">System Configuration</p>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Settings</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-tight pt-1">Manage your company identity and core parameters.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <form onSubmit={handleSave}>
                            <HRCard className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-2">
                                    <Building2 className="text-primary" size={20} />
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Company Identity</h2>
                                </div>

                                {message.text && (
                                    <div className={`p-4 rounded-hr text-xs font-bold uppercase tracking-widest border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Entity Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="hr-input w-full font-bold text-gray-900"
                                            placeholder="Enter company name"
                                            required
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <HRButton type="submit" disabled={isSaving} className="min-w-[140px]">
                                            <Save size={16} className="mr-2" />
                                            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                                        </HRButton>
                                    </div>
                                </div>
                            </HRCard>
                        </form>

                        <HRCard className="opacity-60 grayscale cursor-not-allowed">
                            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Globe className="text-gray-400" size={20} />
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">Web Verification</h2>
                                </div>
                                <HRBadge variant="info">COMING SOON</HRBadge>
                            </div>
                            <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                Connect your domain to white-label the invitation links and enable custom email notifications.
                                Verified companies get higher priority in the Talent Global directory.
                            </p>
                        </HRCard>
                    </div>

                    <div className="space-y-6">
                        <HRCard className="bg-secondary/50 border-none shadow-hr-md">
                            <div className="flex items-center gap-2 mb-6 border-b border-border-main/50 pb-3">
                                <Shield className="text-primary" size={18} />
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Archetype</h3>
                            </div>
                            {archetypeProfile && (
                                <div className="space-y-4">
                                    <HRBadge variant="info" className="w-full justify-center py-2 font-black tracking-[0.2em] text-[11px]">
                                        {archetypeProfile.name.toUpperCase()}
                                    </HRBadge>
                                    <p className="text-xs text-gray-600 font-medium leading-relaxed italic">
                                        "{archetypeProfile.who_this_is_for.split('.')[0]}."
                                    </p>
                                    <div className="pt-2">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 border-l-2 border-primary pl-2">System Policy Mode</div>
                                        <p className="text-[10px] text-gray-500 font-mono bg-white p-3 rounded-hr border border-border-main/50">
                                            {archetypeProfile.llm_system_context.slice(0, 80)}...
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="mt-8 pt-4 border-t border-border-main/50">
                                <p className="text-[9px] text-gray-400 font-bold leading-tight">
                                    Archetype changes are currently locked to prevent policy desynchronization.
                                    Contact support to pivot your organization model.
                                </p>
                            </div>
                        </HRCard>
                    </div>
                </div>

            </div>
        </WebAdminLayout>
    );
}
