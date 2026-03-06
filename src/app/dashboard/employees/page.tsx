'use client';

import { useState, useEffect } from 'react';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRCard from '@/components/ui/HRCard';
import HRBadge from '@/components/ui/HRBadge';
import { Users, Plus, UserPlus, Copy, CheckCircle, Search, Mail } from 'lucide-react';

interface Employee {
    id: string;
    full_name: string;
    email: string;
    role: string;
    telegram_id: string | null;
    created_at: string;
    invitations: {
        token: string;
        status: string;
    }[];
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({ full_name: '', email: '', role: 'employee' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (data.employees) setEmployees(data.employees);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddModal(false);
                setFormData({ full_name: '', email: '', role: 'employee' });
                fetchEmployees();
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyToken = (token: string) => {
        navigator.clipboard.writeText(token);
        setCopySuccess(token);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <WebAdminLayout>
            <div className="max-w-5xl mx-auto space-y-8 pb-10">

                {/* Header */}
                <header className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Company Staff</p>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employee Directory</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage team members and invite them to the Telegram Mini App.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 h-9 rounded-[6px] hover:bg-[#006ee6] transition-colors text-xs"
                    >
                        <Plus size={14} /> Add Employee
                    </button>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <HRCard className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{employees.length}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Total Staff</div>
                        </div>
                        <div className="w-9 h-9 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main text-gray-400">
                            <Users size={18} />
                        </div>
                    </HRCard>
                    <HRCard className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{employees.filter(e => e.telegram_id).length}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Linked to TMA</div>
                        </div>
                        <div className="w-9 h-9 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main text-gray-400">
                            <CheckCircle size={18} />
                        </div>
                    </HRCard>
                    <HRCard className="flex items-center justify-between">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{employees.filter(e => !e.telegram_id && e.invitations?.[0]?.status === 'pending').length}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Pending Invite</div>
                        </div>
                        <div className="w-9 h-9 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main text-gray-400">
                            <Mail size={18} />
                        </div>
                    </HRCard>
                </div>

                {/* Search & List */}
                <HRCard padding={false}>
                    <div className="p-4 border-b border-border-main flex items-center gap-3">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="bg-transparent border-none text-sm focus:ring-0 w-full font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-border-main">
                                    <th className="px-6 py-3 font-black">Employee</th>
                                    <th className="px-6 py-3 font-black">Role</th>
                                    <th className="px-6 py-3 font-black">TMA Status</th>
                                    <th className="px-6 py-3 font-black text-right">Action / Token</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-main">
                                {isLoading ? (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400 italic">Loading employee list...</td></tr>
                                ) : filteredEmployees.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400 italic">No employees found matching your search.</td></tr>
                                ) : filteredEmployees.map(emp => {
                                    const pendingInvite = emp.invitations?.find(i => i.status === 'pending');
                                    const isLinked = !!emp.telegram_id;

                                    return (
                                        <tr key={emp.id} className="group hover:bg-secondary/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm text-gray-900">{emp.full_name}</div>
                                                <div className="text-xs text-gray-400">{emp.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <HRBadge variant={emp.role === 'admin' ? 'info' : 'info'}>
                                                    {emp.role.toUpperCase()}
                                                </HRBadge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isLinked ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                        Linked
                                                    </div>
                                                ) : pendingInvite ? (
                                                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                        Invite Sent
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-gray-300 italic">Not Invited</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {!isLinked && pendingInvite && (
                                                    <div className="inline-flex items-center gap-2 bg-white border border-border-main rounded-md p-1 pl-3">
                                                        <code className="text-[10px] font-black tracking-widest text-primary">{pendingInvite.token}</code>
                                                        <button
                                                            onClick={() => handleCopyToken(pendingInvite.token)}
                                                            className={`p-1.5 rounded-[4px] transition-colors ${copySuccess === pendingInvite.token ? 'bg-green-50 text-green-600' : 'hover:bg-secondary text-gray-400'}`}
                                                        >
                                                            {copySuccess === pendingInvite.token ? <CheckCircle size={14} /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </HRCard>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <HRCard className="max-w-md w-full animate-in zoom-in-95 fade-in duration-200" padding={false}>
                            <div className="p-6 border-b border-border-main">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                    <UserPlus className="text-primary" size={20} />
                                    Invite New Employee
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Fill in the details to generate an invitation token.</p>
                            </div>
                            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
                                {error && (
                                    <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-[6px] border border-red-100 uppercase tracking-wider">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="hr-input w-full"
                                        placeholder="John Doe"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="hr-input w-full"
                                        placeholder="john@company.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Role</label>
                                    <select
                                        className="hr-input w-full"
                                        value={formData.role}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="supervisor">Supervisor / Manager</option>
                                        <option value="admin">System Admin</option>
                                    </select>
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
                                        {isSubmitting ? 'GENERATING...' : 'GENERATE INVITE'}
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
