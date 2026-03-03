'use client';

import React, { useState } from 'react';
import { PatientNav } from './PatientNav';
import { PatientHome } from './PatientHome';
import { PatientExercises } from './PatientExercises';
import { PatientAI } from './PatientAI';
import { PatientGoals } from './PatientGoals';
import { PatientSchedule } from './PatientSchedule';

export function PhoneFrame() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="w-full h-full bg-pat-bg overflow-hidden flex flex-col-reverse md:flex-row relative font-sora">
            <PatientNav activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 relative overflow-hidden bg-pat-bg flex flex-col">
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col w-full">
                    {activeTab === 'home' && <PatientHome onNavigate={setActiveTab} />}
                    {activeTab === 'exercises' && <PatientExercises />}
                    {activeTab === 'ai' && <PatientAI />}
                    {activeTab === 'goals' && <PatientGoals />}
                    {activeTab === 'schedule' && <PatientSchedule />}
                </div>
            </div>
        </div>
    );
}
