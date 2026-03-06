'use client';

import React from 'react';

interface HRTableProps {
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
    className?: string;
}

export default function HRTable({ headers, rows, className = '' }: HRTableProps) {
    return (
        <div className={`overflow-x-auto border border-border-main rounded-[6px] bg-white ${className}`}>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#F8FAFC]">
                        {headers.map((header, i) => (
                            <th key={i} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-widest border-b border-border-main">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-secondary transition-colors group">
                            {row.map((cell, j) => (
                                <td key={j} className="px-6 py-4 border-b border-border-main text-sm text-gray-700">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-400 italic">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
