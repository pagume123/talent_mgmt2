'use client';

import { useState, useEffect } from 'react';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRCard from '@/components/ui/HRCard';
import HRBadge from '@/components/ui/HRBadge';
import { Gift, Plus, Search, Trash2, Edit3, Loader2 } from 'lucide-react';

interface Perk {
    id: string;
    title: string;
    description: string;
    value: string;
    created_at: string;
}

export default function AdminPerksPage() {
    const [perks, setPerks] = useState<Perk[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', value: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPerks();
    }, []);

    const fetchPerks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/perks');
            const data = await res.json();
            if (data.perks) setPerks(data.perks);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPerk = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/perks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ title: '', description: '', value: '' });
                fetchPerks();
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <WebAdminLayout>
            <div className="max-w-5xl mx-auto space-y-8 pb-10">

                {/* Header */}
                <header className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Employee Benefits</p>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Perks Catalog</h1>
                        <p className="text-sm text-gray-500 mt-1">Create and manage perks available to your team in the Telegram Mini App.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 h-9 rounded-[6px] hover:bg-[#006ee6] transition-colors text-xs"
                    >
                        <Plus size={14} /> New Perk
                    </button>
                </header>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Loader2 className="animate-spin mb-4" size={32} />
                        <p className="text-sm font-medium">Loading perks...</p>
                    </div>
                ) : perks.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border-main text-gray-400 italic font-medium">
                        No perks added yet. Click "New Perk" to start.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {perks.map(perk => (
                            <HRCard key={perk.id} className="group relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 bg-tint-blue rounded-xl flex items-center justify-center text-primary border border-primary/10">
                                        <Gift size={20} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-[4px] text-gray-400 hover:text-gray-600">
                                            <Edit3 size={14} />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 rounded-[4px] text-gray-400 hover:text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{perk.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{perk.description}</p>
                                <div className="pt-4 border-t border-border-main flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee Benefit</span>
                                    <span className="text-xs font-bold text-primary bg-tint-blue px-2 py-0.5 rounded-full">{perk.value}</span>
                                </div>
                            </HRCard>
                        ))}
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <HRCard className="max-w-md w-full animate-in zoom-in-95 fade-in duration-200" padding={false}>
                            <div className="p-6 border-b border-border-main">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    <Gift className="text-primary" size={20} />
                                    Create New Perk
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">This will be visible to all employees in TMA.</p>
                            </div>
                            <form onSubmit={handleAddPerk} className="p-6 space-y-4">
                                {error && (
                                    <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-[6px] border border-red-100 uppercase tracking-wider">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Perk Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="hr-input w-full"
                                        placeholder="e.g. Free Coffee, Health Insurance"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value / Badge</label>
                                    <input
                                        type="text"
                                        required
                                        className="hr-input w-full"
                                        placeholder="e.g. Monthly, Premium, $500"
                                        value={formData.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        required
                                        className="hr-input w-full min-h-[100px] resize-none"
                                        placeholder="Explain the benefit details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4 mt-2">
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 h-10 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-2 bg-primary text-white font-black px-8 h-10 rounded-[6px] hover:shadow-lg transition-all disabled:opacity-40 text-[10px] uppercase tracking-[0.2em]"
                                    >
                                        {isSubmitting ? 'CREATING...' : 'CREATE PERK'}
                                    </button>
                                </div>
                            </form>
                        </HRCard>
                    </div>
                )}

            </div>
        </WebAdminLayout>
    );
}
