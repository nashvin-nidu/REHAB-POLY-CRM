'use client';

import React from 'react';
import { ChartCard } from '@/components/ui/ChartCard';

export default function ProgressPage() {
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

    return (
        <div className="p-6 pb-20">
            <div className="mb-6">
                <h1 className="text-20 font-bold text-adm-text tracking-tight">Progress Reports</h1>
                <p className="text-xs text-adm-muted mt-1 font-mono">Detailed recovery metrics across all patients.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
                <ChartCard title="Overall Recovery Trends" subtitle="Last 8 weeks" type="line" data={recoveryData} />
            </div>
        </div>
    );
}
