'use client';

// src/components/tma/RequestForm.tsx
import { useState } from 'react';
import { useTMA } from '@/components/tma/TMAProvider';
import HRButton from '@/components/ui/HRButton';

export default function RequestForm({ onSuccess }: { onSuccess: () => void }) {
    const { user } = useTMA();
    const [type, setType] = useState<'leave' | 'expense'>('leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate || !reason) return;

        setIsSubmitting(true);
        try {
            const tg = (window as any).Telegram?.WebApp;
            const initData = tg?.initData || '';

            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    details: { startDate, endDate, reason },
                    telegramId: user?.id,
                    initData
                }),
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit request");
            }
        } catch (err) {
            alert("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Request Details</h3>

                <div className="flex bg-secondary p-1 rounded-[6px] border border-border-main">
                    <button
                        type="button"
                        onClick={() => setType('leave')}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-all ${type === 'leave' ? 'bg-white text-primary border border-border-main' : 'text-gray-400'
                            }`}
                    >
                        Leave
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-[4px] transition-all ${type === 'expense' ? 'bg-white text-primary border border-border-main' : 'text-gray-400'
                            }`}
                    >
                        Expense
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="hr-input w-full"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="hr-input w-full"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Description..."
                        className="hr-input w-full min-h-[100px] resize-none"
                        required
                    />
                </div>
            </div>

            <HRButton
                type="submit"
                disabled={isSubmitting}
                className="w-full text-[10px] tracking-[0.2em] font-black"
            >
                {isSubmitting ? 'SUBMISSION IN PROGRESS...' : 'SUBMIT REQUEST'}
            </HRButton>
        </form>
    );
}
