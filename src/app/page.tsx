import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Shield, Zap, TrendingUp, Star, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const FEATURE_HIGHLIGHTS = [
  { icon: '📋', title: 'Bilingual Policies', desc: 'AI writes culturally-appropriate Amharic policies from your English drafts.' },
  { icon: '📱', title: 'Telegram Mini App', desc: 'Employees access their handbook, submit requests, and claim perks — all from Telegram.' },
  { icon: '⚙️', title: 'Archetype Engine', desc: 'Pick your company type. Get pre-configured rules, rhythms, and defaults in seconds.' },
];

export default async function LandingPage() {
  // If user is already logged in, redirect to dashboard
  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      if (profile?.company_id) redirect('/dashboard');
      else redirect('/onboarding');
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Top Nav */}
      <nav className="h-14 bg-surface border-b border-border-main flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-primary rounded-[4px]" />
          <span className="font-bold tracking-tight">Talent HR</span>
        </div>
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign In →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          Built for Ethiopian Companies
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-[1.15] mb-6">
          The HR platform that<br />thinks in your language.
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
          Configure your company archetype. Get instant policy templates in English and Amharic.
          Give employees a Telegram-native experience.
        </p>
        <div className="flex items-center gap-4 justify-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 h-11 rounded-[6px] hover:bg-[#006ee6] transition-colors text-sm"
          >
            Create Your Company <ArrowRight size={16} />
          </Link>
          <Link
            href="#archetypes"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            See archetypes ↓
          </Link>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="border-t border-border-main bg-surface">
        <div className="max-w-4xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURE_HIGHLIGHTS.map(f => (
            <div key={f.title} className="space-y-2">
              <div className="text-xl">{f.icon}</div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Archetypes Section */}
      <section id="archetypes" className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Choose your company archetype</h2>
          <p className="text-gray-500 mt-2 text-sm">Five distinct operating models. One click sets up your default rules, rhythms, and policies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Shield, label: 'Compliance-First', tagline: 'Highly regulated. Clear rules. Strong approvals. Conservative perks.', color: 'text-[#1D4ED8] bg-[#EFF6FF] border-[#BFDBFE]' },
            { icon: Zap, label: 'Execution-First', tagline: 'Daily/weekly rhythms. Practical handbook. Clear SOPs. Strong supervisor system.', color: 'text-[#C2410C] bg-[#FFF7ED] border-[#FED7AA]' },
            { icon: TrendingUp, label: 'Sales & Growth', tagline: 'Aggressive targets. Incentives. Fast hiring. Training + performance dashboards.', color: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]' },
            { icon: Star, label: 'Craft & Quality', tagline: 'Apprenticeship mindset. Quality gates. Skills matrix. Peer review loops.', color: 'text-[#7E22CE] bg-[#FDF4FF] border-[#E9D5FF]' },
            { icon: Heart, label: 'People & Culture', tagline: 'Engagement, feedback loops, coaching. Strong rituals. Perks and recognition.', color: 'text-[#BE123C] bg-[#FFF1F2] border-[#FECDD3]' },
          ].map(({ icon: Icon, label, tagline, color }) => (
            <div key={label} className={`bg-surface border border-border-main rounded-[6px] p-6 hover:border-gray-400 transition-colors`}>
              <div className={`w-9 h-9 ${color.split(' ')[1]} border ${color.split(' ')[2]} rounded-[6px] flex items-center justify-center mb-4`}>
                <Icon size={18} className={color.split(' ')[0]} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{tagline}</p>
            </div>
          ))}
          {/* CTA Card */}
          <Link
            href="/auth/login"
            className="bg-primary rounded-[6px] p-6 flex flex-col justify-between hover:bg-[#006ee6] transition-colors group"
          >
            <div>
              <div className="w-9 h-9 bg-white/20 rounded-[6px] flex items-center justify-center mb-4">
                <ArrowRight size={18} className="text-white" />
              </div>
              <h3 className="font-bold text-white mb-1">Start building</h3>
              <p className="text-sm text-blue-100">Set up your company in under 5 minutes.</p>
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest mt-6 group-hover:translate-x-1 transition-transform inline-block">
              Create Company →
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-main py-8 px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[11px] text-gray-400">
          <span>© 2025 Talent HR. Built for Ethiopian businesses.</span>
          <div className="flex items-center gap-2">
            <CheckCircle size={12} className="text-[#15803D]" />
            <span>Supabase connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
