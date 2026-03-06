'use client';
import { useState, useEffect } from 'react';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRTable from '@/components/ui/HRTable';
import HRBadge from '@/components/ui/HRBadge';
import HRCard from '@/components/ui/HRCard';
import { RequestStatus } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function ManagerRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/requests');
            const data = await res.json();
            if (data.requests) setRequests(data.requests);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, status: RequestStatus) => {
        try {
            const res = await fetch('/api/requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const headers = ['Employee', 'Type', 'Dates', 'Status', 'Actions'];
    const rows = requests.map((req, idx) => [
        <div className="flex items-center gap-3" key={`emp-${idx}`}>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black border border-border-main text-gray-700 uppercase">
                {req.profiles?.full_name?.[0] || 'U'}
            </div>
            <span className="font-semibold text-gray-900">{req.profiles?.full_name || 'Unknown User'}</span>
        </div>,
        <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500" key={`type-${idx}`}>{req.type}</span>,
        <div key={`dates-${idx}`}>
            <div className="font-medium text-gray-700">
                {req.details?.startDate ? new Date(req.details.startDate).toLocaleDateString() : 'N/A'} -
                {req.details?.endDate ? new Date(req.details.endDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-[10px] text-gray-400 italic mt-0.5 line-clamp-1">"{req.details?.reason || 'No reason'}"</div>
        </div>,
        <HRBadge variant={req.status === 'approved' ? 'success' : req.status === 'denied' ? 'error' : 'info'} key={`status-${idx}`}>
            {req.status}
        </HRBadge>,
        <div className="flex justify-end gap-4" key={`actions-${idx}`}>
            {req.status === 'pending' && (
                <>
                    <button onClick={() => handleAction(req.id, 'denied')} className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 transition-colors">Deny</button>
                    <button onClick={() => handleAction(req.id, 'approved')} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-blue-700 transition-colors">Approve</button>
                </>
            )}
        </div>
    ]);

    return (
        <WebAdminLayout>
            <div className="space-y-8 max-w-6xl mx-auto">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Manager Dashboard</h1>
                        <p className="text-gray-500 mt-1">Review team workplace requests.</p>
                    </div>
                    <div className="flex gap-4">
                        <HRCard className="flex items-center gap-4 py-3 px-6" padding={false}>
                            <span className="text-2xl font-bold text-primary">
                                {requests.filter(r => r.status === 'pending').length}
                            </span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</span>
                        </HRCard>
                    </div>
                </header>

                <section>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Loader2 className="animate-spin mb-4" size={32} />
                            <p className="text-sm font-medium">Loading requests...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border-main text-gray-400 italic font-medium">
                            No requests submitted yet.
                        </div>
                    ) : (
                        <HRTable headers={headers} rows={rows} />
                    )}
                </section>
            </div>
        </WebAdminLayout>
    );
}
