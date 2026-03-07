'use client';

import React from 'react';
import { Home, Activity, MessageSquare, Target, Calendar } from 'lucide-react';

interface PatientNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function PatientNav({ activeTab, onTabChange }: PatientNavProps) {
    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'exercises', label: 'Exercises', icon: Activity },
        { id: 'ai', label: 'AI Guide', icon: MessageSquare },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
    ];

    return (
        <div className="flex md:flex-col bg-pat-card border-t md:border-t-0 md:border-r border-pat-border px-2.5 py-2 md:py-6 md:w-100px shrink-0 justify-around md:justify-start gap-0 md:gap-4 md:items-center">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                    <div
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 md:flex-none md:w-full flex flex-col items-center justify-center gap-1.5 cursor-pointer p-2 rounded-xl transition-all ${isActive ? 'bg-pat-blue-soft' : 'hover:bg-pat-bg'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-pat-navy text-white shadow-md' : 'text-pat-muted'}`}>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                        </div>
                        <span className={`text-10 md:text-11 font-bold tracking-wide ${isActive ? 'text-pat-navy' : 'text-pat-muted'}`}>
                            {tab.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
