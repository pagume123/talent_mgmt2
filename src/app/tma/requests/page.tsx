'use client';

import { useState, useEffect } from 'react';
import RequestForm from "@/components/tma/RequestForm";
import { useTMA } from '@/components/tma/TMAProvider';
import HRBadge from '@/components/ui/HRBadge';

export default function TMARequests() {
    const { user } = useTMA();
    const [submitted, setSubmitted] = useState(false);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }
        fetchRequests();
    }, [user?.id, submitted]);

    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/requests?telegram_id=${user?.id}`);
            const data = await res.json();
            setRequests(data.requests ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl">✅</div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Request Sent!</h1>
                    <p className="text-gray-500 mt-2 text-sm">Your supervisor will be notified immediately. You can track the status below.</p>
                </div>
                <button
                    onClick={() => {
                        setSubmitted(false);
                        fetchRequests();
                    }}
                    className="text-blue-600 font-bold uppercase tracking-widest text-[10px] py-3 px-8 bg-blue-50 rounded-full border border-blue-100"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Requests</h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Submit Leave or Expense Claims
                </p>
            </header>

            <div className="bg-white border border-gray-100 p-6 rounded-3xl">
                <RequestForm onSuccess={() => setSubmitted(true)} />
            </div>

            <section className="space-y-4 pb-12">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Activity</h2>

                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic border border-dashed border-gray-200">
                        No requests found
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.map(req => (
                            <div key={req.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all">
                                <div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                        {req.type} • {new Date(req.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="font-bold text-gray-900 text-sm">
                                        {req.details?.reason || 'No description'}
                                    </div>
                                </div>
                                <HRBadge variant={
                                    req.status === 'approved' ? 'success' :
                                        req.status === 'denied' ? 'error' : 'info'
                                }>
                                    {req.status.toUpperCase()}
                                </HRBadge>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
