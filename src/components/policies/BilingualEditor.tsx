'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BilingualEditorProps {
    initialEnglish?: string;
    initialAmharic?: string;
    archetype?: string;
}

export default function BilingualEditor({
    initialEnglish = '',
    initialAmharic = '',
    archetype = 'Balanced'
}: BilingualEditorProps) {
    const [title, setTitle] = useState('');
    const [contentEn, setContentEn] = useState(initialEnglish);
    const [contentAm, setContentAm] = useState(initialAmharic);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!contentEn) return;

        setIsGenerating(true);
        try {
            const res = await fetch('/api/policies/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentEn, archetype }),
            });

            const data = await res.json();
            if (data.amharic) {
                setContentAm(data.amharic);
            } else {
                alert(data.error || "Failed to generate translation");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/policies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title_en: title,
                    title_am: title, // Simplified for MVP
                    content_en: contentEn,
                    content_am: contentAm
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save policy');
            }

            router.push('/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to save policy");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Bilingual Policy</h1>
                    <p className="text-gray-500 mt-1">Write in English and generate AI-powered Amharic version.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !title || !contentEn || !contentAm}
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Policy'}
                    </button>
                </div>
            </div>

            <div className="hr-card bg-white p-6 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Policy Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Code of Conduct"
                    className="w-full text-xl font-medium border-0 border-b border-gray-100 focus:ring-0 focus:border-blue-600 px-0 pb-2 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                {/* English Side */}
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 px-2">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">English Version</h2>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !contentEn}
                            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-all disabled:opacity-50 group"
                        >
                            <span className={`w-3 h-3 border-2 border-current border-t-transparent rounded-full ${isGenerating ? 'animate-spin' : 'hidden'}`} />
                            {isGenerating ? 'Generating...' : '✨ Generate Bilingual'}
                        </button>
                    </div>
                    <div className="hr-card flex-1 p-0 overflow-hidden group focus-within:border-blue-200 transition-all">
                        <textarea
                            value={contentEn}
                            onChange={(e) => setContentEn(e.target.value)}
                            placeholder="Paste or write English policy here..."
                            className="w-full h-full p-6 text-lg text-gray-700 resize-none border-0 focus:ring-0 leading-relaxed font-serif"
                        />
                    </div>
                </div>

                {/* Amharic Side */}
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3 px-2">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Amharic Version (AI)</h2>
                        <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Editable</span>
                    </div>
                    <div className="hr-card flex-1 p-0 overflow-hidden bg-gray-50/30 border-dashed focus-within:border-blue-200 focus-within:bg-white transition-all">
                        <textarea
                            value={contentAm}
                            onChange={(e) => setContentAm(e.target.value)}
                            placeholder="Amharic version will appear here..."
                            className="w-full h-full p-6 text-lg text-gray-800 resize-none border-0 focus:ring-0 leading-loose font-sans"
                            dir="auto"
                        />
                        {!contentAm && !isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-gray-300 text-sm italic">Generate to fill this side</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
