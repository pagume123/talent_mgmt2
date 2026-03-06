import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRCard from '@/components/ui/HRCard';
import HRBadge from '@/components/ui/HRBadge';
import Link from 'next/link';
import { FileText, Users, ClipboardList, Plus, Settings } from 'lucide-react';
import { ARCHETYPE_PROFILES } from '@/lib/utils/archetypes';

export default async function DashboardPage() {
    const supabase = await createClient();
    if (!supabase) redirect('/auth/login');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // Load profile + company
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('id', user.id)
        .single();

    if (!profile?.company_id) redirect('/onboarding');

    const company = profile.companies as any;
    const archetype = company?.archetype;
    const archetypeProfile = archetype ? ARCHETYPE_PROFILES[archetype as keyof typeof ARCHETYPE_PROFILES] : null;

    // Counts
    const [{ count: policyCount }, { count: requestCount }, { count: employeeCount }] = await Promise.all([
        supabase.from('policies').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
        supabase.from('requests').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
    ]);

    return (
        <WebAdminLayout>
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dashboard</p>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{company?.name ?? 'Your Company'}</h1>
                        {archetypeProfile && (
                            <div className="flex items-center gap-2 mt-2">
                                <HRBadge variant="info">{archetypeProfile.name}</HRBadge>
                                <span className="text-xs text-gray-400">{archetypeProfile.who_this_is_for.split('.')[0]}.</span>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/policies/new"
                        className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 h-9 rounded-[6px] hover:bg-[#006ee6] transition-colors text-xs"
                    >
                        <Plus size={14} /> New Policy
                    </Link>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Published Policies', value: policyCount ?? 0, icon: FileText, href: '#' },
                        { label: 'Employees', value: employeeCount ?? 0, icon: Users, href: '#' },
                        { label: 'Pending Requests', value: requestCount ?? 0, icon: ClipboardList, href: '/manager/requests' },
                    ].map(stat => (
                        <Link key={stat.label} href={stat.href}>
                            <HRCard className="flex items-center justify-between hover:border-gray-400 transition-colors">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
                                </div>
                                <div className="w-9 h-9 bg-secondary rounded-[6px] flex items-center justify-center border border-border-main">
                                    <stat.icon size={18} className="text-gray-400" />
                                </div>
                            </HRCard>
                        </Link>
                    ))}
                </div>

                {/* Archetype Profile Card */}
                {archetypeProfile && (
                    <HRCard>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="font-bold text-gray-900">Company Archetype Profile</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Your LLM context — used when generating policies and communications.</p>
                            </div>
                            <Link href="/settings" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-gray-600">
                                <Settings size={12} /> Edit
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Core Values</div>
                                <div className="space-y-1">
                                    {archetypeProfile.values.map(v => (
                                        <div key={v} className="text-gray-700">· {v}</div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Operating Model</div>
                                <div className="space-y-1 text-gray-700">
                                    <div className="capitalize">Decision: {archetypeProfile.decision_style.replace('-', ' ')}</div>
                                    <div>Meetings: {archetypeProfile.meeting_cadence}</div>
                                    <div className="capitalize">Performance: {archetypeProfile.performance_philosophy.replace(/-/g, ' ')}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Compensation & Leave</div>
                                <div className="space-y-1 text-gray-700">
                                    <div className="capitalize">Pay: {archetypeProfile.compensation_philosophy.replace('-', ' ')}</div>
                                    <div className="capitalize">Leave: {archetypeProfile.leave_philosophy}</div>
                                    <div>{archetypeProfile.leave_accrual_days_per_year} days/year</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border-main">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">LLM Policy Writing Tone</div>
                            <p className="text-sm text-gray-600 leading-relaxed bg-secondary border border-border-main rounded-[6px] p-4 font-mono">
                                {archetypeProfile.llm_system_context}
                            </p>
                        </div>
                    </HRCard>
                )}

                {/* Quick Actions */}
                <HRCard padding={false}>
                    <div className="p-5 border-b border-border-main">
                        <h2 className="font-bold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-border-main">
                        {[
                            { label: 'Create Policy', href: '/policies/new', desc: 'Write and translate with AI' },
                            { label: 'Manager View', href: '/manager/requests', desc: 'Review team\'s requests' },
                            { label: 'Invite Employee', href: '#', desc: 'Share your Telegram bot link' },
                        ].map(action => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="p-5 hover:bg-secondary transition-colors group"
                            >
                                <div className="font-semibold text-sm text-gray-900 group-hover:text-primary transition-colors">{action.label}</div>
                                <div className="text-xs text-gray-400 mt-1">{action.desc}</div>
                            </Link>
                        ))}
                    </div>
                </HRCard>

            </div>
        </WebAdminLayout>
    );
}
