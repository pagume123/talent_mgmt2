import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import WebAdminLayout from '@/components/layout/WebAdminLayout';
import HRCard from '@/components/ui/HRCard';
import HRBadge from '@/components/ui/HRBadge';
import Link from 'next/link';
import { FileText, Users, ClipboardList, Plus, Settings } from 'lucide-react';
import { ARCHETYPE_PROFILES } from '@/lib/utils/archetypes';
import HRButton from '@/components/ui/HRButton';

export default async function DashboardPage() {
    const supabase = await createClient();
    if (!supabase) redirect('/auth/login');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // Load profile + company
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('user_id', user.id)
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
            <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-premium-in">

                {/* Header */}
                <header className="flex items-end justify-between border-b border-border-main pb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(0,122,255,0.5)]" />
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Administrative Control</p>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">{company?.name ?? 'Your Company'}</h1>
                        {archetypeProfile && (
                            <div className="flex items-center gap-3 pt-2">
                                <HRBadge variant="info" className="px-3 py-1 font-black tracking-widest">{archetypeProfile.name.toUpperCase()}</HRBadge>
                                <span className="text-xs font-bold text-gray-400 border-l border-border-main pl-3 italic">
                                    {archetypeProfile.who_this_is_for.split('.')[0]}.
                                </span>
                            </div>
                        )}
                    </div>
                    <Link href="/policies/new">
                        <HRButton className="h-12 px-8 shadow-primary/20 hover:shadow-primary/40">
                            <Plus size={16} className="mr-2" /> NEW POLICY
                        </HRButton>
                    </Link>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { label: 'Active Policies', value: policyCount ?? 0, icon: FileText, href: '/policies/new', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Total Staff', value: employeeCount ?? 0, icon: Users, href: '/dashboard/employees', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Pending Requests', value: requestCount ?? 0, icon: ClipboardList, href: '/manager/requests', color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map(stat => (
                        <Link key={stat.label} href={stat.href} className="group">
                            <HRCard className="relative overflow-hidden border-none shadow-hr-md group-hover:shadow-hr-lg group-hover:-translate-y-1">
                                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 ${stat.bg} rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500`} />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <div className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{stat.value}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</div>
                                    </div>
                                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center border border-white/50 shadow-inner`}>
                                        <stat.icon size={22} className={stat.color} />
                                    </div>
                                </div>
                            </HRCard>
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Archetype Profile Card */}
                    <div className="lg:col-span-2">
                        {archetypeProfile && (
                            <HRCard className="h-full border-none shadow-hr-md">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Organization DNA</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Intelligence Architecture</p>
                                    </div>
                                    <Link href="/settings">
                                        <HRButton variant="secondary" className="h-8 px-3 text-[9px]">
                                            <Settings size={12} className="mr-1.5" /> EDIT
                                        </HRButton>
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-secondary p-5 rounded-hr border border-border-main/50">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-3 border-b border-primary/10 pb-2">Core Values</div>
                                        <div className="space-y-2">
                                            {archetypeProfile.values.map(v => (
                                                <div key={v} className="text-[12px] font-bold text-gray-700 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-primary rounded-full" />
                                                    {v}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-secondary p-5 rounded-hr border border-border-main/50">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-3 border-b border-primary/10 pb-2">Operating Model</div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-[9px] font-black text-gray-300 block uppercase">Decisions</span>
                                                <span className="text-[11px] font-bold text-gray-700 capitalize">{archetypeProfile.decision_style.replace('-', ' ')}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-gray-300 block uppercase">Cadence</span>
                                                <span className="text-[11px] font-bold text-gray-700">{archetypeProfile.meeting_cadence}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-gray-300 block uppercase">Reviews</span>
                                                <span className="text-[11px] font-bold text-gray-700 capitalize">{archetypeProfile.performance_philosophy.replace(/-/g, ' ')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-secondary p-5 rounded-hr border border-border-main/50">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-3 border-b border-primary/10 pb-2">Benefits Engine</div>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-[9px] font-black text-gray-300 block uppercase">Pay Scale</span>
                                                <span className="text-[11px] font-bold text-gray-700 capitalize">{archetypeProfile.compensation_philosophy.replace('-', ' ')}</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-gray-300 block uppercase">Leave Accrual</span>
                                                <span className="text-[11px] font-bold text-gray-700">{archetypeProfile.leave_accrual_days_per_year} days / year</span>
                                            </div>
                                            <div className="pt-1">
                                                <HRBadge variant="info" className="text-[8px] px-2 py-0.5">{archetypeProfile.leave_philosophy.toUpperCase()}</HRBadge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border-main space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LLM Writing Agent Context</div>
                                        <div className="text-[9px] font-black text-green-500 uppercase tracking-widest">Active & Calibrated</div>
                                    </div>
                                    <p className="text-[11px] text-gray-500 leading-relaxed bg-[#f8fafc] border border-border-main rounded-hr p-4 font-mono italic">
                                        "{archetypeProfile.llm_system_context}"
                                    </p>
                                </div>
                            </HRCard>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <HRCard className="border-none shadow-hr-md" padding={false}>
                            <div className="p-6 border-b border-border-main">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Rapid Control</h2>
                            </div>
                            <div className="flex flex-col">
                                {[
                                    { label: 'CREATE POLICY', href: '/policies/new', desc: 'AI-assisted generation', icon: FileText },
                                    { label: 'STAFF DIRECTORY', href: '/dashboard/employees', desc: 'Manage users & invites', icon: Users },
                                    { label: 'REVIEW CENTER', href: '/manager/requests', desc: 'Approve leave & perks', icon: ClipboardList },
                                ].map((action, i) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className={`p-6 hover:bg-tint-blue transition-premium group flex items-start gap-4 ${i !== 2 ? 'border-b border-border-main/50' : ''}`}
                                    >
                                        <div className="w-10 h-10 bg-white border border-border-main shadow-hr-sm rounded-lg flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/20 group-hover:shadow-hr-md transition-all">
                                            <action.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="font-black text-[11px] text-gray-900 tracking-widest group-hover:text-primary transition-colors">{action.label}</div>
                                            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{action.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </HRCard>

                        <HRCard className="bg-primary border-none shadow-lg shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Next Steps</span>
                                </div>
                                <h3 className="text-white font-black text-lg tracking-tight leading-tight">Generate your first AI Policy today</h3>
                                <p className="text-white/70 text-xs font-bold leading-relaxed">
                                    Our LLM is ready to draft bilingual labor agreements based on your company DNA.
                                </p>
                                <HRButton variant="secondary" className="w-full bg-white text-primary border-none hover:bg-white/90 font-black text-[10px]">
                                    LAUNCH AI WRITER
                                </HRButton>
                            </div>
                        </HRCard>
                    </div>
                </div>

            </div>
        </WebAdminLayout>
    );
}
