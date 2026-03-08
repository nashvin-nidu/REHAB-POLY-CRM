'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/components/ui/Toast';
import {
    PatientHeader,
    QuickActionsSection,
    HealthMetricsSection,
    TodayPlanSection,
    DailyCheckInSection,
    WaterIntakeSection,
    MedicationsSection,
    NotificationsSection,
    EmergencyContactSection
} from './home-patient';

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
            <PatientHeader patient={patient} />

            <div className="px-3.5 pt-3 lg:p-6 lg:pt-6 flex-1 w-full max-w-container-xl mx-auto">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start w-full">
                    {/* Left Column */}
                    <div className="flex flex-col">
                        <QuickActionsSection
                            onNavigate={onNavigate}
                            onCallTherapist={() => toast('📞 Connecting to Therapist...', 'info')}
                        />
                        <HealthMetricsSection
                            onSync={() => toast('Syncing health data...', 'info')}
                        />
                        <TodayPlanSection
                            onNavigate={onNavigate}
                        />
                        <DailyCheckInSection
                            pain={pain}
                            setPain={setPain}
                            mood={mood}
                            setMood={setMood}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col mt-3 mb-10 lg:mt-0">
                        <WaterIntakeSection />
                        <MedicationsSection />
                        <NotificationsSection
                            onClear={() => toast('Notifications cleared', 'success')}
                        />
                        <EmergencyContactSection
                            patient={patient}
                            onCallEmergency={() => toast('Calling Dr. Sarah Chen...', 'info')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
