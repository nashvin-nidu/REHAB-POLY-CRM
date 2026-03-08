import React from 'react';
import { Section } from './ui-blocks';

interface TodayPlanSectionProps {
    onNavigate: (tab: string) => void;
}

export function TodayPlanSection({ onNavigate }: TodayPlanSectionProps) {
    const exercises = [
        { name: 'Biceps Curl', duration: '12 min', done: true },
        { name: 'Diaphragmatic Breathing', duration: '10 min', done: true },
        { name: 'Seated Trunk Balance', duration: '12 min', done: true },
        { name: 'Wrist Extension', duration: '10 min', done: false },
        { name: 'Triceps Strengthening', duration: '15 min', done: false }
    ];

    return (
        <Section title="Today's Plan" action="3/5 done">
            <div className="bg-pat-card rounded-2xl p-3.5 border border-pat-border shadow-sm mb-3 lg:mb-5">
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                    {exercises.map((ex, i) => (
                        <div key={i} onClick={() => onNavigate('exercises')} className={`w-35 shrink-0 rounded-xl p-3 border cursor-pointer transition-all hover:-translate-y-0.5 ${ex.done ? 'bg-pat-bg border-pat-border opacity-70' : 'bg-pat-blue-soft border-pat-blue/30'} flex flex-col gap-1.5`}>
                            <div className="flex justify-between items-start">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-10 ${ex.done ? 'bg-pat-card text-pat-muted' : 'bg-pat-blue text-white shadow-sm'}`}>
                                    {ex.done ? '✓' : '▶'}
                                </div>
                                <span className="text-9 font-mono text-pat-muted mt-1">{ex.duration}</span>
                            </div>
                            <div className={`text-11 font-bold leading-snug mt-1 ${ex.done ? 'text-pat-muted' : 'text-pat-text'}`}>{ex.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
