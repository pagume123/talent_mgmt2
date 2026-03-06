'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ONBOARDING_STEPS } from '@/lib/constants/onboarding';
import { CompanyArchetype } from '@/lib/utils/archetypes';
import ProgressBar from './ProgressBar';
import { CheckCircle } from 'lucide-react';

export default function OnboardingWizard({ onStepChange }: { onStepChange?: (step: number) => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const step = ONBOARDING_STEPS[currentStep];
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [step.id]: value }));
    };

    const handleNext = () => {
        if (!answers[step.id]) return;
        if (isLastStep) {
            handleSubmit();
        } else {
            const next = currentStep + 1;
            setCurrentStep(next);
            onStepChange?.(next);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            const prev = currentStep - 1;
            setCurrentStep(prev);
            onStepChange?.(prev);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: answers.company_name,
                    archetype: answers.archetype as CompanyArchetype,
                    metadata: answers,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? 'Failed to create company');
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl w-full mx-auto flex flex-col">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </span>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-1 bg-border-main rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-2">
                    {step.question}
                </h1>
                {step.description && (
                    <p className="text-sm text-gray-500">{step.description}</p>
                )}
            </div>

            {/* Input */}
            {step.type === 'input' ? (
                <input
                    type="text"
                    value={answers[step.id] ?? ''}
                    onChange={e => handleSelect(e.target.value)}
                    placeholder="Type here..."
                    autoFocus
                    className="hr-input w-full h-12 text-base font-semibold mb-6"
                    onKeyDown={e => e.key === 'Enter' && answers[step.id] && handleNext()}
                />
            ) : (
                <div className="space-y-2 mb-6">
                    {step.options?.map(option => {
                        const selected = answers[step.id] === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full p-4 rounded-[6px] border text-left flex items-start justify-between gap-3 transition-all ${selected
                                        ? 'border-primary bg-[#EFF6FF]'
                                        : 'border-border-main bg-surface hover:bg-secondary hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className={`font-semibold text-sm ${selected ? 'text-primary' : 'text-gray-900'}`}>
                                        {option.label}
                                    </div>
                                    {option.tagline && (
                                        <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{option.tagline}</div>
                                    )}
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${selected ? 'border-primary bg-primary' : 'border-gray-300'
                                    }`}>
                                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-[#FEE2E2] border border-[#FECACA] text-red-700 text-sm px-4 py-3 rounded-[6px] mb-4">
                    {error}
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border-main">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-sm font-semibold text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={handleNext}
                    disabled={!answers[step.id] || isSubmitting}
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 h-10 rounded-[6px] hover:bg-[#006ee6] transition-colors disabled:opacity-40 disabled:pointer-events-none text-sm"
                >
                    {isSubmitting ? (
                        'Saving...'
                    ) : isLastStep ? (
                        <>
                            <CheckCircle size={15} />
                            Finish Setup
                        </>
                    ) : (
                        'Continue →'
                    )}
                </button>
            </div>
        </div>
    );
}
