export type OnboardingStep = {
    id: string;
    question: string;
    type: 'select' | 'input';
    description?: string;
    options?: { label: string; value: string; tagline?: string }[];
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'company_name',
        question: "What is your company's name?",
        type: 'input',
        description: 'This will be your workspace title across all features and employee-facing views.',
    },
    {
        id: 'industry',
        question: "What's your company's primary industry?",
        type: 'select',
        options: [
            { label: 'Technology & Software', value: 'tech' },
            { label: 'Financial Services', value: 'finance' },
            { label: 'Healthcare & Pharma', value: 'healthcare' },
            { label: 'Logistics & Operations', value: 'logistics' },
            { label: 'Retail & Consumer', value: 'retail' },
            { label: 'Education & NGO', value: 'education' },
            { label: 'Manufacturing', value: 'manufacturing' },
            { label: 'Other', value: 'other' },
        ],
    },
    {
        id: 'size',
        question: 'How many employees are currently on your team?',
        type: 'select',
        options: [
            { label: '1–10', value: 'micro', tagline: 'Micro team' },
            { label: '11–50', value: 'small', tagline: 'Small business' },
            { label: '51–200', value: 'medium', tagline: 'Growing company' },
            { label: '201+', value: 'large', tagline: 'Enterprise' },
        ],
    },
    {
        id: 'archetype',
        question: 'Which best describes how your company operates?',
        type: 'select',
        description: 'Your archetype pre-configures default policies, rhythms, and AI writing tone — all editable later.',
        options: [
            {
                label: 'Compliance-First',
                value: 'compliance-first',
                tagline: 'Highly regulated. Clear rules. Strong approvals. Conservative perks.',
            },
            {
                label: 'Execution-First',
                value: 'execution-first',
                tagline: 'Daily/weekly rhythms. Practical handbook. Clear SOPs. Strong supervisor system.',
            },
            {
                label: 'Sales & Growth',
                value: 'sales-and-growth',
                tagline: 'Aggressive targets. Incentives. Fast hiring. Performance dashboards.',
            },
            {
                label: 'Craft & Quality',
                value: 'craft-and-quality',
                tagline: 'Apprenticeship mindset. Quality gates. Skills matrix. Peer review loops.',
            },
            {
                label: 'People & Culture',
                value: 'people-and-culture',
                tagline: 'Engagement, feedback loops, coaching. Strong rituals. Perks and recognition.',
            },
        ],
    },
    {
        id: 'work_model',
        question: 'What is your primary work model?',
        type: 'select',
        options: [
            { label: 'Fully On-site', value: 'onsite' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Fully Remote', value: 'remote' },
        ],
    },
    {
        id: 'language_support',
        question: 'What language should policies be written in by default?',
        type: 'select',
        description: 'You can always generate both languages for any policy.',
        options: [
            { label: 'English only', value: 'en' },
            { label: 'Amharic only', value: 'am' },
            { label: 'Bilingual (English + Amharic)', value: 'both', tagline: 'Recommended' },
        ],
    },
];
