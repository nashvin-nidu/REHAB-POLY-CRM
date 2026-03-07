'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/components/ui/Toast';
import { Phone, ChevronRight } from 'lucide-react';

export function PatientHome({ onNavigate }: { onNavigate: (tab: string) => void }) {
    const { toast } = useToast();
    const activePatientId = useAppStore(s => s.activePatientId);
    const patients = useAppStore(s => s.patients);
    const patient = patients.find(p => p.id === activePatientId);

    const [pain, setPain] = useState<number | null>(null);
    const [mood, setMood] = useState<string | null>(null);

    if (!patient) return null;

    return (
        <div className="flex-1 flex flex-col pb-4 h-full relative">
            <div className="bg-gradient-to-br from-pat-navy via-[#1e4a7a] to-[#0d3a6e] px-5.5 pt-5 pb-7 relative overflow-hidden shrink-0 lg:sticky lg:top-0 lg:z-50 shadow-md">
                <div className="absolute -top-15 -right-10 w-50 h-50 rounded-full bg-blue-600/20" />
                <div className="absolute -bottom-30px left-15 w-30 h-30 rounded-full bg-teal-600/15" />

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="text-11 text-white/55 font-medium tracking-wide border border-transparent uppercase mb-1">Good Morning ☀️</div>
                        <div className="text-22 font-extrabold text-white tracking-tight mb-0.5">{patient.firstName} {patient.lastName}</div>
                        <div className="text-12 text-white/60 mb-2.5">{patient.injuryLevel} · {patient.ais} · Week {patient.week}</div>

                        <div className="inline-flex items-center gap-1.5 mt-1 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full backdrop-blur-md">
                            <div className="w-5px h-5px bg-green-400 rounded-full" />
                            <div className="text-11 text-white/85 font-medium">Active Rehabilitation</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="relative w-16 h-16 transform -rotate-90 origin-center mx-auto">
                            <svg className="w-full h-full" viewBox="0 0 64 64">
                                <circle cx="32" cy="32" r="26" fill="none" className="stroke-slate-200/20" strokeWidth="6" />
                                <circle cx="32" cy="32" r="26" fill="none" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" strokeDasharray="163" strokeDashoffset={163 - (163 * 0.68)} className="transition-all duration-1000 ease-out" />
                            </svg>
                        </div>
                        <div className="text-10 text-white/60 mt-0.5 font-bold">Today 68%</div>
                    </div>
                </div>
            </div>

            <div className="px-3.5 pt-3 lg:p-6 lg:pt-6 flex-1 w-full max-w-container-xl mx-auto">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start w-full">
                    {/* Left Column */}
                    <div className="flex flex-col">
                        <Section title="Quick Actions">
                            <div className="grid grid-cols-4 gap-2 md:gap-3 mb-3 lg:mb-5">
                                <QuickAction icon="💪" label="Start Exercise" color="bg-pat-blue-soft" onClick={() => onNavigate('exercises')} />
                                <QuickAction icon="🧠" label="Ask AI" color="bg-purple-100" onClick={() => onNavigate('ai')} />
                                <QuickAction icon="📞" label="Call Therapist" color="bg-pat-teal-soft" onClick={() => toast('📞 Connecting to Therapist...', 'info')} />
                                <QuickAction icon="📅" label="Schedule" color="bg-pat-amber-soft" onClick={() => onNavigate('schedule')} />
                            </div>
                        </Section>

                        <Section title="Today's Health" action="Sync ↻" onAction={() => toast('Syncing health data...', 'info')}>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-3 mb-3 lg:mb-5">
                                <HealthMetric icon="❤️" label="Heart Rate" value="72" unit="bpm" trend="↓ Normal" trendColor="text-green-600" bg="bg-red-100" />
                                <HealthMetric icon="💧" label="SpO₂" value="98" unit="%" trend="↑ Excellent" trendColor="text-green-600" bg="bg-blue-100" />
                                <HealthMetric icon="🏃" label="Active Today" value="47" unit="min" trend="→ On track" trendColor="text-blue-600" bg="bg-green-100" />
                                <HealthMetric icon="😴" label="Sleep" value="7.2" unit="hrs" trend="↑ Good" trendColor="text-green-600" bg="bg-amber-100" />
                            </div>
                        </Section>

                        <Section title="Today's Plan" action="3/5 done">
                            <div className="bg-pat-card rounded-2xl p-3.5 border border-pat-border shadow-sm mb-3 lg:mb-5">
                                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                                    {[
                                        { name: 'Biceps Curl', duration: '12 min', done: true },
                                        { name: 'Diaphragmatic Breathing', duration: '10 min', done: true },
                                        { name: 'Seated Trunk Balance', duration: '12 min', done: true },
                                        { name: 'Wrist Extension', duration: '10 min', done: false },
                                        { name: 'Triceps Strengthening', duration: '15 min', done: false }
                                    ].map((ex, i) => (
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

                        <Section title="Daily Check-in">
                            <div className="bg-pat-card rounded-2xl p-4 border border-pat-border shadow-sm mb-3 lg:mb-5">
                                <div className="mb-3.5">
                                    <div className="flex justify-between mb-1.5"><span className="text-12 font-bold text-pat-text">Pain Level</span><span className="text-11 text-pat-muted">{pain !== null ? `${pain}/5 Recorded` : 'Tap to rate'}</span></div>
                                    <div className="flex gap-1">
                                        {[
                                            { val: 0, bg: 'bg-[#dcfce7]', color: 'text-[#16a34a]' },
                                            { val: 1, bg: 'bg-[#d1fae5]', color: 'text-[#059669]' },
                                            { val: 2, bg: 'bg-[#fef3c7]', color: 'text-[#d97706]' },
                                            { val: 3, bg: 'bg-[#fed7aa]', color: 'text-[#ea580c]' },
                                            { val: 4, bg: 'bg-[#fecaca]', color: 'text-[#dc2626]' },
                                            { val: 5, bg: 'bg-[#fee2e2]', color: 'text-[#b91c1c]' },
                                        ].map(p => (
                                            <button key={p.val} onClick={() => setPain(p.val)} className={`flex-1 h-8 rounded-lg text-11 font-bold transition-all border-2 border-transparent ${p.bg} ${p.color} ${pain === p.val ? 'border-pat-navy scale-110' : ''}`}>
                                                {p.val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-12 font-bold text-pat-text mb-1.5">How are you feeling?</div>
                                    <div className="flex justify-center gap-2">
                                        {['😊', '😐', '😔', '😤', '💪'].map(m => (
                                            <button key={m} onClick={() => setMood(m)} className={`w-10 h-10 rounded-xl text-20 flex items-center justify-center transition-all bg-pat-bg border-2 border-transparent ${mood === m ? 'border-pat-blue bg-pat-blue-soft scale-110' : ''}`}>
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col mt-3 mb-10 lg:mt-0">
                        <Section title="Water Intake" action="4/8 glasses">
                            <div className="bg-pat-card rounded-2xl p-4 border border-pat-border shadow-sm mb-3 lg:mb-5">
                                <div className="flex justify-between gap-1.5">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className={`flex-1 aspect-[1/1.3] rounded-t-lg rounded-b-md border-[1.5px] cursor-pointer transition-all hover:-translate-y-px ${i <= 4 ? 'bg-blue-100 border-blue-400/40 relative overflow-hidden shadow-sm' : 'bg-pat-bg border-pat-border border-dashed'}`}>
                                            {i <= 4 && <div className="absolute bottom-0 left-0 right-0 bg-blue-400 opacity-60" style={{ height: '75%' }} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        <Section title="Medications">
                            <div className="bg-pat-card rounded-2xl p-4 border border-pat-border shadow-sm mb-3 lg:mb-5 divide-y divide-pat-border">
                                <div className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                                    <div className="w-30px h-30px bg-blue-100 rounded-9px flex items-center justify-center text-14">💊</div>
                                    <div>
                                        <div className="text-12 font-bold text-pat-text">Baclofen 10mg</div>
                                        <div className="text-10 text-pat-muted">3× daily · Spasticity</div>
                                    </div>
                                    <div className="ml-auto text-10 font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-600">✓ Taken</div>
                                </div>
                                <div className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                                    <div className="w-30px h-30px bg-amber-100 rounded-9px flex items-center justify-center text-14">💊</div>
                                    <div>
                                        <div className="text-12 font-bold text-pat-text">Gabapentin 300mg</div>
                                        <div className="text-10 text-pat-muted">2× daily · Neuropathic pain</div>
                                    </div>
                                    <div className="ml-auto text-10 font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-600">⏰ 6 PM</div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Notifications" action="Clear all" onAction={() => toast('Notifications cleared', 'success')}>
                            <div className="bg-pat-card rounded-2xl p-4 border border-pat-border shadow-sm mb-3 lg:mb-5 divide-y divide-pat-border">
                                <div className="py-2.5 first:pt-0 last:pb-0">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0 shadow-[0_0_6px_rgba(37,99,235,0.4)]" />
                                        <div className="flex-1">
                                            <div className="text-12 text-pat-text leading-[1.4]"><strong>Mark Rivera, PT</strong> — "Great session yesterday! Don't forget breathing exercises today."</div>
                                            <div className="text-10 text-pat-muted mt-1 font-mono">9:14 AM</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2.5 first:pt-0 last:pb-0">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-600 mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-12 text-pat-text leading-[1.4]">🏆 <strong>Milestone reached!</strong> 14 consecutive days of exercise.</div>
                                            <div className="text-10 text-pat-muted mt-1 font-mono">8:00 AM</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2.5 first:pt-0 last:pb-0">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-12 text-pat-text leading-[1.4]">⏰ Appointment reminder: <strong>Neurology Review</strong> — March 8, 2:00 PM</div>
                                            <div className="text-10 text-pat-muted mt-1 font-mono">Yesterday</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="Emergency">
                            <div onClick={() => toast('Calling Dr. Sarah Chen...', 'info')} className="bg-pat-red-soft border-2 border-red-300 rounded-18px p-3.5 flex items-center gap-3 cursor-pointer hover:scale-[0.99] transition-transform mb-3 lg:mb-5">
                                <div className="w-10 h-10 bg-pat-red rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                                    <Phone fill="white" stroke="white" size={18} />
                                </div>
                                <div>
                                    <div className="text-13 font-extrabold text-red-900">Emergency Contact</div>
                                    <div className="text-10 text-pat-red mt-0.5">{patient.therapist} · Tap to call</div>
                                </div>
                                <ChevronRight className="ml-auto text-pat-red" size={20} />
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, action, onAction, children }: any) {
    return (
        <>
            <div className="flex justify-between items-center text-10 font-bold uppercase tracking-[1px] text-pat-muted mb-2 mt-1 px-1">
                {title}
                {action && <span onClick={onAction} className="text-pat-blue cursor-pointer">{action}</span>}
            </div>
            {children}
        </>
    );
}

function QuickAction({ icon, label, color, onClick }: any) {
    return (
        <div onClick={onClick} className="bg-pat-card rounded-14px py-3 px-1.5 border border-pat-border flex flex-col items-center gap-1.5 cursor-pointer shadow-sm hover:-translate-y-0.5 transition-all">
            <div className={`w-34px h-34px rounded-lg flex items-center justify-center text-16 ${color}`}>{icon}</div>
            <span className="text-9 font-bold text-pat-muted text-center tracking-[0.2px] leading-tight">{label}</span>
        </div>
    );
}

function HealthMetric({ icon, label, value, unit, trend, trendColor, bg }: any) {
    return (
        <div className="bg-pat-card rounded-2xl p-3 border border-pat-border shadow-sm flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-10px flex items-center justify-center text-16 ${bg}`}>{icon}</div>
            <div>
                <div className="text-16 font-extrabold text-pat-text leading-none">{value} <span className="text-11 font-medium text-pat-muted">{unit}</span></div>
                <div className="text-10 text-pat-muted font-medium mt-px">{label}</div>
                <div className={`text-10 font-bold mt-0.5 ${trendColor}`}>{trend}</div>
            </div>
        </div>
    );
}
