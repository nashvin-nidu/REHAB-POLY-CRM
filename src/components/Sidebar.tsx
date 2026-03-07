'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    Activity,
    TrendingUp,
    Calendar,
    Clock,
    LogOut
} from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();
    const patientsCount = useAppStore(s => s.patients.length);
    const exerciseCount = useAppStore(s => s.exercises.length);

    const navItems = [
        { section: 'Overview' },
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { section: 'Patients' },
        { name: 'All Patients', href: '/admin/patients', icon: Users, badge: patientsCount, badgeColor: 'bg-adm-accent/15 text-adm-accent' },
        { name: 'Register Patient', href: '/admin/add-patient', icon: UserPlus },
        { section: 'Clinical' },
        { name: 'Exercise Library', href: '/admin/exercises', icon: Activity, badge: exerciseCount, badgeColor: 'bg-adm-accent/15 text-adm-accent' },
        { name: 'Progress Reports', href: '/admin/progress', icon: TrendingUp },
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
        { section: 'System' },
        { name: 'Activity Log', href: '/admin/activity', icon: Clock },
    ];

    return (
        <aside className="w-220px bg-adm-surface border-r border-adm-border flex flex-col shrink-0 overflow-y-auto scrollbar-hide py-4 pb-5">
            {navItems.map((item, idx) => {
                if (item.section) {
                    return (
                        <div key={idx} className="text-10 font-semibold tracking-[1.2px] uppercase text-adm-muted px-4 pt-4 pb-1.5">
                            {item.section}
                        </div>
                    );
                }

                const isActive = pathname === item.href;
                const Icon = item.icon!;

                return (
                    <Link
                        key={item.href}
                        href={item.href!}
                        className={`flex items-center gap-2.5 px-4 py-2 cursor-pointer text-13 font-medium transition-all border-l-2 my-px ${isActive
                            ? 'text-adm-accent bg-adm-accent/10 border-adm-accent'
                            : 'text-adm-muted border-transparent hover:text-adm-text hover:bg-white/5'
                            }`}
                    >
                        <Icon size={14} className="shrink-0" />
                        {item.name}
                        {item.badge !== undefined && (
                            <span className={`ml-auto text-10 font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                );
            })}

            <div className="mt-auto px-4 pt-3 border-t border-adm-border2">
                <button className="w-full flex items-center gap-2 bg-adm-card hover:bg-white/5 transition-colors cursor-pointer rounded-lg px-2.5 py-2 text-left border border-transparent hover:border-adm-border">
                    <div className="w-7 h-7 rounded-md bg-[#2f81f7] flex items-center justify-center text-11 font-bold text-white shrink-0">
                        DR
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-adm-text">Dr. Sarah Chen</div>
                        <div className="text-10 text-adm-muted">Lead Neurologist</div>
                    </div>
                    <LogOut size={14} className="text-adm-muted shrink-0" />
                </button>
            </div>
        </aside>
    );
}
