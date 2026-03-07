'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function ExercisesLibrary() {
    const exercises = useAppStore(s => s.exercises);

    const getDiffTag = (diff: string) => {
        const map: any = { Beginner: 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/20', Intermediate: 'text-adm-warn bg-adm-warn/10 border-adm-warn/20', Advanced: 'text-adm-danger bg-adm-danger/10 border-adm-danger/20' };
        return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-10 font-bold uppercase tracking-wide border ${map[diff] || map.Beginner}`}>{diff}</span>;
    };

    return (
        <div className="p-6 pb-20">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-20 font-bold text-adm-text tracking-tight">SCI Exercise Library</h1>
                    <p className="text-xs text-adm-muted mt-1 font-mono">{exercises.length} approved exercises</p>
                </div>
                <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Add Exercise</Button>
            </div>

            <div className="bg-adm-card border border-adm-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Exercise</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Category</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Target</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Difficulty</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Duration</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.map(ex => (
                                <tr key={ex.id} className="hover:bg-white/5 border-b border-adm-border2 last:border-none cursor-pointer transition-colors">
                                    <td className="p-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-adm-surface border border-adm-border2 flex items-center justify-center text-lg shadow-sm">
                                                {ex.emoji}
                                            </div>
                                            <div className="text-13 font-semibold text-adm-text">{ex.name}</div>
                                        </div>
                                    </td>
                                    <td className="p-3 px-4 text-xs text-adm-muted">{ex.category}</td>
                                    <td className="p-3 px-4 text-xs text-adm-muted max-w-180px truncate" title={ex.target}>{ex.target}</td>
                                    <td className="p-3 px-4">{getDiffTag(ex.difficulty)}</td>
                                    <td className="p-3 px-4 text-11 font-mono text-adm-muted">{ex.duration} min</td>
                                    <td className="p-3 px-4">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
