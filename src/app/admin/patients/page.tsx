'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function PatientsList() {
    const patients = useAppStore(s => s.patients);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    const filteredPatients = useMemo(() => {
        return patients.filter(p => {
            const matchSearch = (p.firstName + ' ' + p.lastName).toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter ? p.status === filter : true;
            return matchSearch && matchFilter;
        });
    }, [patients, search, filter]);

    const getStatusTag = (status: string) => {
        const map: Record<string, string> = {
            Active: 'text-[#3fb950] bg-[#3fb950]/10 border-[#3fb950]/20',
            Discharged: 'text-adm-muted bg-adm-muted/10 border-adm-muted/20',
            Critical: 'text-adm-danger bg-adm-danger/10 border-adm-danger/20'
        };
        return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${map[status] || map.Active}`}>{status}</span>;
    };

    return (
        <div className="p-6 pb-20">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-[20px] font-bold text-adm-text tracking-tight">All Patients</h1>
                    <p className="text-xs text-adm-muted mt-1 font-mono">{patients.length} registered</p>
                </div>
                <Link href="/admin/add-patient">
                    <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Add Patient</Button>
                </Link>
            </div>

            <div className="flex gap-3 mb-4">
                <div className="relative w-[280px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-adm-muted" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-adm-surface border border-adm-border rounded-md py-[7px] pl-9 pr-3 text-[12px] text-adm-text outline-none focus:border-adm-accent transition-colors font-sora"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-adm-surface border border-adm-border rounded-md px-3 py-[7px] text-[12px] text-adm-text outline-none focus:border-adm-accent font-sora min-w-[130px]"
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Critical">Critical</option>
                    <option value="Discharged">Discharged</option>
                </select>
            </div>

            <div className="bg-adm-card border border-adm-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Patient</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Age/Gender</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Injury</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">AIS</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Week</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Recovery</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(p => {
                                const age = p.dob ? Math.floor((new Date().getTime() - new Date(p.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : '--';
                                return (
                                    <tr key={p.id} className="hover:bg-white/5 border-b border-adm-border2 last:border-none cursor-pointer transition-colors">
                                        <td className="p-3 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-adm-accent shrink-0">
                                                    {p.firstName[0]}{p.lastName[0]}
                                                </div>
                                                <div>
                                                    <div className="text-[13px] font-semibold text-adm-text">{p.firstName} {p.lastName}</div>
                                                    <div className="font-mono text-[11px] text-adm-muted">#P{String(p.id).padStart(4, '0')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 px-4 text-xs text-adm-muted font-mono">{age}y / {p.gender[0]}</td>
                                        <td className="p-3 px-4 text-xs"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border text-adm-teal bg-adm-teal/10 border-adm-teal/20">{p.injuryLevel}</span></td>
                                        <td className="p-3 px-4 text-xs"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border text-adm-muted bg-adm-muted/10 border-adm-muted/20">{p.ais}</span></td>
                                        <td className="p-3 px-4 text-[11px] font-mono text-adm-muted">W{p.week}</td>
                                        <td className="p-3 px-4">
                                            <div className="flex items-center gap-2 w-24">
                                                <div className="h-1.5 w-full bg-adm-border rounded-full overflow-hidden">
                                                    <div className="h-full bg-adm-accent" style={{ width: `${p.recoveryPct}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-adm-text w-6">{p.recoveryPct}%</span>
                                            </div>
                                        </td>
                                        <td className="p-3 px-4">{getStatusTag(p.status)}</td>
                                    </tr>
                                )
                            })}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-adm-muted text-sm border-none">
                                        No patients found matching the criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
