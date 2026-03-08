import React from 'react';
import { Section } from './ui-blocks';

export function MedicationsSection() {
    return (
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
    );
}
