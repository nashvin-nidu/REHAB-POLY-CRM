'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function AppointmentsList() {
    const appointments = useAppStore(s => s.appointments);
    const patients = useAppStore(s => s.patients);

    return (
        <div className="p-6 pb-20">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-20 font-bold text-adm-text tracking-tight">Appointments</h1>
                    <p className="text-xs text-adm-muted mt-1 font-mono">Upcoming and historical</p>
                </div>
                <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Schedule</Button>
            </div>

            <div className="bg-adm-card border border-adm-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Patient</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Type</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Date & Time</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Therapist</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Mode</th>
                                <th className="text-10 font-bold tracking-wide uppercase text-adm-muted p-3 px-4 bg-adm-surface border-b border-adm-border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => {
                                const pt = patients.find(p => p.id === app.patientId);
                                return (
                                    <tr key={app.id} className="hover:bg-white/5 border-b border-adm-border2 last:border-none cursor-pointer transition-colors">
                                        <td className="p-3 px-4 text-13 font-semibold text-adm-text">
                                            {pt ? `${pt.firstName} ${pt.lastName}` : 'Unknown Patient'}
                                        </td>
                                        <td className="p-3 px-4 text-xs text-adm-muted">{app.type}</td>
                                        <td className="p-3 px-4 text-xs">
                                            <div className="flex gap-2">
                                                <span className="text-adm-text">{app.date}</span>
                                                <span className="text-adm-muted font-mono">{app.time}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 px-4 text-xs text-adm-muted">{app.therapist}</td>
                                        <td className="p-3 px-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-10 font-bold uppercase tracking-wide border text-adm-accent border-adm-accent/20 bg-adm-accent/10">
                                                {app.mode}
                                            </span>
                                        </td>
                                        <td className="p-3 px-4 text-xs"><span className="text-[#3fb950] font-semibold">{app.status}</span></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
