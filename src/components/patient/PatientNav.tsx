'use client';

import React from 'react';
import { Home, Activity, MessageSquare, Target, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function PatientNav() {
    const pathname = usePathname();
    const tabs = [
        { href: '/user', exact: true, label: 'Home', icon: Home },
        { href: '/user/exercises', exact: false, label: 'Exercises', icon: Activity },
        { href: '/user/chat', exact: false, label: 'AI Guide', icon: MessageSquare },
        { href: '/user/goals', exact: false, label: 'Goals', icon: Target },
        { href: '/user/schedule', exact: false, label: 'Schedule', icon: Calendar },
    ];

    return (
        <div className="flex md:flex-col bg-pat-card border-t md:border-t-0 md:border-r border-pat-border px-2.5 py-2 md:py-6 md:w-100px shrink-0 justify-around md:justify-start gap-0 md:gap-4 md:items-center">
            {tabs.map(tab => {
                const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`flex-1 md:flex-none md:w-full flex flex-col items-center justify-center gap-1.5 cursor-pointer p-2 rounded-xl transition-all ${isActive ? 'bg-pat-blue-soft' : 'hover:bg-pat-bg'}`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-pat-navy text-white shadow-md' : 'text-pat-muted'}`}>
                            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                        </div>
                        <span className={`text-10 md:text-11 font-bold tracking-wide ${isActive ? 'text-pat-navy' : 'text-pat-muted'}`}>
                            {tab.label}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
