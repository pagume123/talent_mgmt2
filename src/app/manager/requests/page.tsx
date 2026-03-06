'use client';

import { useState } from 'react';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRTable from '@/components/ui/HRTable';
import HRBadge from '@/components/ui/HRBadge';
import HRCard from '@/components/ui/HRCard';
import { RequestStatus } from '@/lib/types';

const MOCK_REQUESTS = [
    {
        id: 'req_1',
        profile: { first_name: 'Abeba', last_name: 'Kassa' },
        type: 'leave',
        status: 'pending' as RequestStatus,
        details: { startDate: '2024-03-10', endDate: '2024-03-15', reason: 'Family visit in Bahir Dar' }
    },
    {
        id: 'req_2',
        profile: { first_name: 'Dawit', last_name: 'Mulugeta' },
        type: 'leave',
        status: 'approved' as RequestStatus,
        details: { startDate: '2024-03-05', endDate: '2024-03-06', reason: 'Medical checkup' }
    }
];

export default function ManagerRequestsPage() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);

    const handleAction = async (id: string, status: RequestStatus) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const headers = ['Employee', 'Type', 'Dates', 'Status', 'Actions'];
    const rows = requests.map((req, idx) => [
        <div className="flex items-center gap-3" key={`emp-${idx}`}>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black border border-border-main text-gray-700">
                {req.profile.first_name[0]}
            </div>
            <span className="font-semibold text-gray-900">{req.profile.first_name} {req.profile.last_name}</span>
        </div>,
        <span className="font-semibold uppercase tracking-wider text-[11px] text-gray-500" key={`type-${idx}`}>{req.type}</span>,
        <div key={`dates-${idx}`}>
            <div className="font-medium text-gray-700">{new Date(req.details.startDate).toLocaleDateString()} - {new Date(req.details.endDate).toLocaleDateString()}</div>
            <div className="text-[10px] text-gray-400 italic mt-0.5 line-clamp-1">"{req.details.reason}"</div>
        </div>,
        <HRBadge variant={req.status === 'approved' ? 'success' : req.status === 'denied' ? 'error' : 'warning'} key={`status-${idx}`}>
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
                            <span className="text-2xl font-bold text-primary">1</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</span>
                        </HRCard>
                    </div>
                </header>

                <section>
                    <HRTable headers={headers} rows={rows} />
                </section>
            </div>
        </WebAdminLayout>
    );
}
