'use client';

import { useState } from 'react';
import RequestForm from "@/components/tma/RequestForm";

export default function TMARequests() {
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-5xl">✅</div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Request Sent!</h1>
                    <p className="text-gray-500 mt-2">Your supervisor will be notified immediately. You can track the status here.</p>
                </div>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 font-bold uppercase tracking-widest text-xs py-2 px-4 bg-blue-50 rounded-full"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <header>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Requests</h1>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
                    Submit Leave or Expense Claims
                </p>
            </header>

            <div className="bg-white border border-gray-100 p-6 rounded-3xl">
                <RequestForm onSuccess={() => setSubmitted(true)} />
            </div>

            <section className="space-y-4">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent Activity</h2>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center text-gray-300 text-xs italic">
                    No recent requests found
                </div>
            </section>
        </div>
    );
}
