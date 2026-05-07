'use server';

import prisma from '@/lib/prisma';

export async function getProgressChartData() {
    try {
        // Fetch all assessments
        const assessments = await prisma.assessment.findMany({
            select: { week: true, recoveryPct: true },
            orderBy: { week: 'asc' }
        });

        if (assessments.length === 0) {
            // Return empty state
            return { success: true, labels: [], data: [] };
        }

        // Group by week and calculate average recovery percentage
        const weekMap = new Map<number, { sum: number, count: number }>();
        for (const a of assessments) {
            const current = weekMap.get(a.week) || { sum: 0, count: 0 };
            current.sum += a.recoveryPct;
            current.count += 1;
            weekMap.set(a.week, current);
        }

        // Sort weeks
        const weeks = Array.from(weekMap.keys()).sort((a, b) => a - b);
        
        const labels = weeks.map(w => `W${w}`);
        const data = weeks.map(w => {
            const entry = weekMap.get(w)!;
            return Math.round(entry.sum / entry.count);
        });

        return { success: true, labels, data };
    } catch (error) {
        console.error('Error fetching progress data:', error);
        return { success: false, error: 'Failed to fetch progress data', labels: [], data: [] };
    }
}
