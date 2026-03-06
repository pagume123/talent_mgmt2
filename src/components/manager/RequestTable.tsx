'use client';

import { RequestStatus } from '@/lib/types';

interface Request {
    id: string;
    profile: {
        first_name: string;
        last_name: string;
    };
    type: string;
    status: RequestStatus;
    details: {
        startDate: string;
        endDate: string;
        reason: string;
    };
    created_at: string;
}

interface RequestTableProps {
    requests: Request[];
    onAction: (id: string, status: RequestStatus) => Promise<void>;
}

export default function RequestTable({ requests, onAction }: RequestTableProps) {
    const getStatusStyle = (status: RequestStatus) => {
        switch (status) {
            case 'approved':
                return 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
            case 'denied':
                return 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]';
            default:
                return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                    <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Employee</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Type</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Dates</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Status</th>
                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((req) => (
                        <tr key={req.id} className="group hover:bg-gray-50/30 transition-colors">
                            <td className="px-6 py-5 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">
                                        {req.profile.first_name[0]}
                                    </div>
                                    <span className="font-bold text-gray-900">{req.profile.first_name} {req.profile.last_name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 border-b border-gray-100">
                                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">{req.type}</span>
                            </td>
                            <td className="px-6 py-5 border-b border-gray-100">
                                <div className="text-sm text-gray-500 font-medium">
                                    {new Date(req.details.startDate).toLocaleDateString()} - {new Date(req.details.endDate).toLocaleDateString()}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 italic">"{req.details.reason}"</div>
                            </td>
                            <td className="px-6 py-5 border-b border-gray-100">
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                                    {req.status}
                                </span>
                            </td>
                            <td className="px-6 py-5 border-b border-gray-100 text-right">
                                {req.status === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onAction(req.id, 'denied')}
                                            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Deny
                                        </button>
                                        <button
                                            onClick={() => onAction(req.id, 'approved')}
                                            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white hover:bg-black rounded-lg transition-all shadow-sm active:scale-95"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">
                                No requests found in the system.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
