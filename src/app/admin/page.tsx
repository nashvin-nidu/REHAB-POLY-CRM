'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { ChartCard } from '@/components/ui/ChartCard';
import { Button } from '@/components/ui/Button';
import { Download, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const patients = useAppStore(s => s.patients);
    const activePatients = patients.filter(p => p.status === 'Active').length;
    const criticalPatients = patients.filter(p => p.status === 'Critical').length;
    const avgRecovery = patients.length ? Math.round(patients.reduce((a, b) => a + b.recoveryPct, 0) / patients.length) : 0;

    const recoveryData = {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        datasets: [{
            data: [30, 35, 42, 48, 55, 61, 65, 72],
            borderColor: '#2f81f7',
            backgroundColor: 'rgba(47,129,247,0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const injuryData = {
        labels: ['Cervical', 'Thoracic', 'Lumbar'],
        datasets: [{
            data: [
                patients.filter(p => p.injuryLevel.startsWith('C')).length,
                patients.filter(p => p.injuryLevel.startsWith('T')).length,
                patients.filter(p => p.injuryLevel.startsWith('L')).length,
            ],
            backgroundColor: ['#2f81f7', '#3fb950', '#d29922'],
            borderWidth: 0,
        }]
    };

    const motorData = {
        labels: ['Upper Limb', 'Trunk', 'Fine Motor', 'Sensory'],
        datasets: [{
            data: [
                Math.round(patients.reduce((a, b) => a + b.upperLimb, 0) / patients.length || 0),
                Math.round(patients.reduce((a, b) => a + b.trunk, 0) / patients.length || 0),
                Math.round(patients.reduce((a, b) => a + b.fineMotor, 0) / patients.length || 0),
                Math.round(patients.reduce((a, b) => a + b.sensory, 0) / patients.length || 0),
            ],
            backgroundColor: ['#2f81f7', '#3fb950', '#d29922', '#f85149'],
            borderRadius: 4,
        }]
    };

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
                    <h1 className="text-[20px] font-bold text-adm-text tracking-tight">Clinical Dashboard</h1>
                    <p className="text-xs text-adm-muted mt-1 font-mono">— {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Download className="w-4 h-4" /> Export</Button>
                    <Link href="/admin/add-patient">
                        <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> New Patient</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-adm-card border border-adm-border rounded-xl p-[18px] relative overflow-hidden after:absolute after:top-0 after:right-0 after:w-[3px] after:h-full after:bg-adm-accent">
                    <div className="text-[11px] text-adm-muted font-medium uppercase tracking-wide mb-2">Total Patients</div>
                    <div className="text-[28px] font-extrabold text-adm-text tracking-tight leading-none">{patients.length}</div>
                    <div className="text-[11px] mt-1.5 font-mono text-adm-accent2">{patients.length} registered</div>
                </div>
                <div className="bg-adm-card border border-adm-border rounded-xl p-[18px] relative overflow-hidden after:absolute after:top-0 after:right-0 after:w-[3px] after:h-full after:bg-adm-accent2">
                    <div className="text-[11px] text-adm-muted font-medium uppercase tracking-wide mb-2">Active Rehab</div>
                    <div className="text-[28px] font-extrabold text-adm-text tracking-tight leading-none">{activePatients}</div>
                    <div className="text-[11px] mt-1.5 font-mono text-adm-accent2">In treatment</div>
                </div>
                <div className="bg-adm-card border border-adm-border rounded-xl p-[18px] relative overflow-hidden after:absolute after:top-0 after:right-0 after:w-[3px] after:h-full after:bg-adm-warn">
                    <div className="text-[11px] text-adm-muted font-medium uppercase tracking-wide mb-2">Avg Recovery %</div>
                    <div className="text-[28px] font-extrabold text-adm-text tracking-tight leading-none">{avgRecovery}%</div>
                    <div className="text-[11px] mt-1.5 font-mono text-adm-accent2">↑ improving</div>
                </div>
                <div className="bg-adm-card border border-adm-border rounded-xl p-[18px] relative overflow-hidden after:absolute after:top-0 after:right-0 after:w-[3px] after:h-full after:bg-adm-danger">
                    <div className="text-[11px] text-adm-muted font-medium uppercase tracking-wide mb-2">Critical Alerts</div>
                    <div className="text-[28px] font-extrabold text-adm-text tracking-tight leading-none">{criticalPatients}</div>
                    <div className="text-[11px] mt-1.5 font-mono text-adm-danger">Needs attention</div>
                </div>
            </div>

            <div className="grid grid-cols-[1.5fr_1fr] gap-4 mb-4">
                <ChartCard title="Recovery Trends" subtitle="Last 8 weeks" type="line" data={recoveryData} />
                <ChartCard title="Injury Tracking" type="doughnut" data={injuryData} options={{ cutout: '75%' }} />
            </div>

            <div className="bg-adm-card border border-adm-border rounded-xl mb-4 overflow-hidden">
                <div className="p-4 border-b border-adm-border2 flex justify-between items-center">
                    <div className="text-[13px] font-semibold text-adm-text">Patient Overview</div>
                    <Link href="/admin/patients"><Button variant="ghost" size="sm">View All →</Button></Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Patient</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Injury</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">AIS</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Week</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Recovery</th>
                                <th className="text-[10px] font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.slice(0, 5).map(p => (
                                <tr key={p.id} className="hover:bg-white/5 border-b border-adm-border2 last:border-none">
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
                                    <td className="p-3 px-4 text-xs"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border text-adm-teal bg-adm-teal/10 border-adm-teal/20">{p.injuryLevel}</span></td>
                                    <td className="p-3 px-4 text-xs"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border text-adm-muted bg-adm-muted/10 border-adm-muted/20">{p.ais}</span></td>
                                    <td className="p-3 px-4 text-[11px] font-mono text-adm-muted">W{p.week}</td>
                                    <td className="p-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-14 bg-adm-border rounded-full overflow-hidden">
                                                <div className="h-full bg-adm-accent" style={{ width: `${p.recoveryPct}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-adm-text">{p.recoveryPct}%</span>
                                        </div>
                                    </td>
                                    <td className="p-3 px-4">{getStatusTag(p.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ChartCard title="Motor Domain Averages" type="bar" data={motorData} />
                <div className="bg-adm-card border border-adm-border rounded-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-adm-border2 flex justify-between items-center shrink-0">
                        <div className="text-[13px] font-semibold text-adm-text">Activity Feed</div>
                        <div className="text-[11px] font-mono text-adm-muted">4 events</div>
                    </div>
                    <div className="p-4 max-h-[220px] overflow-y-auto space-y-3 scrollbar-hide">
                        {[
                            { time: '10:45 AM', msg: 'James Mitchell started daily exercise routine.', color: '#2f81f7' },
                            { time: '09:30 AM', msg: 'Dr. Sarah Chen updated clinical notes for Maria.', color: '#3fb950' },
                            { time: '08:15 AM', msg: 'Aisha Okonkwo critical vitals alert triggered.', color: '#f85149' },
                            { time: 'Yesterday', msg: 'Robert Kim reached 75% recovery milestone!', color: '#d29922' },
                        ].map((log, i) => (
                            <div key={i} className="flex gap-2.5 items-start">
                                <div className="font-mono text-[10px] text-adm-muted w-16 shrink-0 pt-[2px]">{log.time}</div>
                                <div className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0" style={{ background: log.color }} />
                                <div className="text-xs text-adm-muted leading-relaxed">{log.msg}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
