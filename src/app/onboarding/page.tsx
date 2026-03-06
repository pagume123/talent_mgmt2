import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { Shield } from 'lucide-react';

export default async function OnboardingPage() {
    const supabase = await createClient();
    if (!supabase) redirect('/auth/login');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // Already has a company → go to dashboard
    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

    if (profile?.company_id) redirect('/dashboard');

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Nav */}
            <nav className="h-14 bg-surface border-b border-border-main flex items-center px-8 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-primary rounded-[4px]" />
                    <span className="font-bold tracking-tight">Talent HR</span>
                </div>
                <div className="ml-auto text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    Setup Wizard
                </div>
            </nav>

            {/* Body */}
            <div className="flex-1 flex items-start justify-center pt-16 px-6 pb-16">
                <div className="w-full max-w-xl">
                    <OnboardingWizard />
                </div>
            </div>
        </div>
    );
}
