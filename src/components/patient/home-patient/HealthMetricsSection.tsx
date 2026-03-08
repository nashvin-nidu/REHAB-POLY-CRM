import React from 'react';
import { Section, HealthMetric } from './ui-blocks';

interface HealthMetricsSectionProps {
    onSync: () => void;
}

export function HealthMetricsSection({ onSync }: HealthMetricsSectionProps) {
    return (
        <Section title="Today's Health" action="Sync ↻" onAction={onSync}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-3 mb-3 lg:mb-5">
                <HealthMetric icon="❤️" label="Heart Rate" value="72" unit="bpm" trend="↓ Normal" trendColor="text-green-600" bg="bg-red-100" />
                <HealthMetric icon="💧" label="SpO₂" value="98" unit="%" trend="↑ Excellent" trendColor="text-green-600" bg="bg-blue-100" />
                <HealthMetric icon="🏃" label="Active Today" value="47" unit="min" trend="→ On track" trendColor="text-blue-600" bg="bg-green-100" />
                <HealthMetric icon="😴" label="Sleep" value="7.2" unit="hrs" trend="↑ Good" trendColor="text-green-600" bg="bg-amber-100" />
            </div>
        </Section>
    );
}
