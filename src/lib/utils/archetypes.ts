// ============================================================
// ARCHETYPE TYPE DEFINITIONS
// Rich, LLM-fillable structured data for each company archetype.
// Every field is designed to be passed as context to an LLM.
// ============================================================

export type CompanyArchetype =
    | 'compliance-first'
    | 'execution-first'
    | 'sales-and-growth'
    | 'craft-and-quality'
    | 'people-and-culture';

export interface ArchetypeProfile {
    id: CompanyArchetype;

    // Identity
    name: string;
    who_this_is_for: string;

    // Values & Behaviors
    values: string[];            // 5–7 core values
    behaviors_do: string[];      // Encouraged behaviors
    behaviors_dont: string[];    // Discouraged behaviors

    // Operating Model
    decision_style: 'centralized' | 'team-led' | 'hybrid';
    decision_style_description: string;

    // Rhythms & Cycles
    meeting_cadence: string;
    performance_philosophy: 'ranked' | 'coaching' | 'okr' | 'hybrid-okr-coaching';
    performance_philosophy_description: string;

    // Pay & Benefits
    compensation_philosophy: 'fixed-heavy' | 'variable-heavy' | 'balanced';
    compensation_philosophy_description: string;
    leave_philosophy: 'strict' | 'flexible' | 'trust-based';
    leave_philosophy_description: string;
    leave_accrual_days_per_year: number;
    perk_style: ('cash' | 'wellness' | 'learning' | 'family-support' | 'incentives' | 'recognition')[];
    perk_style_description: string;

    // LLM System Context (injected into all AI prompts for this company)
    llm_system_context: string;
}

// ============================================================
// ARCHETYPE CATALOG
// ============================================================
export const ARCHETYPE_PROFILES: Record<CompanyArchetype, ArchetypeProfile> = {
    'compliance-first': {
        id: 'compliance-first',
        name: 'Compliance-First Employer',
        who_this_is_for: 'Banks, financial institutions, NGOs, healthcare providers, and any business operating under strict regulatory frameworks.',

        values: ['Accountability', 'Transparency', 'Risk Management', 'Integrity', 'Due Diligence'],
        behaviors_do: [
            'Document every decision with a written record',
            'Follow the approval chain — no shortcuts',
            'Report exceptions and incidents without delay',
            'Treat every policy as legally binding',
        ],
        behaviors_dont: [
            'Skip approval steps, even for small decisions',
            'Share sensitive information verbally without documentation',
            'Make exceptions to policy without written authorization',
        ],

        decision_style: 'centralized',
        decision_style_description: 'All significant decisions flow through designated approvers. Multiple sign-offs are normal and expected.',

        meeting_cadence: 'Weekly team reviews + bi-weekly compliance audits',
        performance_philosophy: 'ranked',
        performance_philosophy_description: 'Formal bi-annual appraisals tied to compliance KPIs. Performance rankings determine progression.',

        compensation_philosophy: 'fixed-heavy',
        compensation_philosophy_description: 'Stable, market-benchmarked salaries. Variable pay is limited and tied to non-violation records.',
        leave_philosophy: 'strict',
        leave_philosophy_description: 'Leave must be applied for at least 5 working days in advance and approved through two management layers.',
        leave_accrual_days_per_year: 18,
        perk_style: ['wellness', 'family-support'],
        perk_style_description: 'Conservative perks focused on stability: health insurance, pension contributions, and family medical support.',

        llm_system_context: `You are an HR policy writer for a Compliance-First organization. Write in formal, precise language. Use numbered clauses and exhaustive definitions. Every policy must leave zero ambiguity. Reference Ethiopian labor law where applicable. Avoid casual or colloquial phrasing.`,
    },

    'execution-first': {
        id: 'execution-first',
        name: 'Execution-First SME (Ops-Driven)',
        who_this_is_for: 'Logistics companies, manufacturing SMEs, field operations, retail, and any business where daily throughput is the primary metric.',

        values: ['Speed', 'Ownership', 'Clarity', 'Reliability', 'Execution'],
        behaviors_do: [
            'Follow SOPs precisely and update them when they break',
            'Raise blockers immediately — do not wait for a meeting',
            'Commit to deadlines publicly and deliver on them',
            'Take ownership from assignment to completion',
        ],
        behaviors_dont: [
            'Pass problems upward without a proposed solution',
            'Wait for permission when the SOP is clear',
            'Miss a deadline without proactive communication',
        ],

        decision_style: 'hybrid',
        decision_style_description: 'Day-to-day decisions are pushed to supervisors and frontline staff. Strategic decisions remain centralized with leadership.',

        meeting_cadence: 'Daily standup (15 min) + weekly operations review',
        performance_philosophy: 'okr',
        performance_philosophy_description: 'Monthly OKR reviews tied to operational metrics. Fast feedback loops. Underperformance is addressed directly within the cycle.',

        compensation_philosophy: 'balanced',
        compensation_philosophy_description: 'Base salary strong enough to retain talent, with monthly performance bonuses tied to operational targets.',
        leave_philosophy: 'strict',
        leave_philosophy_description: 'Leave planned around operational capacity. At least 3 working days notice required. Blackout periods around peak operations.',
        leave_accrual_days_per_year: 15,
        perk_style: ['cash', 'wellness'],
        perk_style_description: 'Practical perks: transport allowance, meal stipends, health insurance. Rewards are tangible and immediate.',

        llm_system_context: `You are an HR policy writer for an Execution-First, operations-driven SME. Write in direct, action-oriented language. Lead with "what to do" before explaining "why." Use bullet points and numbered steps. Policies should read like SOPs. Be brief and unambiguous.`,
    },

    'sales-and-growth': {
        id: 'sales-and-growth',
        name: 'Sales-and-Growth Employer',
        who_this_is_for: 'Sales organizations, startups in growth mode, B2B companies, and any business where revenue generation and team expansion are the core drivers.',

        values: ['Growth', 'Performance', 'Energy', 'Initiative', 'Winning'],
        behaviors_do: [
            'Set ambitious personal targets and pursue them relentlessly',
            'Share wins publicly and celebrate team milestones',
            'Onboard new hires fast — time-to-productivity matters',
            'Bring creative solutions to hitting targets',
        ],
        behaviors_dont: [
            'Accept average performance as the standard',
            'Keep wins private — recognition is part of the culture',
            'Let pipeline stagnate without escalating immediately',
        ],

        decision_style: 'team-led',
        decision_style_description: 'Sales leaders and individual contributors have high autonomy to make tactical decisions. Speed over consensus.',

        meeting_cadence: 'Daily pipeline huddle + weekly target review + monthly all-hands',
        performance_philosophy: 'ranked',
        performance_philosophy_description: 'Leaderboards, monthly rankings, and transparent scorecards. High performers are recognized publicly and rewarded immediately.',

        compensation_philosophy: 'variable-heavy',
        compensation_philosophy_description: 'Competitive base with significant commission and bonus potential. Top performers can earn 2–3x base.',
        leave_philosophy: 'flexible',
        leave_philosophy_description: 'Flexible leave with target-based discretion. Employees who exceed targets have more flexibility. Leave should not affect pipeline coverage.',
        leave_accrual_days_per_year: 12,
        perk_style: ['cash', 'incentives', 'recognition'],
        perk_style_description: 'Incentive-driven perks: cash bonuses, team trips, public recognition programs, and fast-track promotion paths.',

        llm_system_context: `You are an HR policy writer for a Sales-and-Growth organization. Write in energetic, motivational language. Speak directly to the employee using "you." Highlight the connection between behavior and reward. Be concise and punchy. Policies should feel exciting, not bureaucratic.`,
    },

    'craft-and-quality': {
        id: 'craft-and-quality',
        name: 'Craft-and-Quality Employer',
        who_this_is_for: 'Engineering firms, design studios, specialty manufacturers, software companies, and any business where the quality of output defines the brand.',

        values: ['Excellence', 'Mentorship', 'Craftsmanship', 'Continuous Learning', 'Peer Trust', 'Precision'],
        behaviors_do: [
            'Seek peer review before finalizing any significant piece of work',
            'Invest time in mentoring junior colleagues',
            'Document your craft — share what you learn',
            'Push back on quality standards that are being compromised',
        ],
        behaviors_dont: [
            'Ship work you are not proud of to hit an arbitrary deadline',
            'Dismiss feedback from peers as personal criticism',
            'Hoard knowledge — knowledge sharing is a performance indicator',
        ],

        decision_style: 'team-led',
        decision_style_description: 'Decisions related to craft, quality, and methodology are made by the team. Senior practitioners lead through expertise, not hierarchy.',

        meeting_cadence: 'Weekly craft review + monthly skills showcase + quarterly retrospectives',
        performance_philosophy: 'coaching',
        performance_philosophy_description: 'Quarterly coaching conversations using a skills matrix. Progression is based on demonstrated craft growth and peer endorsements, not time-in-role.',

        compensation_philosophy: 'fixed-heavy',
        compensation_philosophy_description: 'Salaries set above market for the demonstrated skill level. Annual increments tied to skills matrix progression.',
        leave_philosophy: 'flexible',
        leave_philosophy_description: 'Flexible leave with trust-based planning. Team capacity is considered collaboratively. Long-form leave for skill sabbaticals is encouraged.',
        leave_accrual_days_per_year: 20,
        perk_style: ['learning', 'wellness'],
        perk_style_description: 'Learning-forward perks: annual education budget, conference attendance, tool/equipment stipends, and structured mentorship programs.',

        llm_system_context: `You are an HR policy writer for a Craft-and-Quality organization. Write with care and precision. Explain the reasoning behind every policy. Use concrete examples where helpful. Policies should feel thoughtful and intentional. Avoid corporate boilerplate — every sentence should be earned.`,
    },

    'people-and-culture': {
        id: 'people-and-culture',
        name: 'People-and-Culture Employer',
        who_this_is_for: 'Mission-driven organizations, NGOs, hospitality, education, and any business where employee engagement and team belonging are core to the operating model.',

        values: ['Belonging', 'Wellbeing', 'Recognition', 'Community', 'Psychological Safety', 'Authenticity'],
        behaviors_do: [
            'Check in — on work and on people as humans',
            'Celebrate milestones publicly: work anniversaries, personal achievements',
            'Give feedback with care and candor — make it a gift',
            'Create space for every voice in team discussions',
        ],
        behaviors_dont: [
            'Dismiss how someone feels about a process',
            'Prioritize speed over the health of your team',
            'Let recognition become an afterthought',
        ],

        decision_style: 'team-led',
        decision_style_description: 'Decisions are made collaboratively. Leaders facilitate rather than dictate. Consent-based or consensus-based processes are common.',

        meeting_cadence: 'Weekly 1-on-1s + bi-weekly team rituals + monthly all-hands with a "culture segment"',
        performance_philosophy: 'hybrid-okr-coaching',
        performance_philosophy_description: 'Light OKRs paired with ongoing coaching conversations. No forced rankings. Growth is personal and holistic.',

        compensation_philosophy: 'balanced',
        compensation_philosophy_description: 'Market-matching salaries with a strong benefits package. The total compensation story includes non-cash perks.',
        leave_philosophy: 'trust-based',
        leave_philosophy_description: 'Generous flexible leave. Employees self-manage leave with team awareness. Mandatory minimum leave enforced to prevent burnout.',
        leave_accrual_days_per_year: 25,
        perk_style: ['wellness', 'family-support', 'recognition', 'learning'],
        perk_style_description: 'Holistic perks: mental health support, family medical cover, learning budgets, peer recognition programs, and team celebration funds.',

        llm_system_context: `You are an HR policy writer for a People-and-Culture organization. Write in a warm, human, first-person-plural tone using "we" and "our team." Policies should feel like a letter to a valued colleague, not a legal document. Acknowledge the human behind the role. Ethiopian community and collective wellbeing values are central — lean into them.`,
    },
};

// ============================================================
// ARCHETYPE SETTINGS (for company_settings JSON column)
// ============================================================
export interface CompanySettings {
    archetype_profile: ArchetypeProfile;
    [key: string]: any;
}

export function generateCompanySettings(archetype: CompanyArchetype): CompanySettings {
    return {
        archetype_profile: ARCHETYPE_PROFILES[archetype],
    };
}

// ============================================================
// UI CATALOG (for archetype selection card rendering)
// ============================================================
export const ARCHETYPES_UI = [
    {
        id: 'compliance-first' as CompanyArchetype,
        label: 'Compliance-First',
        tagline: 'Highly regulated. Clear rules. Strong approvals.',
        icon: 'Shield',
        accent: 'border-[#BFDBFE] text-[#1D4ED8]',
        bg: 'bg-[#EFF6FF]',
    },
    {
        id: 'execution-first' as CompanyArchetype,
        label: 'Execution-First',
        tagline: 'Daily rhythms. Practical handbook. Clear SOPs.',
        icon: 'Zap',
        accent: 'border-[#FED7AA] text-[#C2410C]',
        bg: 'bg-[#FFF7ED]',
    },
    {
        id: 'sales-and-growth' as CompanyArchetype,
        label: 'Sales & Growth',
        tagline: 'Aggressive targets. Incentives. Fast hiring.',
        icon: 'TrendingUp',
        accent: 'border-[#BBF7D0] text-[#15803D]',
        bg: 'bg-[#F0FDF4]',
    },
    {
        id: 'craft-and-quality' as CompanyArchetype,
        label: 'Craft & Quality',
        tagline: 'Apprenticeship mindset. Quality gates. Peer review.',
        icon: 'Star',
        accent: 'border-[#E9D5FF] text-[#7E22CE]',
        bg: 'bg-[#FDF4FF]',
    },
    {
        id: 'people-and-culture' as CompanyArchetype,
        label: 'People & Culture',
        tagline: 'Engagement. Coaching. Strong rituals. Recognition.',
        icon: 'Heart',
        accent: 'border-[#FECDD3] text-[#BE123C]',
        bg: 'bg-[#FFF1F2]',
    },
] as const;
