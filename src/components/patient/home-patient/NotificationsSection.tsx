import React from 'react';
import { Section } from './ui-blocks';

interface NotificationsSectionProps {
    onClear: () => void;
}

export function NotificationsSection({ onClear }: NotificationsSectionProps) {
    return (
        <Section title="Notifications" action="Clear all" onAction={onClear}>
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
    );
}
